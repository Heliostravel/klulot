import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import * as XLSX from 'npm:xlsx@0.18.5';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('fileType') as string; // 'excel', 'googlesheets_url', 'word'
    const sheetsUrl = formData.get('sheetsUrl') as string;

    let guests: Array<{ name: string; phone?: string; invited_count?: number }> = [];

    if (fileType === 'googlesheets_url' && sheetsUrl) {
      // Extract sheet ID and fetch as CSV
      const match = sheetsUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (!match) {
        return Response.json({ error: 'קישור Google Sheets לא תקין' }, { status: 400 });
      }
      const sheetId = match[1];
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
      const resp = await fetch(csvUrl);
      if (!resp.ok) {
        return Response.json({ error: 'לא ניתן לגשת לגיליון. ודאו שהוא ציבורי (Public)' }, { status: 400 });
      }
      const csvText = await resp.text();
      guests = parseCSV(csvText);

    } else if (file && (fileType === 'excel' || file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv'))) {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
      guests = parseRows(rows);

    } else if (file && (fileType === 'word' || file.name.endsWith('.docx') || file.name.endsWith('.doc'))) {
      // For Word files, try to extract text and parse as structured list
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      if (sheetName) {
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
        guests = parseRows(rows);
      } else {
        return Response.json({ error: 'לא ניתן לקרוא קובץ Word. נסו להמיר לאקסל' }, { status: 400 });
      }
    } else {
      return Response.json({ error: 'סוג קובץ לא נתמך' }, { status: 400 });
    }

    return Response.json({ guests, count: guests.length });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function parseCSV(csv: string): Array<{ name: string; phone?: string; invited_count?: number }> {
  const lines = csv.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];

  // Check if first line is header
  const firstLine = lines[0].toLowerCase();
  const hasHeader = firstLine.includes('שם') || firstLine.includes('name') || firstLine.includes('אורח') || firstLine.includes('טלפון') || firstLine.includes('phone');
  const dataLines = hasHeader ? lines.slice(1) : lines;

  return dataLines.map(line => {
    const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    return buildGuest(cols);
  }).filter(g => g.name && g.name.length > 0);
}

function parseRows(rows: any[][]): Array<{ name: string; phone?: string; invited_count?: number }> {
  if (rows.length === 0) return [];

  // Check if first row is header
  const firstRow = rows[0].map(c => String(c ?? '').toLowerCase());
  const hasHeader = firstRow.some(c => c.includes('שם') || c.includes('name') || c.includes('אורח') || c.includes('phone') || c.includes('טלפון'));
  const dataRows = hasHeader ? rows.slice(1) : rows;

  return dataRows.map(row => {
    const cols = row.map(c => String(c ?? '').trim());
    return buildGuest(cols);
  }).filter(g => g.name && g.name.length > 0);
}

function buildGuest(cols: string[]): { name: string; phone?: string; invited_count?: number } {
  // Try to detect column order from content
  let name = '', phone = '', invited_count = 2;

  if (cols.length === 1) {
    name = cols[0];
  } else if (cols.length >= 2) {
    // Heuristic: phone numbers contain digits and dashes
    const isPhone = (s: string) => /^[\d\-\+\s\(\)]{7,}$/.test(s.replace(/\s/g, ''));
    const isNumber = (s: string) => /^\d+$/.test(s.trim());

    if (isPhone(cols[1])) {
      name = cols[0];
      phone = cols[1].replace(/\D/g, '').replace(/^972/, '0');
      if (cols[2] && isNumber(cols[2])) invited_count = parseInt(cols[2]) || 2;
    } else if (isPhone(cols[0])) {
      phone = cols[0].replace(/\D/g, '').replace(/^972/, '0');
      name = cols[1];
      if (cols[2] && isNumber(cols[2])) invited_count = parseInt(cols[2]) || 2;
    } else {
      name = cols[0];
      if (cols[1] && isNumber(cols[1])) invited_count = parseInt(cols[1]) || 2;
      else if (cols[2] && isNumber(cols[2])) invited_count = parseInt(cols[2]) || 2;
    }
  }

  if (!name) return { name: '' };

  const guest: { name: string; phone?: string; invited_count: number } = { name, invited_count };
  if (phone) guest.phone = phone;
  return guest;
}

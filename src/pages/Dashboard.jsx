import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { WeddingEvent, Guest } from "@/api/entities";
import { Send, Download, Eye, Users, Check, X, Bell, Plus, Copy, Loader2, Upload, FileSpreadsheet, FileText, Link2, AlertCircle, Trash2, MessageCircle, ExternalLink } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";

const statusLabels = { attending: "מגיעים", declined: "לא מגיעים", maybe: "מתלבטים", pending: "ממתינים" };
const statusColors = {
  attending: { bg: "#f0f9eb", text: "#4a7c30", border: "#a8d48a" },
  declined: { bg: "#fdf0f0", text: "#c0392b", border: "#e8a09a" },
  maybe: { bg: "#fffbeb", text: "#b7791f", border: "#f6d860" },
  pending: { bg: "#f5f5f5", text: "#666", border: "#ddd" },
};

const Stat = ({ label, value, icon: Icon, color }) => (
  <div style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)", border: "1px solid rgba(180,130,40,0.2)", borderRadius: "1rem", padding: "1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div>
      <p style={{ fontSize: "0.75rem", color: "#888", margin: 0 }}>{label}</p>
      <p style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: "2rem", color: "#3a1f05", margin: "0.25rem 0 0" }}>{value}</p>
    </div>
    <div style={{ width: "2.75rem", height: "2.75rem", borderRadius: "50%", background: color || "linear-gradient(135deg, #c9973a, #e8c97a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon style={{ color: "#fff", width: "1.25rem", height: "1.25rem" }} />
    </div>
  </div>
);

// ====== Import Dialog Component ======
const genToken = () => Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

const ImportDialog = ({ eventId, onClose, onImported }) => {
  const [tab, setTab] = useState("excel"); // excel | sheets | word
  const [file, setFile] = useState(null);
  const [sheetsUrl, setSheetsUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const tabStyle = (active) => ({
    padding: "0.5rem 1rem", borderRadius: "0.5rem", border: "none", cursor: "pointer",
    background: active ? "linear-gradient(135deg, #c9973a, #e8c97a)" : "transparent",
    color: active ? "#fff" : "#888", fontWeight: active ? 600 : 400, fontSize: "0.9rem"
  });

  const handleParse = async () => {
    setLoading(true);
    setError("");
    setPreview(null);
    try {
      const formData = new FormData();
      if (tab === "sheets") {
        formData.append("fileType", "googlesheets_url");
        formData.append("sheetsUrl", sheetsUrl);
      } else {
        if (!file) { setError("אנא בחרו קובץ"); setLoading(false); return; }
        formData.append("file", file);
        formData.append("fileType", tab);
      }

      const resp = await fetch("/api/functions/parseGuestFile", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await resp.json();
      if (!resp.ok) { setError(data.error || "שגיאה בעיבוד הקובץ"); setLoading(false); return; }
      setPreview(data.guests);
    } catch (e) {
      setError("שגיאת רשת: " + e.message);
    }
    setLoading(false);
  };

  const handleImport = async () => {
    if (!preview || preview.length === 0) return;
    setLoading(true);
    try {
      for (const g of preview) {
        await Guest.create({ event_id: eventId, name: g.name, phone: g.phone || "", invited_count: g.invited_count || 2, status: "pending", invitation_link_token: genToken() });
      }
      onImported(preview.length);
      onClose();
    } catch (e) {
      setError("שגיאה ביבוא: " + e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#fff", borderRadius: "1.25rem", padding: "2rem", maxWidth: "540px", width: "100%", maxHeight: "85vh", overflowY: "auto", direction: "rtl", fontFamily: "'Heebo', sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: "1.5rem", color: "#3a1f05", margin: 0 }}>יבוא אורחים</h2>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", fontSize: "1.25rem", color: "#888" }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", background: "#f5f5f5", borderRadius: "0.75rem", padding: "0.4rem", marginBottom: "1.5rem" }}>
          <button style={tabStyle(tab === "excel")} onClick={() => { setTab("excel"); setFile(null); setPreview(null); setError(""); }}>
            <FileSpreadsheet style={{ display: "inline", width: "0.9rem", height: "0.9rem", marginLeft: "0.3rem" }} />Excel / CSV
          </button>
          <button style={tabStyle(tab === "sheets")} onClick={() => { setTab("sheets"); setFile(null); setPreview(null); setError(""); }}>
            <Link2 style={{ display: "inline", width: "0.9rem", height: "0.9rem", marginLeft: "0.3rem" }} />Google Sheets
          </button>
          <button style={tabStyle(tab === "word")} onClick={() => { setTab("word"); setFile(null); setPreview(null); setError(""); }}>
            <FileText style={{ display: "inline", width: "0.9rem", height: "0.9rem", marginLeft: "0.3rem" }} />Word
          </button>
        </div>

        {/* Content */}
        {tab === "sheets" ? (
          <div>
            <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.75rem" }}>
              הדביקו קישור לגיליון Google Sheets <strong>ציבורי</strong> (שיתוף → כל מי שיש לו קישור)
            </p>
            <input
              value={sheetsUrl}
              onChange={e => setSheetsUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/..."
              style={{ width: "100%", padding: "0.6rem 0.8rem", border: "1px solid #ddd", borderRadius: "0.6rem", fontSize: "0.9rem", boxSizing: "border-box", direction: "ltr" }}
            />
            <div style={{ marginTop: "0.75rem", background: "#fffbeb", border: "1px solid #f6d860", borderRadius: "0.6rem", padding: "0.75rem", fontSize: "0.8rem", color: "#856404" }}>
              <strong>מבנה מצופה:</strong> עמודה א׳ = שם, עמודה ב׳ = טלפון, עמודה ג׳ = מספר מוזמנים (אופציונלי)
            </div>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.75rem" }}>
              {tab === "excel" ? "העלו קובץ Excel (.xlsx, .xls) או CSV עם רשימת האורחים" : "העלו קובץ Word (.docx) עם טבלת אורחים"}
            </p>
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: "2px dashed rgba(180,130,40,0.4)", borderRadius: "0.75rem", padding: "2rem",
                textAlign: "center", cursor: "pointer", background: "rgba(249,240,224,0.5)",
                transition: "background 0.2s"
              }}
            >
              <Upload style={{ width: "2rem", height: "2rem", color: "#b8842a", margin: "0 auto 0.75rem" }} />
              <p style={{ color: "#5a3010", margin: 0, fontWeight: 500 }}>
                {file ? file.name : "לחצו להעלאת קובץ"}
              </p>
              {!file && <p style={{ color: "#aaa", fontSize: "0.8rem", marginTop: "0.25rem" }}>{tab === "excel" ? ".xlsx, .xls, .csv" : ".docx"}</p>}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept={tab === "excel" ? ".xlsx,.xls,.csv" : ".docx,.doc"}
              onChange={e => { setFile(e.target.files[0]); setPreview(null); setError(""); }}
              style={{ display: "none" }}
            />
            <div style={{ marginTop: "0.75rem", background: "#fffbeb", border: "1px solid #f6d860", borderRadius: "0.6rem", padding: "0.75rem", fontSize: "0.8rem", color: "#856404" }}>
              <strong>מבנה מצופה:</strong> עמודה א׳ = שם, עמודה ב׳ = טלפון, עמודה ג׳ = מספר מוזמנים (אופציונלי). שורת כותרת היא אופציונלית.
            </div>
          </div>
        )}

        {error && (
          <div style={{ marginTop: "1rem", background: "#fdf0f0", border: "1px solid #e8a09a", borderRadius: "0.6rem", padding: "0.75rem", fontSize: "0.85rem", color: "#c0392b", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
            <AlertCircle style={{ width: "1rem", height: "1rem", flexShrink: 0, marginTop: "1px" }} />
            {error}
          </div>
        )}

        {/* Preview */}
        {preview && (
          <div style={{ marginTop: "1rem" }}>
            <p style={{ fontSize: "0.85rem", color: "#5a3010", fontWeight: 600, marginBottom: "0.5rem" }}>
              ✅ נמצאו {preview.length} אורחים — תצוגה מקדימה:
            </p>
            <div style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #e0d0b0", borderRadius: "0.6rem" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ background: "#f9f0e0" }}>
                    <th style={{ padding: "0.5rem", textAlign: "right", borderBottom: "1px solid #e0d0b0" }}>שם</th>
                    <th style={{ padding: "0.5rem", textAlign: "right", borderBottom: "1px solid #e0d0b0" }}>טלפון</th>
                    <th style={{ padding: "0.5rem", textAlign: "center", borderBottom: "1px solid #e0d0b0" }}>הוזמנו</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(0, 10).map((g, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f0e8d8" }}>
                      <td style={{ padding: "0.4rem 0.5rem" }}>{g.name}</td>
                      <td style={{ padding: "0.4rem 0.5rem", direction: "ltr", color: "#666" }}>{g.phone || "—"}</td>
                      <td style={{ padding: "0.4rem 0.5rem", textAlign: "center" }}>{g.invited_count || 2}</td>
                    </tr>
                  ))}
                  {preview.length > 10 && (
                    <tr><td colSpan={3} style={{ padding: "0.5rem", textAlign: "center", color: "#888", fontSize: "0.8rem" }}>ועוד {preview.length - 10} אורחים...</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "0.65rem 1.25rem", border: "1px solid #ddd", borderRadius: "0.6rem", background: "transparent", color: "#666", cursor: "pointer" }}>
            ביטול
          </button>
          {!preview ? (
            <button onClick={handleParse} disabled={loading || (tab !== "sheets" && !file) || (tab === "sheets" && !sheetsUrl)} style={{
              padding: "0.65rem 1.5rem", border: "none", borderRadius: "0.6rem",
              background: "linear-gradient(135deg, #c9973a, #e8c97a)", color: "#fff", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 500,
              opacity: (loading || (tab !== "sheets" && !file) || (tab === "sheets" && !sheetsUrl)) ? 0.6 : 1
            }}>
              {loading && <Loader2 style={{ width: "1rem", height: "1rem", animation: "spin 1s linear infinite" }} />}
              עיבוד קובץ
            </button>
          ) : (
            <button onClick={handleImport} disabled={loading} style={{
              padding: "0.65rem 1.5rem", border: "none", borderRadius: "0.6rem",
              background: "linear-gradient(135deg, #2d8c4e, #56c47a)", color: "#fff", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 500
            }}>
              {loading ? <Loader2 style={{ width: "1rem", height: "1rem", animation: "spin 1s linear infinite" }} /> : <Check style={{ width: "1rem", height: "1rem" }} />}
              יבוא {preview.length} אורחים
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ====== Main Dashboard ======
export default function Dashboard() {
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [waFilter, setWaFilter] = useState("all"); // all | pending | attending | declined
  const [newGuest, setNewGuest] = useState({ name: "", phone: "", invited_count: 2 });
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const events = await WeddingEvent.list();
      if (!events.length) { setLoading(false); return; }
      setEvent(events[0]);
      const gs = await Guest.filter({ event_id: events[0].id });
      setGuests(gs);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const stats = useMemo(() => {
    const total = guests.length;
    const opened = guests.filter(g => g.opened).length;
    const attending = guests.filter(g => g.status === "attending").length;
    const declined = guests.filter(g => g.status === "declined").length;
    const maybe = guests.filter(g => g.status === "maybe").length;
    const pending = guests.filter(g => g.status === "pending").length;
    const attendingCount = guests.filter(g => g.status === "attending").reduce((s, g) => s + (g.attending_count || 0), 0);
    return { total, opened, attending, declined, maybe, pending, attendingCount };
  }, [guests]);

  const pieData = [
    { name: "מגיעים", value: stats.attending, color: "#7ab648" },
    { name: "לא מגיעים", value: stats.declined, color: "#e05050" },
    { name: "מתלבטים", value: stats.maybe, color: "#e8c040" },
    { name: "ממתינים", value: stats.pending, color: "#aaa" },
  ].filter(d => d.value > 0);

  const filtered = guests.filter(g => g.name?.includes(search) || (g.phone || "").includes(search));

  const exportCSV = () => {
    const headers = ["שם", "טלפון", "הוזמנו", "סטטוס", "מגיעים", "תזונה", "ברכה"];
    const rows = guests.map(g => [g.name, g.phone || "", g.invited_count, statusLabels[g.status], g.attending_count || "", g.dietary || "", (g.blessing || "").replace(/,/g, " ")]);
    const csv = "\uFEFF" + [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "guests.csv"; a.click();
    URL.revokeObjectURL(url);
    showToast("הקובץ ירד למחשב 💛");
  };

  const sendWhatsAppToGuest = (g, eventData) => {
    if (!g.phone) return;
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/invite/${g.invitation_link_token || g.id}`;
    const msg = encodeURIComponent(
      `שלום ${g.name} 💛\n` +
      `${eventData.bride_name} ו-${eventData.groom_name} שמחים להזמין אתכם לחתונתם!\n` +
      `${eventData.event_date ? new Date(eventData.event_date).toLocaleDateString("he-IL") : ""}${eventData.venue_name ? " · " + eventData.venue_name : ""}\n\n` +
      `לפרטים ואישור הגעה: ${link}`
    );
    const phone = g.phone.replace(/\D/g, "").replace(/^0/, "972");
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
  };

  const sendReminder = () => {
    const pendingGuests = guests.filter(g => g.status === "pending");
    const baseUrl = window.location.origin;
    const txt = pendingGuests.map(g => `${g.name}: ${baseUrl}/invite/${g.invitation_link_token || g.id}`).join("\n");
    navigator.clipboard.writeText(txt);
    showToast(`הועתקו ${pendingGuests.length} לינקים לתזכורת 💛`);
  };

  const copyLink = (g) => {
    const baseUrl = window.location.origin;
    navigator.clipboard.writeText(`${baseUrl}/invite/${g.invitation_link_token || g.id}`);
    showToast("הלינק הועתק");
  };

  const addGuest = async () => {
    if (!event || !newGuest.name) return;
    try {
      const data = await Guest.create({ ...newGuest, event_id: event.id, status: "pending", invitation_link_token: genToken() });
      setGuests(prev => [...prev, data]);
      setShowAdd(false);
      setNewGuest({ name: "", phone: "", invited_count: 2 });
      showToast("האורח נוסף 💛");
    } catch (e) {
      showToast("שגיאה: " + e.message, "error");
    }
  };

  const deleteGuest = async (id) => {
    if (!confirm("למחוק אורח זה?")) return;
    await Guest.delete(id);
    setGuests(prev => prev.filter(g => g.id !== id));
    showToast("האורח נמחק");
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse at top, #f9f0e0, #f5ead5 60%, #f0e0c8)" }}>
        <Loader2 style={{ width: "2rem", height: "2rem", animation: "spin 1s linear infinite", color: "#b8842a" }} />
      </div>
    );
  }

  if (!event) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", background: "radial-gradient(ellipse at top, #f9f0e0, #f5ead5 60%, #f0e0c8)", direction: "rtl", fontFamily: "'Heebo', sans-serif" }}>
        <div style={{ background: "rgba(255,255,255,0.85)", borderRadius: "1.5rem", padding: "3rem", maxWidth: "400px", textAlign: "center", border: "1px solid rgba(180,130,40,0.2)" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💍</div>
          <h2 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: "1.75rem", color: "#3a1f05", marginBottom: "0.75rem" }}>בואו ניצור את החתונה שלכם</h2>
          <p style={{ color: "#888", marginBottom: "2rem" }}>עדיין אין לכם אירוע. בואו נתחיל!</p>
          <Link to="/onboarding" style={{ padding: "0.875rem 2rem", background: "linear-gradient(135deg, #c9973a, #e8c97a)", color: "#fff", border: "none", borderRadius: "0.875rem", textDecoration: "none", fontSize: "1rem" }}>
            בואו נתחיל
          </Link>
        </div>
      </main>
    );
  }

  const mainBg = "radial-gradient(ellipse at top, #f9f0e0, #f5ead5 60%, #f0e0c8)";
  const cardStyle = { background: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)", border: "1px solid rgba(180,130,40,0.2)", borderRadius: "1rem", padding: "1.25rem" };
  const btnGold = { padding: "0.5rem 1rem", background: "linear-gradient(135deg, #c9973a, #e8c97a)", color: "#fff", border: "none", borderRadius: "0.6rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", fontWeight: 500 };
  const btnOutline = { padding: "0.5rem 1rem", border: "1px solid #b8842a", background: "transparent", color: "#b8842a", borderRadius: "0.6rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem" };

  return (
    <main style={{ minHeight: "100vh", background: mainBg, direction: "rtl", fontFamily: "'Heebo', sans-serif" }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: "1rem", left: "50%", transform: "translateX(-50%)", background: toast.type === "error" ? "#c0392b" : "#3a7d44", color: "#fff", padding: "0.75rem 1.5rem", borderRadius: "0.75rem", zIndex: 9999, fontSize: "0.9rem", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header style={{ borderBottom: "1px solid rgba(180,130,40,0.15)", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 30, padding: "0.875rem 1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
          <div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#b8842a", margin: 0, lineHeight: 1 }}>כלולות</p>
            <h1 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: "1.1rem", color: "#3a1f05", margin: 0 }}>
              דשבורד · {event.bride_name} & {event.groom_name}
            </h1>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button onClick={() => setShowAdd(true)} style={btnGold}><Plus style={{ width: "0.9rem", height: "0.9rem" }} />אורח</button>
            <button onClick={() => setShowImport(true)} style={{ ...btnGold, background: "linear-gradient(135deg, #2d6e9e, #4fa8d4)" }}>
              <Upload style={{ width: "0.9rem", height: "0.9rem" }} />יבוא
            </button>
            <button onClick={() => setShowWhatsApp(true)} style={{ ...btnGold, background: "linear-gradient(135deg, #25d366, #128c7e)" }}><MessageCircle style={{ width: "0.9rem", height: "0.9rem" }} />WhatsApp</button>
            <button onClick={exportCSV} style={btnOutline}><Download style={{ width: "0.9rem", height: "0.9rem" }} />ייצוא</button>
            <Link to="/" style={{ ...btnOutline, textDecoration: "none" }}>🏠 ראשי</Link>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.5rem" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
          <Stat label="הוזמנו" value={stats.total} icon={Send} />
          <Stat label="פתחו הזמנה" value={stats.opened} icon={Eye} color="#7ab648" />
          <Stat label="אישרו" value={stats.attending} icon={Check} color="#2d8c4e" />
          <Stat label="לא מגיעים" value={stats.declined} icon={X} color="#c0392b" />
          <Stat label="סה״כ מגיעים" value={stats.attendingCount} icon={Users} color="#2d6e9e" />
        </div>

        {/* Charts */}
        {guests.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={cardStyle}>
              <h3 style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#3a1f05", marginTop: 0, marginBottom: "1rem" }}>פילוח אישורי הגעה</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={cardStyle}>
              <h3 style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#3a1f05", marginTop: 0, marginBottom: "1rem" }}>סטטוס אורחים</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  { name: "ממתינים", count: stats.pending },
                  { name: "מגיעים", count: stats.attending },
                  { name: "לא מגיעים", count: stats.declined },
                  { name: "מתלבטים", count: stats.maybe },
                ]}>
                  <XAxis dataKey="name" stroke="#888" fontSize={12} />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#c9973a" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Guest Table */}
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
            <h3 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: "1.25rem", color: "#3a1f05", margin: 0 }}>
              רשימת אורחים ({guests.length})
            </h3>
            <input
              placeholder="חיפוש לפי שם / טלפון..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ padding: "0.5rem 0.75rem", border: "1px solid rgba(180,130,40,0.3)", borderRadius: "0.6rem", fontSize: "0.9rem", width: "220px", outline: "none" }}
            />
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#aaa" }}>
              <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>👥</div>
              <p>אין אורחים עדיין. הוסיפו אורחים ידנית או יבאו מקובץ.</p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1rem" }}>
                <button onClick={() => setShowAdd(true)} style={btnGold}><Plus style={{ width: "0.9rem", height: "0.9rem" }} />הוסף אורח</button>
                <button onClick={() => setShowImport(true)} style={{ ...btnGold, background: "linear-gradient(135deg, #2d6e9e, #4fa8d4)" }}>
                  <Upload style={{ width: "0.9rem", height: "0.9rem" }} />יבוא מקובץ
                </button>
              </div>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ background: "rgba(249,240,224,0.8)" }}>
                    {["שם", "טלפון", "הוזמנו", "סטטוס", "מגיעים", "נפתח", "עודכן", "לינק", ""].map((h, i) => (
                      <th key={i} style={{ padding: "0.75rem 0.5rem", textAlign: "right", color: "#5a3010", fontWeight: 600, borderBottom: "1px solid rgba(180,130,40,0.15)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(g => {
                    const sc = statusColors[g.status] || statusColors.pending;
                    return (
                      <tr key={g.id} style={{ borderBottom: "1px solid rgba(180,130,40,0.08)" }}>
                        <td style={{ padding: "0.6rem 0.5rem", fontWeight: 500 }}>{g.name}</td>
                        <td style={{ padding: "0.6rem 0.5rem", color: "#666", direction: "ltr" }}>{g.phone || "—"}</td>
                        <td style={{ padding: "0.6rem 0.5rem", textAlign: "center" }}>{g.invited_count || "—"}</td>
                        <td style={{ padding: "0.6rem 0.5rem" }}>
                          <span style={{ padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.75rem", background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
                            {statusLabels[g.status]}
                          </span>
                        </td>
                        <td style={{ padding: "0.6rem 0.5rem", textAlign: "center" }}>{g.attending_count || "—"}</td>
                        <td style={{ padding: "0.6rem 0.5rem", textAlign: "center" }}>
                          {g.opened ? <span style={{ color: "#4a7c30" }}>✓</span> : <span style={{ color: "#ccc" }}>—</span>}
                        </td>
                        <td style={{ padding: "0.6rem 0.5rem", fontSize: "0.75rem", color: "#888" }}>
                          {g.updated_date ? new Date(g.updated_date).toLocaleDateString("he-IL") : "—"}
                        </td>
                        <td style={{ padding: "0.6rem 0.5rem" }}>
                          <div style={{ display: "flex", gap: "0.2rem" }}>
                            <button onClick={() => copyLink(g)} title="העתק לינק" style={{ border: "none", background: "none", cursor: "pointer", color: "#b8842a", padding: "0.25rem" }}>
                              <Copy style={{ width: "0.9rem", height: "0.9rem" }} />
                            </button>
                            {g.phone && (
                              <button onClick={() => sendWhatsAppToGuest(g, event)} title="שלח WhatsApp" style={{ border: "none", background: "none", cursor: "pointer", color: "#25d366", padding: "0.25rem" }}>
                                <MessageCircle style={{ width: "0.9rem", height: "0.9rem" }} />
                              </button>
                            )}
                            <button onClick={() => deleteGuest(g.id)} title="מחק" style={{ border: "none", background: "none", cursor: "pointer", color: "#c0392b", padding: "0.25rem" }}>
                              <Trash2 style={{ width: "0.9rem", height: "0.9rem" }} />
                            </button>
                          </div>
                        </td>
                        <td style={{ display: "none" }} />
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>


      {/* WhatsApp Send Dialog */}
      {showWhatsApp && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }} onClick={e => e.target === e.currentTarget && setShowWhatsApp(false)}>
          <div style={{ background: "#fff", borderRadius: "1.25rem", padding: "2rem", maxWidth: "560px", width: "100%", maxHeight: "85vh", overflowY: "auto", direction: "rtl", fontFamily: "'Heebo', sans-serif" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h2 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: "1.5rem", color: "#3a1f05", margin: 0 }}>
                <span style={{ color: "#25d366", marginLeft: "0.4rem" }}>📱</span>שליחת הזמנות WhatsApp
              </h2>
              <button onClick={() => setShowWhatsApp(false)} style={{ border: "none", background: "none", cursor: "pointer", fontSize: "1.25rem", color: "#888" }}>✕</button>
            </div>

            {/* Filter */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
              {[
                { val: "all", label: "כולם" },
                { val: "pending", label: "ממתינים בלבד" },
                { val: "attending", label: "אישרו בלבד" },
              ].map(f => (
                <button key={f.val} onClick={() => setWaFilter(f.val)} style={{
                  padding: "0.4rem 0.9rem", borderRadius: "999px", border: "1px solid",
                  borderColor: waFilter === f.val ? "#25d366" : "#ddd",
                  background: waFilter === f.val ? "#e8faf0" : "transparent",
                  color: waFilter === f.val ? "#1a7a40" : "#666",
                  cursor: "pointer", fontSize: "0.85rem"
                }}>{f.label}</button>
              ))}
            </div>

            {/* Guest list */}
            {(() => {
              const filtered = guests.filter(g => {
                if (waFilter === "pending") return g.status === "pending";
                if (waFilter === "attending") return g.status === "attending";
                return true;
              });
              const withPhone = filtered.filter(g => g.phone);
              const noPhone = filtered.filter(g => !g.phone);
              const baseUrl = window.location.origin;
              return (
                <>
                  <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.75rem" }}>
                    {withPhone.length} אורחים עם טלפון · {noPhone.length} ללא טלפון
                  </p>
                  <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #e8e8e8", borderRadius: "0.75rem", marginBottom: "1.25rem" }}>
                    {withPhone.map(g => {
                      const link = `${baseUrl}/invite/${g.invitation_link_token || g.id}`;
                      const msg = encodeURIComponent(
                        `שלום ${g.name} 💛\n` +
                        `${event.bride_name} ו-${event.groom_name} שמחים להזמין אתכם לחתונתם!\n` +
                        `${event.event_date ? new Date(event.event_date).toLocaleDateString("he-IL") : ""}${event.venue_name ? " · " + event.venue_name : ""}\n\n` +
                        `לפרטים ואישור הגעה: ${link}`
                      );
                      const phone = g.phone.replace(/\D/g, "").replace(/^0/, "972");
                      const sc = statusColors[g.status] || statusColors.pending;
                      return (
                        <div key={g.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.65rem 1rem", borderBottom: "1px solid #f5f5f5" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <span style={{ fontWeight: 500 }}>{g.name}</span>
                            <span style={{ padding: "0.15rem 0.5rem", borderRadius: "999px", fontSize: "0.7rem", background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
                              {statusLabels[g.status]}
                            </span>
                          </div>
                          <a href={`https://wa.me/${phone}?text=${msg}`} target="_blank" rel="noopener noreferrer"
                            style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.35rem 0.85rem", background: "#25d366", color: "#fff", borderRadius: "0.5rem", textDecoration: "none", fontSize: "0.82rem", fontWeight: 500 }}>
                            <MessageCircle style={{ width: "0.85rem", height: "0.85rem" }} /> שלח
                          </a>
                        </div>
                      );
                    })}
                    {withPhone.length === 0 && (
                      <div style={{ padding: "2rem", textAlign: "center", color: "#aaa" }}>אין אורחים עם מספר טלפון בסינון זה</div>
                    )}
                  </div>
                  {noPhone.length > 0 && (
                    <p style={{ fontSize: "0.8rem", color: "#aaa" }}>⚠️ {noPhone.length} אורחים ללא מספר טלפון: {noPhone.map(g => g.name).join(", ")}</p>
                  )}
                </>
              );
            })()}

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setShowWhatsApp(false)} style={{ padding: "0.65rem 1.5rem", border: "1px solid #ddd", borderRadius: "0.6rem", background: "transparent", color: "#666", cursor: "pointer" }}>סגור</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Guest Dialog */}
      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <div style={{ background: "#fff", borderRadius: "1.25rem", padding: "2rem", maxWidth: "400px", width: "90%", direction: "rtl", fontFamily: "'Heebo', sans-serif" }}>
            <h2 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: "1.4rem", color: "#3a1f05", marginTop: 0 }}>הוספת אורח</h2>
            <div style={{ marginBottom: "0.75rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#5a3010", marginBottom: "0.3rem" }}>שם *</label>
              <input value={newGuest.name} onChange={e => setNewGuest({ ...newGuest, name: e.target.value })} style={{ width: "100%", padding: "0.6rem", border: "1px solid #ddd", borderRadius: "0.6rem", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: "0.75rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#5a3010", marginBottom: "0.3rem" }}>טלפון</label>
              <input value={newGuest.phone} onChange={e => setNewGuest({ ...newGuest, phone: e.target.value })} style={{ width: "100%", padding: "0.6rem", border: "1px solid #ddd", borderRadius: "0.6rem", boxSizing: "border-box", direction: "ltr" }} dir="ltr" />
            </div>
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#5a3010", marginBottom: "0.3rem" }}>כמה הוזמנו</label>
              <input type="number" min={1} value={newGuest.invited_count} onChange={e => setNewGuest({ ...newGuest, invited_count: Number(e.target.value) })} style={{ width: "100%", padding: "0.6rem", border: "1px solid #ddd", borderRadius: "0.6rem", boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button onClick={() => setShowAdd(false)} style={{ padding: "0.6rem 1.25rem", border: "1px solid #ddd", background: "transparent", borderRadius: "0.6rem", cursor: "pointer" }}>ביטול</button>
              <button onClick={addGuest} style={{ padding: "0.6rem 1.5rem", background: "linear-gradient(135deg, #c9973a, #e8c97a)", color: "#fff", border: "none", borderRadius: "0.6rem", cursor: "pointer", fontWeight: 500 }}>הוספה</button>
            </div>
          </div>
        </div>
      )}

      {/* Import Dialog */}
      {showImport && (
        <ImportDialog
          eventId={event.id}
          onClose={() => setShowImport(false)}
          onImported={(count) => { load(); showToast(`יובאו ${count} אורחים בהצלחה 🎉`); }}
        />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600&family=Frank+Ruhl+Libre:wght@400;700&family=Cormorant+Garamond:ital@1&display=swap');
      `}</style>
    </main>
  );
}

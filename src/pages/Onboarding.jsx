import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WeddingEvent } from "@/api/entities";
import { Heart, ArrowRight, ArrowLeft, Loader2, Check } from "lucide-react";

const steps = ["הזוג", "האירוע", "המקום", "סיום"];

const Field = ({ label, ...props }) => (
  <div style={{ marginBottom: "1rem" }}>
    <label style={{ display: "block", fontWeight: 500, color: "#5a3010", marginBottom: "0.4rem", fontSize: "0.9rem" }}>{label}</label>
    <input {...props} style={{
      width: "100%", padding: "0.6rem 0.8rem", borderRadius: "0.6rem",
      border: "1px solid rgba(180,130,40,0.3)", background: "rgba(255,255,255,0.8)",
      fontSize: "1rem", outline: "none", boxSizing: "border-box",
      ...(props.style || {})
    }} />
  </div>
);

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    bride_name: "", groom_name: "", event_date: "", reception_time: "19:30",
    chuppah_time: "20:30", dress_code: "", venue_name: "", venue_address: "",
    contact_bride: "", contact_groom: "", waze_url: "", maps_url: "", hebrew_date: ""
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const next = () => step < steps.length - 1 ? setStep(s => s + 1) : finish();
  const back = () => setStep(s => Math.max(0, s - 1));

  const finish = async () => {
    setSaving(true);
    try {
      const payload = {
        bride_name: form.bride_name || "כלה",
        groom_name: form.groom_name || "חתן",
        event_date: form.event_date || new Date(Date.now() + 1000 * 60 * 60 * 24 * 180).toISOString().split("T")[0],
        reception_time: form.reception_time,
        chuppah_time: form.chuppah_time,
        venue_name: form.venue_name,
        venue_address: form.venue_address,
        dress_code: form.dress_code,
        contact_bride: form.contact_bride,
        contact_groom: form.contact_groom,
        waze_url: form.waze_url,
        maps_url: form.maps_url,
        hebrew_date: form.hebrew_date,
      };
      await WeddingEvent.create(payload);
      navigate("/dashboard");
    } catch (e) {
      alert("שגיאה: " + e.message);
      setSaving(false);
    }
  };

  const cardStyle = {
    background: "rgba(255,255,255,0.85)", backdropFilter: "blur(10px)",
    border: "1px solid rgba(180,130,40,0.2)", borderRadius: "1.5rem",
    padding: "2.5rem", maxWidth: "520px", width: "100%",
    boxShadow: "0 20px 50px rgba(100,60,10,0.12)"
  };

  const btnStyle = {
    padding: "0.75rem 2rem", borderRadius: "0.875rem", border: "none",
    background: "linear-gradient(135deg, #c9973a, #e8c97a, #7a4a1a)",
    color: "#fff", fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem"
  };

  const btnOutlineStyle = {
    padding: "0.75rem 2rem", borderRadius: "0.875rem",
    border: "1px solid #b8842a", background: "transparent",
    color: "#b8842a", fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem"
  };

  return (
    <main style={{ minHeight: "100vh", direction: "rtl", background: "radial-gradient(ellipse at top, #f9f0e0, #f5ead5 60%, #f0e0c8)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", fontFamily: "'Heebo', sans-serif" }}>
      <div style={cardStyle}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>💍</div>
          <h2 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: "1.75rem", color: "#3a1f05", margin: 0 }}>
            יוצרים את החתונה שלכם
          </h2>
          <p style={{ color: "#888", marginTop: "0.5rem", fontSize: "0.9rem" }}>שלב {step + 1} מתוך {steps.length} — {steps[step]}</p>
        </div>

        {/* Progress */}
        <div style={{ display: "flex", gap: "0.4rem", marginBottom: "2rem" }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              flex: 1, height: "4px", borderRadius: "2px",
              background: i <= step ? "linear-gradient(90deg, #c9973a, #e8c97a)" : "rgba(180,130,40,0.2)"
            }} />
          ))}
        </div>

        {/* Step 0: הזוג */}
        {step === 0 && (
          <div>
            <Field label="שם הכלה" value={form.bride_name} onChange={e => set("bride_name", e.target.value)} placeholder="שרה כהן" />
            <Field label="שם החתן" value={form.groom_name} onChange={e => set("groom_name", e.target.value)} placeholder="דוד לוי" />
            <Field label="תאריך עברי (אופציונלי)" value={form.hebrew_date} onChange={e => set("hebrew_date", e.target.value)} placeholder="כ׳ בסיון תשפ״ה" />
          </div>
        )}

        {/* Step 1: האירוע */}
        {step === 1 && (
          <div>
            <Field label="תאריך האירוע" type="date" value={form.event_date} onChange={e => set("event_date", e.target.value)} />
            <Field label="שעת קבלת פנים" value={form.reception_time} onChange={e => set("reception_time", e.target.value)} placeholder="19:30" />
            <Field label="שעת חופה" value={form.chuppah_time} onChange={e => set("chuppah_time", e.target.value)} placeholder="20:30" />
            <Field label="קוד לבוש" value={form.dress_code} onChange={e => set("dress_code", e.target.value)} placeholder="חגיגי / וואו" />
          </div>
        )}

        {/* Step 2: המקום */}
        {step === 2 && (
          <div>
            <Field label="שם האולם" value={form.venue_name} onChange={e => set("venue_name", e.target.value)} placeholder="אולם הפארק" />
            <Field label="כתובת" value={form.venue_address} onChange={e => set("venue_address", e.target.value)} placeholder="רחוב הורדים 5, תל אביב" />
            <Field label="טלפון כלה (WhatsApp)" value={form.contact_bride} onChange={e => set("contact_bride", e.target.value)} placeholder="0501234567" />
            <Field label="טלפון חתן (WhatsApp)" value={form.contact_groom} onChange={e => set("contact_groom", e.target.value)} placeholder="0509876543" />
            <Field label="קישור Waze (אופציונלי)" value={form.waze_url} onChange={e => set("waze_url", e.target.value)} placeholder="https://waze.com/..." />
            <Field label="קישור Google Maps (אופציונלי)" value={form.maps_url} onChange={e => set("maps_url", e.target.value)} placeholder="https://maps.google.com/..." />
          </div>
        )}

        {/* Step 3: סיום */}
        {step === 3 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
            <h3 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: "1.5rem", color: "#3a1f05" }}>
              {form.bride_name || "כלה"} & {form.groom_name || "חתן"}
            </h3>
            <p style={{ color: "#666", marginTop: "0.5rem" }}>
              {form.event_date ? new Date(form.event_date).toLocaleDateString("he-IL") : ""} · {form.venue_name}
            </p>
            <p style={{ color: "#888", marginTop: "1rem", fontSize: "0.9rem" }}>
              הכל מוכן! לחצו על "יצירה" כדי לפתוח את הדשבורד שלכם
            </p>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem", gap: "1rem" }}>
          {step > 0 ? (
            <button onClick={back} style={btnOutlineStyle}>
              <ArrowRight style={{ width: "1rem", height: "1rem" }} />
              אחורה
            </button>
          ) : <div />}

          <button onClick={next} disabled={saving} style={{ ...btnStyle, marginRight: "auto" }}>
            {saving ? <Loader2 style={{ width: "1rem", height: "1rem", animation: "spin 1s linear infinite" }} /> : null}
            {step === steps.length - 1 ? (saving ? "יוצר..." : "✨ יצירה") : "הבא"}
            {step < steps.length - 1 && <ArrowLeft style={{ width: "1rem", height: "1rem" }} />}
          </button>
        </div>
      </div>
    </main>
  );
}

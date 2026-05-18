import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Guest, WeddingEvent, InvitationOpen } from "@/api/entities";
import { Heart, MapPin, Navigation, Phone, Calendar, Clock, Sparkles, Check, X, HelpCircle, Loader2, Music2, VolumeX, MessageCircle } from "lucide-react";

const statusLabels = { attending: "אני מגיע/ה 💛", declined: "לא אוכל להגיע 😔", maybe: "עוד לא בטוח/ה 🤍", pending: "ממתין" };

// Countdown
const useCountdown = (target) => {
  const calc = () => {
    const diff = new Date(target).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [t, setT] = useState(calc());
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
};

const Box = ({ value, label }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <div style={{ width: "4.5rem", height: "4.5rem", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: "2rem", color: "#fff", fontVariantNumeric: "tabular-nums" }}>{String(value).padStart(2, "0")}</span>
    </div>
    <span style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.8)" }}>{label}</span>
  </div>
);

export default function Invitation() {
  const { guestToken } = useParams();
  const [loading, setLoading] = useState(true);
  const [guest, setGuest] = useState(null);
  const [event, setEvent] = useState(null);
  const [status, setStatus] = useState("pending");
  const [count, setCount] = useState(1);
  const [dietary, setDietary] = useState("");
  const [blessing, setBlessing] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const countdown = useCountdown(event?.event_date || new Date(Date.now() + 1e10));

  useEffect(() => {
    if (!guestToken) return;
    (async () => {
      // Try by invitation_link_token first, then by id
      let g = null;
      try {
        const results = await Guest.filter({ invitation_link_token: guestToken });
        if (results.length > 0) g = results[0];
        else g = await Guest.get(guestToken).catch(() => null);
      } catch { }
      if (!g) { setLoading(false); return; }
      setGuest(g);
      setStatus(g.status);
      setCount(g.attending_count ?? g.invited_count ?? 1);
      setDietary(g.dietary ?? "");
      setBlessing(g.blessing ?? "");
      // Load event
      try {
        const ev = await WeddingEvent.get(g.event_id);
        setEvent(ev);
      } catch { }
      // Track open
      if (!g.opened) {
        Guest.update(g.id, { opened: true, opened_at: new Date().toISOString() }).catch(() => {});
        InvitationOpen.create({ guest_id: g.id, event_id: g.event_id, opened_at: new Date().toISOString(), user_agent: navigator.userAgent }).catch(() => {});
      }
      setLoading(false);
    })();
  }, [guestToken]);

  useEffect(() => {
    audioRef.current = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=romantic-piano-loop-25419.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    return () => { audioRef.current?.pause(); };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.pause();
    else audioRef.current.play().catch(() => {});
    setPlaying(!playing);
  };

  const submit = async (s) => {
    if (!guest) return;
    setStatus(s);
    setSaving(true);
    try {
      await Guest.update(guest.id, {
        status: s,
        attending_count: s === "attending" ? count : null,
        dietary: dietary || null,
        blessing: blessing || null,
      });
      setSaved(true);
    } catch (e) {
      alert("שגיאה: " + e.message);
    }
    setSaving(false);
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #1a0a00, #3a1f05)" }}>
      <Loader2 style={{ width: "2rem", height: "2rem", animation: "spin 1s linear infinite", color: "#c9973a" }} />
    </div>
  );

  if (!guest || !event) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #1a0a00, #3a1f05)", color: "#fff", fontFamily: "'Heebo', sans-serif", direction: "rtl" }}>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>😢</div>
        <h2>ההזמנה לא נמצאה</h2>
        <p style={{ color: "rgba(255,255,255,0.6)" }}>ייתכן שהקישור שגוי</p>
      </div>
    </div>
  );

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("he-IL", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "";

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1a0a00, #3a1f05)", direction: "rtl", fontFamily: "'Heebo', sans-serif" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@400;500&family=Frank+Ruhl+Libre:wght@400;700&family=Cormorant+Garamond:ital@1&display=swap');
      `}</style>

      {/* Music Button */}
      <button onClick={toggleMusic} style={{ position: "fixed", top: "1rem", left: "1rem", zIndex: 50, width: "2.75rem", height: "2.75rem", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.3)", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {playing ? <Music2 style={{ width: "1rem", height: "1rem", color: "#c9973a" }} /> : <VolumeX style={{ width: "1rem", height: "1rem", color: "rgba(255,255,255,0.6)" }} />}
      </button>

      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "4rem 1.5rem 3rem", background: "radial-gradient(ellipse at center, rgba(200,155,60,0.2) 0%, transparent 70%)" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#c9973a", fontSize: "1.25rem", marginBottom: "0.5rem" }}>בשעה טובה ומוצלחת</p>
        <h1 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: "3rem", color: "#fff", margin: "0 0 0.5rem", lineHeight: 1.2 }}>
          {event.bride_name} & {event.groom_name}
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#c9973a", margin: "1rem 0" }}>
          <div style={{ height: "1px", width: "60px", background: "linear-gradient(90deg, transparent, rgba(200,155,60,0.6))" }} />
          <Heart style={{ width: "1rem", height: "1rem" }} />
          <div style={{ height: "1px", width: "60px", background: "linear-gradient(90deg, rgba(200,155,60,0.6), transparent)" }} />
        </div>
        <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.1rem", margin: "0.25rem 0" }}>
          {formatDate(event.event_date)}
          {event.hebrew_date && <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginRight: "0.5rem" }}>· {event.hebrew_date}</span>}
        </p>
        {guest && <p style={{ color: "rgba(255,255,255,0.7)", marginTop: "1rem" }}>שלום <strong style={{ color: "#e8c97a" }}>{guest.name}</strong> 💛</p>}
      </section>

      {/* Countdown */}
      {event.event_date && new Date(event.event_date) > new Date() && (
        <section style={{ padding: "2rem 1.5rem", textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "1rem", fontSize: "0.9rem" }}>עוד</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", direction: "ltr" }}>
            <Box value={countdown.seconds} label="שניות" />
            <Box value={countdown.minutes} label="דקות" />
            <Box value={countdown.hours} label="שעות" />
            <Box value={countdown.days} label="ימים" />
          </div>
        </section>
      )}

      {/* Event Details */}
      <section style={{ maxWidth: "600px", margin: "0 auto", padding: "1.5rem" }}>
        <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "1rem", padding: "1.5rem", marginBottom: "1rem" }}>
          <h3 style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#e8c97a", marginTop: 0, marginBottom: "1rem", fontSize: "1.25rem" }}>פרטי האירוע</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {event.reception_time && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "rgba(255,255,255,0.85)" }}>
                <Clock style={{ width: "1rem", height: "1rem", color: "#c9973a", flexShrink: 0 }} />
                <span>קבלת פנים: <strong>{event.reception_time}</strong>{event.chuppah_time && ` · חופה: ${event.chuppah_time}`}</span>
              </div>
            )}
            {event.venue_name && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "rgba(255,255,255,0.85)" }}>
                <MapPin style={{ width: "1rem", height: "1rem", color: "#c9973a", flexShrink: 0 }} />
                <span>{event.venue_name}{event.venue_address && ` · ${event.venue_address}`}</span>
              </div>
            )}
            {event.dress_code && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "rgba(255,255,255,0.85)" }}>
                <Sparkles style={{ width: "1rem", height: "1rem", color: "#c9973a", flexShrink: 0 }} />
                <span>קוד לבוש: {event.dress_code}</span>
              </div>
            )}
          </div>
          {(event.waze_url || event.maps_url) && (
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
              {event.waze_url && <a href={event.waze_url} target="_blank" rel="noopener noreferrer" style={{ padding: "0.5rem 1rem", background: "rgba(0,200,150,0.2)", border: "1px solid rgba(0,200,150,0.4)", color: "#0c9", borderRadius: "0.5rem", textDecoration: "none", fontSize: "0.85rem" }}>🗺️ Waze</a>}
              {event.maps_url && <a href={event.maps_url} target="_blank" rel="noopener noreferrer" style={{ padding: "0.5rem 1rem", background: "rgba(70,130,200,0.2)", border: "1px solid rgba(70,130,200,0.4)", color: "#7ab4f0", borderRadius: "0.5rem", textDecoration: "none", fontSize: "0.85rem" }}>📍 Google Maps</a>}
            </div>
          )}
        </div>

        {/* RSVP */}
        {saved ? (
          <div style={{ background: "rgba(50,180,80,0.15)", border: "1px solid rgba(50,180,80,0.4)", borderRadius: "1rem", padding: "2rem", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>
              {status === "attending" ? "🎉" : status === "declined" ? "💙" : "🤍"}
            </div>
            <h3 style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#fff", fontSize: "1.4rem", margin: "0 0 0.5rem" }}>
              {status === "attending" ? "כמה שמחים שתגיעו!" : status === "declined" ? "חבל, נתגעגע" : "מחכים לתשובה שלכם"}
            </h3>
            <p style={{ color: "rgba(255,255,255,0.7)", margin: 0 }}>תגובתכם נשמרה בהצלחה 💛</p>
          </div>
        ) : (
          <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "1rem", padding: "1.5rem" }}>
            <h3 style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#e8c97a", marginTop: 0, marginBottom: "1rem", fontSize: "1.25rem" }}>אישור הגעה</h3>

            {/* Status Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.25rem" }}>
              {[
                { s: "attending", icon: Check, label: "✅ אני מגיע/ה!", bg: "rgba(50,180,80,0.2)", border: "rgba(50,180,80,0.5)", active: "rgba(50,180,80,0.4)" },
                { s: "declined", icon: X, label: "❌ לא אוכל להגיע", bg: "rgba(200,60,60,0.2)", border: "rgba(200,60,60,0.5)", active: "rgba(200,60,60,0.4)" },
                { s: "maybe", icon: HelpCircle, label: "🤔 עדיין לא בטוח/ה", bg: "rgba(200,170,50,0.2)", border: "rgba(200,170,50,0.5)", active: "rgba(200,170,50,0.4)" },
              ].map(({ s, label, bg, border, active }) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  style={{
                    padding: "0.875rem 1.25rem", border: `1px solid ${status === s ? border : "rgba(255,255,255,0.2)"}`,
                    borderRadius: "0.75rem", background: status === s ? active : bg, color: "#fff",
                    cursor: "pointer", textAlign: "right", fontSize: "0.95rem", fontWeight: status === s ? 600 : 400,
                    transition: "all 0.2s"
                  }}
                >{label}</button>
              ))}
            </div>

            {/* Attending count */}
            {status === "attending" && (
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", color: "rgba(255,255,255,0.8)", fontSize: "0.85rem", marginBottom: "0.4rem" }}>כמה אנשים מגיעים?</label>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} onClick={() => setCount(n)} style={{ width: "2.5rem", height: "2.5rem", border: `1px solid ${count === n ? "#c9973a" : "rgba(255,255,255,0.3)"}`, borderRadius: "50%", background: count === n ? "#c9973a" : "transparent", color: "#fff", cursor: "pointer", fontWeight: count === n ? 700 : 400 }}>{n}</button>
                  ))}
                  <input type="number" min={1} value={count} onChange={e => setCount(Number(e.target.value))} style={{ width: "3.5rem", padding: "0.4rem", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "0.4rem", background: "rgba(0,0,0,0.3)", color: "#fff", textAlign: "center" }} />
                </div>
              </div>
            )}

            {/* Dietary */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", color: "rgba(255,255,255,0.8)", fontSize: "0.85rem", marginBottom: "0.4rem" }}>העדפות תזונתיות (אופציונלי)</label>
              <input value={dietary} onChange={e => setDietary(e.target.value)} placeholder="צמחוני, ללא גלוטן..." style={{ width: "100%", padding: "0.6rem", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "0.6rem", background: "rgba(0,0,0,0.3)", color: "#fff", boxSizing: "border-box" }} />
            </div>

            {/* Blessing */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", color: "rgba(255,255,255,0.8)", fontSize: "0.85rem", marginBottom: "0.4rem" }}>ברכה לחתן וכלה 💛</label>
              <textarea value={blessing} onChange={e => setBlessing(e.target.value)} placeholder="כתבו ברכה חמה..." rows={3} style={{ width: "100%", padding: "0.6rem", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "0.6rem", background: "rgba(0,0,0,0.3)", color: "#fff", resize: "vertical", boxSizing: "border-box" }} />
            </div>

            <button onClick={() => submit(status)} disabled={saving || status === "pending"} style={{
              width: "100%", padding: "0.875rem", border: "none",
              background: status === "pending" ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #c9973a, #e8c97a)",
              color: "#fff", borderRadius: "0.75rem", fontSize: "1rem", fontWeight: 600, cursor: status === "pending" ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem"
            }}>
              {saving ? <Loader2 style={{ width: "1rem", height: "1rem", animation: "spin 1s linear infinite" }} /> : null}
              {status === "pending" ? "בחרו סטטוס הגעה" : "שמירת תגובה"}
            </button>
          </div>
        )}

        {/* Contact */}
        {(event.contact_bride || event.contact_groom) && (
          <div style={{ marginTop: "1rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "1rem", padding: "1.25rem" }}>
            <h3 style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#e8c97a", marginTop: 0, marginBottom: "0.75rem" }}>יצירת קשר</h3>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {event.contact_bride && <a href={`https://wa.me/${event.contact_bride.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ padding: "0.5rem 1rem", background: "rgba(37,211,102,0.2)", border: "1px solid rgba(37,211,102,0.4)", color: "#25d366", borderRadius: "0.5rem", textDecoration: "none", fontSize: "0.85rem" }}>💬 {event.bride_name}</a>}
              {event.contact_groom && <a href={`https://wa.me/${event.contact_groom.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ padding: "0.5rem 1rem", background: "rgba(37,211,102,0.2)", border: "1px solid rgba(37,211,102,0.4)", color: "#25d366", borderRadius: "0.5rem", textDecoration: "none", fontSize: "0.85rem" }}>💬 {event.groom_name}</a>}
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "2rem", paddingBottom: "2rem" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>כלולות · הזמנות חכמות לחתונה</p>
        </div>
      </section>

      {/* WhatsApp FAB */}
      {event.contact_bride && (
        <a href={`https://wa.me/${event.contact_bride.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ position: "fixed", bottom: "1.5rem", left: "1.5rem", zIndex: 50, width: "3.5rem", height: "3.5rem", borderRadius: "50%", background: "linear-gradient(135deg, #25d366, #128c7e)", boxShadow: "0 4px 20px rgba(37,211,102,0.4)", display: "flex", alignItems: "center", justifyContent: "center", animation: "float 4s ease-in-out infinite" }}>
          <MessageCircle style={{ width: "1.75rem", height: "1.75rem", color: "#fff" }} />
        </a>
      )}
    </main>
  );
}

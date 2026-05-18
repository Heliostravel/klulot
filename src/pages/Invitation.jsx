import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Guest, WeddingEvent, InvitationOpen } from "@/api/entities";
import { Heart, MapPin, Navigation, Phone, Calendar, Clock, Sparkles, Check, X, HelpCircle, Loader2, Music2, VolumeX, MessageCircle } from "lucide-react";

// ====== Countdown ======
function useCountdown(target) {
  const calc = () => {
    const diff = new Date(target) - new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, [target]);
  return time;
}

function CountdownBox({ value, label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{
        background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)",
        border: "1px solid rgba(180,130,40,0.25)", borderRadius: "0.75rem",
        width: "4.5rem", height: "4.5rem", display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 15px rgba(100,60,10,0.1)"
      }}>
        <span style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: "2rem", color: "#3a1f05", fontVariantNumeric: "tabular-nums" }}>
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span style={{ marginTop: "0.4rem", fontSize: "0.75rem", color: "#888" }}>{label}</span>
    </div>
  );
}

function Countdown({ target }) {
  const { days, hours, minutes, seconds } = useCountdown(target);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }} dir="ltr">
      <CountdownBox value={seconds} label="שניות" />
      <CountdownBox value={minutes} label="דקות" />
      <CountdownBox value={hours} label="שעות" />
      <CountdownBox value={days} label="ימים" />
    </div>
  );
}

// ====== Music Toggle ======
function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(
      "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=romantic-piano-loop-25419.mp3"
    );
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    return () => { audioRef.current?.pause(); };
  }, []);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.pause();
    else audioRef.current.play().catch(() => {});
    setPlaying(!playing);
  };

  return (
    <button onClick={toggle} style={{
      position: "fixed", top: "1.25rem", left: "1.25rem", zIndex: 40,
      width: "2.5rem", height: "2.5rem", borderRadius: "50%",
      border: "1px solid rgba(180,130,40,0.3)", background: "rgba(255,255,255,0.85)",
      backdropFilter: "blur(8px)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      {playing
        ? <Music2 style={{ width: "1rem", height: "1rem", color: "#b8842a" }} />
        : <VolumeX style={{ width: "1rem", height: "1rem", color: "#aaa" }} />
      }
    </button>
  );
}

// ====== WhatsApp FAB ======
function WhatsAppFab({ phone }) {
  if (!phone) return null;
  const clean = phone.replace(/\D/g, "").replace(/^0/, "972");
  return (
    <a href={`https://wa.me/${clean}`} target="_blank" rel="noopener noreferrer"
      style={{
        position: "fixed", bottom: "1.25rem", left: "1.25rem", zIndex: 40,
        width: "3.5rem", height: "3.5rem", borderRadius: "50%",
        background: "linear-gradient(135deg, #c9973a, #e8c97a, #7a4a1a)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 20px rgba(100,60,10,0.3)", textDecoration: "none",
        animation: "float 4s ease-in-out infinite"
      }}>
      <MessageCircle style={{ width: "1.75rem", height: "1.75rem", color: "#fff" }} />
    </a>
  );
}

// ====== RSVP Status Button ======
function StatusBtn({ status, current, label, icon: Icon, onClick }) {
  const active = current === status;
  const colors = {
    attending: { bg: "#e8f5e0", border: "#7ab648", text: "#3a7020", active: "#7ab648" },
    declined: { bg: "#fdf0f0", border: "#e05050", text: "#c0392b", active: "#e05050" },
    maybe: { bg: "#fffbeb", border: "#e8c040", text: "#b7791f", active: "#e8c040" },
  };
  const c = colors[status];
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: "0.75rem 0.5rem", borderRadius: "0.75rem",
      border: `2px solid ${active ? c.active : "rgba(180,130,40,0.2)"}`,
      background: active ? c.bg : "rgba(255,255,255,0.6)",
      color: active ? c.text : "#888",
      cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem",
      fontWeight: active ? 600 : 400, transition: "all 0.2s", fontSize: "0.9rem"
    }}>
      <Icon style={{ width: "1.25rem", height: "1.25rem" }} />
      {label}
    </button>
  );
}

// ====== Main Invitation Page ======
export default function Invitation() {
  const { guestId } = useParams();
  const [loading, setLoading] = useState(true);
  const [guest, setGuest] = useState(null);
  const [event, setEvent] = useState(null);
  const [status, setStatus] = useState("pending");
  const [count, setCount] = useState(1);
  const [dietary, setDietary] = useState("");
  const [blessing, setBlessing] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!guestId) return;
    (async () => {
      try {
        // Try to find guest by invitation_link_token first, then by id
        let g = null;
        try {
          const byToken = await Guest.filter({ invitation_link_token: guestId });
          if (byToken.length > 0) g = byToken[0];
        } catch {}
        if (!g) {
          try { g = await Guest.get(guestId); } catch {}
        }
        if (!g) { setLoading(false); return; }

        setGuest(g);
        setStatus(g.status || "pending");
        setCount(g.attending_count ?? g.invited_count ?? 1);
        setDietary(g.dietary ?? "");
        setBlessing(g.blessing ?? "");

        const events = await WeddingEvent.filter({ id: g.event_id });
        if (events.length) setEvent(events[0]);

        // Track open
        if (!g.opened) {
          await Guest.update(g.id, { opened: true, opened_at: new Date().toISOString() });
          await InvitationOpen.create({
            guest_id: g.id,
            event_id: g.event_id,
            opened_at: new Date().toISOString(),
            user_agent: navigator.userAgent
          });
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    })();
  }, [guestId]);

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
      console.error(e);
    }
    setSaving(false);
  };

  const pageStyle = {
    minHeight: "100vh",
    direction: "rtl",
    fontFamily: "'Heebo', sans-serif",
    background: "radial-gradient(ellipse at top, #f9f0e0, #f5ead5 60%, #f0e0c8)",
  };

  if (loading) {
    return (
      <div style={{ ...pageStyle, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 style={{ width: "2rem", height: "2rem", color: "#b8842a", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!guest || !event) {
    return (
      <div style={{ ...pageStyle, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💔</div>
          <h2 style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#3a1f05" }}>ההזמנה לא נמצאה</h2>
          <p style={{ color: "#888" }}>ייתכן שהקישור שגוי או שפג תוקפו</p>
        </div>
      </div>
    );
  }

  const eventDate = event.event_date ? new Date(event.event_date) : null;
  const formattedDate = eventDate ? eventDate.toLocaleDateString("he-IL", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "";

  const divider = (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#b8842a", margin: "1.5rem 0" }}>
      <div style={{ height: "1px", flex: 1, background: "linear-gradient(90deg, transparent, rgba(180,130,40,0.5), transparent)" }} />
      <Heart style={{ width: "0.9rem", height: "0.9rem" }} />
      <div style={{ height: "1px", flex: 1, background: "linear-gradient(90deg, transparent, rgba(180,130,40,0.5), transparent)" }} />
    </div>
  );

  return (
    <div style={pageStyle}>
      <MusicToggle />
      <WhatsAppFab phone={event.contact_bride || event.contact_groom} />

      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "2rem 1rem 4rem" }}>

        {/* Hero */}
        {event.hero_image_url ? (
          <div style={{ borderRadius: "1.5rem", overflow: "hidden", marginBottom: "2rem", boxShadow: "0 20px 50px rgba(100,60,10,0.2)" }}>
            <img src={event.hero_image_url} alt="חתונה" style={{ width: "100%", maxHeight: "320px", objectFit: "cover" }} />
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "2.5rem 0 1rem" }}>
            <div style={{ fontSize: "5rem", animation: "float 4s ease-in-out infinite" }}>💍</div>
          </div>
        )}

        {/* Header Card */}
        <div style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(180,130,40,0.2)", borderRadius: "1.5rem", padding: "2rem", textAlign: "center", marginBottom: "1.25rem", boxShadow: "0 8px 30px rgba(100,60,10,0.1)" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.2rem", color: "#b8842a", margin: "0 0 0.25rem" }}>
            בשמחה מזמינים אתכם לחגוג עמנו
          </p>
          <h1 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: "2.5rem", color: "#3a1f05", margin: "0.25rem 0 0.5rem", lineHeight: 1.2 }}>
            {event.bride_name}
            <span style={{ color: "#b8842a", margin: "0 0.5rem", fontSize: "1.5rem" }}>❤</span>
            {event.groom_name}
          </h1>
          {event.hebrew_date && (
            <p style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#8a6030", fontSize: "1rem", margin: "0.25rem 0 0" }}>
              {event.hebrew_date}
            </p>
          )}
          {guest && (
            <p style={{ marginTop: "1rem", color: "#666", fontSize: "0.95rem" }}>
              שמחים להזמין את <strong style={{ color: "#5a3010" }}>{guest.name}</strong> ומשפחתם
            </p>
          )}
        </div>

        {/* Countdown */}
        {eventDate && eventDate > new Date() && (
          <div style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)", border: "1px solid rgba(180,130,40,0.2)", borderRadius: "1.25rem", padding: "1.5rem", textAlign: "center", marginBottom: "1.25rem" }}>
            <p style={{ color: "#888", fontSize: "0.85rem", margin: "0 0 1rem" }}>עוד כמה זמן לחתונה</p>
            <Countdown target={event.event_date} />
          </div>
        )}

        {/* Event Details */}
        <div style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)", border: "1px solid rgba(180,130,40,0.2)", borderRadius: "1.25rem", padding: "1.5rem", marginBottom: "1.25rem" }}>
          <h2 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: "1.3rem", color: "#3a1f05", marginTop: 0, textAlign: "center" }}>פרטי האירוע</h2>
          {divider}
          <div style={{ display: "grid", gap: "0.875rem" }}>
            {formattedDate && (
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <Calendar style={{ width: "1.1rem", height: "1.1rem", color: "#b8842a", flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <div style={{ fontWeight: 600, color: "#3a1f05" }}>{formattedDate}</div>
                </div>
              </div>
            )}
            {(event.reception_time || event.chuppah_time) && (
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <Clock style={{ width: "1.1rem", height: "1.1rem", color: "#b8842a", flexShrink: 0, marginTop: "2px" }} />
                <div>
                  {event.reception_time && <div style={{ color: "#5a3010" }}>קבלת פנים: <strong>{event.reception_time}</strong></div>}
                  {event.chuppah_time && <div style={{ color: "#5a3010" }}>חופה: <strong>{event.chuppah_time}</strong></div>}
                </div>
              </div>
            )}
            {event.venue_name && (
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <MapPin style={{ width: "1.1rem", height: "1.1rem", color: "#b8842a", flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <div style={{ fontWeight: 600, color: "#3a1f05" }}>{event.venue_name}</div>
                  {event.venue_address && <div style={{ color: "#666", fontSize: "0.875rem" }}>{event.venue_address}</div>}
                </div>
              </div>
            )}
            {event.dress_code && (
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <Sparkles style={{ width: "1.1rem", height: "1.1rem", color: "#b8842a", flexShrink: 0, marginTop: "2px" }} />
                <div style={{ color: "#5a3010" }}>קוד לבוש: <strong>{event.dress_code}</strong></div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          {(event.waze_url || event.maps_url) && (
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
              {event.waze_url && (
                <a href={event.waze_url} target="_blank" rel="noopener noreferrer" style={{
                  flex: 1, padding: "0.65rem", borderRadius: "0.75rem", textAlign: "center",
                  background: "linear-gradient(135deg, #0d6efd, #3d8bfd)", color: "#fff",
                  textDecoration: "none", fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem"
                }}>
                  <Navigation style={{ width: "0.9rem", height: "0.9rem" }} /> Waze
                </a>
              )}
              {event.maps_url && (
                <a href={event.maps_url} target="_blank" rel="noopener noreferrer" style={{
                  flex: 1, padding: "0.65rem", borderRadius: "0.75rem", textAlign: "center",
                  background: "linear-gradient(135deg, #34a853, #5cbf77)", color: "#fff",
                  textDecoration: "none", fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem"
                }}>
                  <MapPin style={{ width: "0.9rem", height: "0.9rem" }} /> Google Maps
                </a>
              )}
            </div>
          )}
        </div>

        {/* RSVP Card */}
        <div style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(180,130,40,0.2)", borderRadius: "1.5rem", padding: "1.75rem", marginBottom: "1.25rem" }}>
          <h2 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: "1.3rem", color: "#3a1f05", marginTop: 0, textAlign: "center" }}>
            אישור הגעה
          </h2>
          {divider}

          {saved ? (
            <div style={{ textAlign: "center", padding: "1rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>
                {status === "attending" ? "🎉" : status === "declined" ? "😔" : "🤔"}
              </div>
              <h3 style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#3a1f05", fontSize: "1.25rem" }}>
                {status === "attending" ? "כיף! מחכים לכם!" : status === "declined" ? "חבל, נתגעגע אליכם" : "מחכים לתשובה שלכם"}
              </h3>
              {status === "attending" && (
                <p style={{ color: "#666" }}>אישרתם הגעה של {count} איש{count === 1 ? "" : "ים"}. תודה!</p>
              )}
              <button onClick={() => setSaved(false)} style={{
                marginTop: "1rem", padding: "0.5rem 1.25rem", border: "1px solid rgba(180,130,40,0.3)",
                background: "transparent", color: "#b8842a", borderRadius: "0.6rem", cursor: "pointer"
              }}>
                שינוי תשובה
              </button>
            </div>
          ) : (
            <div>
              {/* Status Buttons */}
              <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <StatusBtn status="attending" current={status} label="מגיעים 🎉" icon={Check} onClick={() => setStatus("attending")} />
                <StatusBtn status="maybe" current={status} label="מתלבטים 🤔" icon={HelpCircle} onClick={() => setStatus("maybe")} />
                <StatusBtn status="declined" current={status} label="לא מגיעים 😔" icon={X} onClick={() => setStatus("declined")} />
              </div>

              {/* Attending count */}
              {status === "attending" && (
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#5a3010", marginBottom: "0.4rem" }}>
                    כמה אנשים מגיעים?
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <button onClick={() => setCount(c => Math.max(1, c - 1))} style={{ width: "2rem", height: "2rem", borderRadius: "50%", border: "1px solid rgba(180,130,40,0.3)", background: "transparent", cursor: "pointer", fontSize: "1.2rem" }}>−</button>
                    <span style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: "1.5rem", color: "#3a1f05", minWidth: "2rem", textAlign: "center" }}>{count}</span>
                    <button onClick={() => setCount(c => Math.min(c + 1, guest.invited_count || 10))} style={{ width: "2rem", height: "2rem", borderRadius: "50%", border: "1px solid rgba(180,130,40,0.3)", background: "transparent", cursor: "pointer", fontSize: "1.2rem" }}>+</button>
                  </div>
                </div>
              )}

              {/* Dietary */}
              {status === "attending" && (
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#5a3010", marginBottom: "0.4rem" }}>
                    העדפות תזונה (אופציונלי)
                  </label>
                  <input
                    value={dietary}
                    onChange={e => setDietary(e.target.value)}
                    placeholder="צמחוני, ללא גלוטן..."
                    style={{ width: "100%", padding: "0.6rem 0.8rem", border: "1px solid rgba(180,130,40,0.3)", borderRadius: "0.6rem", fontSize: "0.9rem", background: "rgba(255,255,255,0.8)", boxSizing: "border-box", outline: "none" }}
                  />
                </div>
              )}

              {/* Blessing */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#5a3010", marginBottom: "0.4rem" }}>
                  ברכה לזוג המאושר ❤ (אופציונלי)
                </label>
                <textarea
                  value={blessing}
                  onChange={e => setBlessing(e.target.value)}
                  placeholder="כתבו ברכה מהלב..."
                  rows={3}
                  style={{ width: "100%", padding: "0.6rem 0.8rem", border: "1px solid rgba(180,130,40,0.3)", borderRadius: "0.6rem", fontSize: "0.9rem", background: "rgba(255,255,255,0.8)", boxSizing: "border-box", outline: "none", resize: "vertical", fontFamily: "'Heebo', sans-serif" }}
                />
              </div>

              <button
                onClick={() => submit(status)}
                disabled={saving || status === "pending"}
                style={{
                  width: "100%", padding: "0.875rem", border: "none", borderRadius: "0.875rem",
                  background: status === "pending" ? "#ddd" : "linear-gradient(135deg, #c9973a, #e8c97a, #7a4a1a)",
                  color: status === "pending" ? "#999" : "#fff",
                  fontSize: "1.1rem", fontFamily: "'Frank Ruhl Libre', serif", cursor: status === "pending" ? "not-allowed" : "pointer",
                  boxShadow: status !== "pending" ? "0 4px 20px rgba(180,130,40,0.4)" : "none",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem"
                }}
              >
                {saving && <Loader2 style={{ width: "1rem", height: "1rem", animation: "spin 1s linear infinite" }} />}
                {status === "pending" ? "בחרו סטטוס כדי לשלוח" : "שליחת אישור 💛"}
              </button>
            </div>
          )}
        </div>

        {/* Contact */}
        {(event.contact_bride || event.contact_groom) && (
          <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: "1.25rem", padding: "1.25rem", textAlign: "center", border: "1px solid rgba(180,130,40,0.15)" }}>
            <p style={{ color: "#666", fontSize: "0.875rem", margin: "0 0 0.75rem" }}>לכל שאלה — אנחנו זמינים</p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              {event.contact_bride && (
                <a href={`https://wa.me/${event.contact_bride.replace(/\D/g, "").replace(/^0/, "972")}`} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#b8842a", textDecoration: "none", fontSize: "0.875rem" }}>
                  <Phone style={{ width: "0.9rem", height: "0.9rem" }} /> {event.bride_name}
                </a>
              )}
              {event.contact_groom && (
                <a href={`https://wa.me/${event.contact_groom.replace(/\D/g, "").replace(/^0/, "972")}`} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#b8842a", textDecoration: "none", fontSize: "0.875rem" }}>
                  <Phone style={{ width: "0.9rem", height: "0.9rem" }} /> {event.groom_name}
                </a>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "2rem", color: "#aaa", fontSize: "0.75rem" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1rem", color: "#b8842a" }}>כלולות · Klulot</p>
          <p>הזמנות חתונה דיגיטליות</p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600&family=Frank+Ruhl+Libre:wght@400;700&family=Cormorant+Garamond:ital@1&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      `}</style>
    </div>
  );
}

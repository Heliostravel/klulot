import { Link } from "react-router-dom";
import { Heart, Send, BarChart3, Sparkles, Smartphone, ShieldCheck, Upload } from "lucide-react";

const Feature = ({ icon: Icon, title, desc }) => (
  <div style={{
    background: "rgba(255,255,255,0.7)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(180,140,80,0.2)",
    borderRadius: "1.25rem",
    padding: "1.75rem",
    textAlign: "center",
    boxShadow: "0 8px 24px rgba(100,60,10,0.07)",
  }}>
    <div style={{
      margin: "0 auto 1rem",
      height: "3.25rem", width: "3.25rem",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #c9973a, #e8c97a, #7a4a1a)",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 0 20px rgba(200,160,80,0.35)"
    }}>
      <Icon style={{ color: "#fff", width: "1.35rem", height: "1.35rem" }} />
    </div>
    <h3 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: "1.15rem", color: "#3a1f05", marginBottom: "0.5rem", marginTop: 0 }}>{title}</h3>
    <p style={{ fontSize: "0.85rem", color: "#888", lineHeight: 1.7, margin: 0 }}>{desc}</p>
  </div>
);

const Step = ({ num, title, desc }) => (
  <div style={{ textAlign: "center" }}>
    <div style={{
      width: "3rem", height: "3rem", borderRadius: "50%",
      background: "linear-gradient(135deg, #c9973a, #e8c97a)",
      display: "flex", alignItems: "center", justifyContent: "center",
      margin: "0 auto 0.75rem",
      fontFamily: "'Frank Ruhl Libre', serif", fontSize: "1.25rem", color: "#fff", fontWeight: 700
    }}>{num}</div>
    <h4 style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#3a1f05", margin: "0 0 0.4rem", fontSize: "1.1rem" }}>{title}</h4>
    <p style={{ color: "#888", fontSize: "0.85rem", margin: 0 }}>{desc}</p>
  </div>
);

export default function Landing() {
  const divider = (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#b8842a", margin: "1.25rem auto", maxWidth: "240px" }}>
      <div style={{ height: "1px", flex: 1, background: "linear-gradient(90deg, transparent, rgba(180,130,40,0.5))" }} />
      <Heart style={{ width: "0.9rem", height: "0.9rem" }} />
      <div style={{ height: "1px", flex: 1, background: "linear-gradient(90deg, rgba(180,130,40,0.5), transparent)" }} />
    </div>
  );

  return (
    <main style={{
      minHeight: "100vh", direction: "rtl",
      background: "radial-gradient(ellipse at top, #f9f0e0, #f5ead5 60%, #f0e0c8)",
      fontFamily: "'Heebo', sans-serif"
    }}>

      {/* ===== Hero ===== */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "5rem 1.5rem 4rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>

          {/* Left: Text */}
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.5rem", color: "#b8842a", margin: "0 0 0.5rem" }}>
              כלולות · Klulot
            </p>
            <h1 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: "clamp(2.5rem,5vw,3.75rem)", lineHeight: 1.15, color: "#3a1f05", margin: "0 0 1rem" }}>
              ההזמנה הדיגיטלית<br />
              <span style={{ background: "linear-gradient(135deg, #c9973a, #e8c97a, #7a4a1a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                היפה ביותר
              </span><br />
              לחתונה שלכם
            </h1>
            {divider}
            <p style={{ fontSize: "1rem", color: "#666", lineHeight: 1.8, marginBottom: "2rem" }}>
              שלחו ב-WhatsApp הזמנה אישית לכל אורח, עקבו אחרי אישורי הגעה בזמן אמת,
              ויבאו את רשימת האורחים ישירות מ-Excel, Google Sheets או Word.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link to="/onboarding" style={{
                padding: "0.875rem 2rem",
                background: "linear-gradient(135deg, #c9973a, #e8c97a, #7a4a1a)",
                color: "#fff", border: "none", borderRadius: "0.875rem",
                fontFamily: "'Frank Ruhl Libre', serif", fontSize: "1.1rem",
                textDecoration: "none", boxShadow: "0 4px 20px rgba(180,130,40,0.4)"
              }}>
                ✨ צרו את החתונה שלכם
              </Link>
              <Link to="/dashboard" style={{
                padding: "0.875rem 2rem",
                background: "transparent",
                color: "#b8842a", border: "1px solid #b8842a", borderRadius: "0.875rem",
                fontFamily: "'Frank Ruhl Libre', serif", fontSize: "1.1rem",
                textDecoration: "none"
              }}>
                לדשבורד שלי
              </Link>
            </div>
            <p style={{ fontSize: "0.78rem", color: "#aaa", marginTop: "1rem" }}>
              ללא הורדות · ללא אפליקציה · עובד מצוין במובייל
            </p>
          </div>

          {/* Right: Visual */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{
              background: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)",
              border: "1px solid rgba(180,130,40,0.2)", borderRadius: "2rem",
              padding: "2.5rem 2rem", textAlign: "center",
              boxShadow: "0 20px 60px rgba(100,60,10,0.15)", width: "100%", maxWidth: "320px"
            }}>
              <div style={{ fontSize: "4rem", marginBottom: "0.75rem", animation: "float 4s ease-in-out infinite" }}>💍</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.1rem", color: "#b8842a" }}>
                שרה & דוד
              </div>
              <div style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: "1rem", color: "#5a3010", margin: "0.4rem 0" }}>
                כ׳ בסיון תשפ״ה
              </div>
              <div style={{ fontSize: "0.85rem", color: "#888", margin: "0.5rem 0 1.5rem" }}>אולם הפארק, תל אביב</div>

              {/* Fake RSVP */}
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                {[{ e: "✓", l: "מגיעים", c: "#e8f5e0", b: "#7ab648" }, { e: "?", l: "מתלבטים", c: "#fffbeb", b: "#e8c040" }, { e: "✗", l: "לא", c: "#fdf0f0", b: "#e05050" }].map(s => (
                  <div key={s.l} style={{ flex: 1, padding: "0.4rem 0.2rem", borderRadius: "0.5rem", background: s.c, border: `1px solid ${s.b}`, fontSize: "0.7rem", color: "#555", textAlign: "center" }}>
                    <div style={{ fontWeight: 700 }}>{s.e}</div>
                    {s.l}
                  </div>
                ))}
              </div>
              <div style={{ background: "linear-gradient(135deg, #c9973a, #e8c97a)", borderRadius: "0.6rem", padding: "0.5rem", color: "#fff", fontSize: "0.85rem", fontWeight: 500 }}>
                💛 שליחת אישור
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== How It Works ===== */}
      <section style={{ background: "rgba(255,255,255,0.5)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: "clamp(1.75rem,4vw,2.5rem)", color: "#3a1f05", margin: 0 }}>
              איך זה עובד?
            </h2>
            {divider}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
            <Step num="1" title="יוצרים אירוע" desc="ממלאים פרטי החתונה — שם, תאריך, מקום" />
            <Step num="2" title="מוסיפים אורחים" desc="ידנית, מ-Excel, Google Sheets או Word" />
            <Step num="3" title="שולחים הזמנות" desc="כל אורח מקבל לינק אישי ב-WhatsApp" />
            <Step num="4" title="עוקבים בזמן אמת" desc="רואים מי אישר, מי פתח, מי מתלבט" />
          </div>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "4rem 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: "clamp(1.75rem,4vw,2.5rem)", color: "#3a1f05", margin: 0 }}>
            כל מה שצריך לחתונה מושלמת
          </h2>
          {divider}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
          <Feature icon={Send} title="שליחה חכמה" desc="שלחו הזמנות אישיות לכל אורח דרך WhatsApp בלחיצה אחת" />
          <Feature icon={BarChart3} title="מעקב בזמן אמת" desc="ראו מי פתח, מי אישר, מי מתלבט — הכל בלוח בקרה אחד" />
          <Feature icon={Upload} title="יבוא מקובץ" desc="יבאו רשימת אורחים מ-Excel, Google Sheets או Word בשניות" />
          <Feature icon={Sparkles} title="עיצוב יוקרתי" desc="הזמנה יפה ומרגשת עם ספירה לאחור וגלריה" />
          <Feature icon={Smartphone} title="מותאם למובייל" desc="עובד מושלם בכל מכשיר, בכל דפדפן, ללא אפליקציה" />
          <Feature icon={ShieldCheck} title="פרטיות מלאה" desc="הנתונים שלכם מאובטחים ושמורים בענן בצורה מאובטחת" />
        </div>
      </section>

      {/* ===== Import Highlight ===== */}
      <section style={{ background: "linear-gradient(135deg, rgba(200,155,60,0.12), rgba(230,200,120,0.15))", padding: "3.5rem 1.5rem", borderTop: "1px solid rgba(180,130,40,0.15)", borderBottom: "1px solid rgba(180,130,40,0.15)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
          <div style={{ textAlign: "right" }}>
            <h2 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: "2rem", color: "#3a1f05", margin: "0 0 0.75rem" }}>
              יבוא אורחים בקלות
            </h2>
            <p style={{ color: "#666", lineHeight: 1.8, marginBottom: "1.25rem" }}>
              כבר יש לכם רשימת אורחים? פשוט יבאו אותה ישירות — אין צורך להזין כל אורח ידנית.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.6rem" }}>
              {[
                { emoji: "📊", text: "Excel / CSV (.xlsx, .csv)" },
                { emoji: "📋", text: "Google Sheets (קישור ציבורי)" },
                { emoji: "📝", text: "Word (.docx עם טבלה)" },
              ].map(i => (
                <li key={i.text} style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.95rem", color: "#5a3010" }}>
                  <span style={{ fontSize: "1.3rem" }}>{i.emoji}</span>
                  {i.text}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ background: "rgba(255,255,255,0.75)", borderRadius: "1.25rem", padding: "1.75rem", border: "1px solid rgba(180,130,40,0.2)" }}>
            <div style={{ fontWeight: 600, color: "#5a3010", marginBottom: "0.75rem", fontSize: "0.9rem" }}>📂 מבנה מצופה:</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ background: "#f9f0e0" }}>
                  {["שם", "טלפון", "הוזמנו"].map(h => (
                    <th key={h} style={{ padding: "0.4rem 0.6rem", textAlign: "right", color: "#8a6030", borderBottom: "1px solid #e8d8b8" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[["משפחת כהן", "0521234567", "4"], ["יוסי לוי", "0549876543", "2"], ["שרה מזרחי", "0531112222", "3"]].map((r, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f0e8d8" }}>
                    {r.map((c, j) => (
                      <td key={j} style={{ padding: "0.4rem 0.6rem", color: "#666", direction: j === 1 ? "ltr" : "rtl" }}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: "0.75rem", color: "#aaa", marginTop: "0.75rem", marginBottom: 0 }}>
              * שורת כותרת היא אופציונלית. הסדר מזוהה אוטומטית.
            </p>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{ textAlign: "center", padding: "5rem 1.5rem" }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>💍</div>
        <h2 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: "clamp(1.75rem,4vw,2.75rem)", color: "#3a1f05", margin: "0 0 0.75rem" }}>
          מוכנים להתחיל?
        </h2>
        <p style={{ color: "#888", marginBottom: "2rem", fontSize: "1rem" }}>
          תוך 3 דקות האירוע שלכם מוכן ואתם יכולים לשלוח הזמנות
        </p>
        <Link to="/onboarding" style={{
          display: "inline-block",
          padding: "1rem 2.5rem",
          background: "linear-gradient(135deg, #c9973a, #e8c97a, #7a4a1a)",
          color: "#fff", border: "none", borderRadius: "0.875rem",
          fontFamily: "'Frank Ruhl Libre', serif", fontSize: "1.2rem",
          textDecoration: "none", boxShadow: "0 4px 30px rgba(180,130,40,0.45)"
        }}>
          ✨ צרו את החתונה שלכם — חינם
        </Link>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600&family=Frank+Ruhl+Libre:wght@400;700&family=Cormorant+Garamond:ital@1&display=swap');
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      `}</style>
    </main>
  );
}

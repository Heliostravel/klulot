import { Link } from "react-router-dom";
import { Heart, Send, BarChart3, Sparkles, Smartphone, ShieldCheck } from "lucide-react";

const Feature = ({ icon: Icon, title, desc }) => (
  <div style={{
    background: "rgba(255,255,255,0.7)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(180,140,80,0.2)",
    borderRadius: "1rem",
    padding: "1.5rem",
    textAlign: "center",
  }}>
    <div style={{
      margin: "0 auto 1rem",
      height: "3rem", width: "3rem",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #c9973a, #e8c97a, #7a4a1a)",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 0 20px rgba(200,160,80,0.4)"
    }}>
      <Icon style={{ color: "#fff", width: "1.25rem", height: "1.25rem" }} />
    </div>
    <h3 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: "1.2rem", color: "#5a3010", marginBottom: "0.5rem" }}>{title}</h3>
    <p style={{ fontSize: "0.85rem", color: "#888", lineHeight: 1.6 }}>{desc}</p>
  </div>
);

export default function Landing() {
  return (
    <main style={{ minHeight: "100vh", direction: "rtl", background: "radial-gradient(ellipse at top, #f9f0e0, #f5ead5 60%, #f0e0c8)", fontFamily: "'Heebo', sans-serif" }}>
      {/* Hero */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "5rem 1.5rem 3rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.5rem", color: "#b8842a", marginBottom: "0.5rem" }}>כלולות · Klulot</p>
          <h1 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: "3.5rem", lineHeight: 1.2, color: "#3a1f05", margin: "0 0 1rem" }}>
            ההזמנה הדיגיטלית<br />
            <span style={{ background: "linear-gradient(135deg, #c9973a, #e8c97a, #7a4a1a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              היפה ביותר
            </span><br />
            לחתונה שלכם
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#b8842a", margin: "1rem 0" }}>
            <div style={{ height: "1px", flex: 1, maxWidth: "80px", background: "linear-gradient(90deg, transparent, rgba(180,130,40,0.6), transparent)" }} />
            <Heart style={{ width: "1rem", height: "1rem" }} />
            <div style={{ height: "1px", flex: 1, maxWidth: "80px", background: "linear-gradient(90deg, transparent, rgba(180,130,40,0.6), transparent)" }} />
          </div>
          <p style={{ fontSize: "1rem", color: "#666", lineHeight: 1.8, marginBottom: "2rem" }}>
            שלחו ב-WhatsApp הזמנה אישית לכל אורח, עקבו אחרי אישורי הגעה בזמן אמת,
            והשאירו רושם של חתונת חלום.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link to="/onboarding" style={{
              padding: "0.875rem 2rem",
              background: "linear-gradient(135deg, #c9973a, #e8c97a, #7a4a1a)",
              color: "#fff", border: "none", borderRadius: "0.875rem",
              fontFamily: "'Frank Ruhl Libre', serif", fontSize: "1.1rem",
              textDecoration: "none", boxShadow: "0 4px 20px rgba(180,130,40,0.4)",
              cursor: "pointer"
            }}>
              צרו את החתונה שלכם
            </Link>
            <Link to="/dashboard" style={{
              padding: "0.875rem 2rem",
              background: "transparent",
              color: "#b8842a", border: "1px solid #b8842a", borderRadius: "0.875rem",
              fontFamily: "'Frank Ruhl Libre', serif", fontSize: "1.1rem",
              textDecoration: "none", cursor: "pointer"
            }}>
              לדשבורד שלי
            </Link>
          </div>
          <p style={{ fontSize: "0.75rem", color: "#aaa", marginTop: "1rem" }}>ללא הורדות · ללא אפליקציה · עובד מצוין במובייל</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(200,155,60,0.15), rgba(230,200,120,0.2))",
            borderRadius: "2rem", padding: "2rem",
            boxShadow: "0 20px 50px rgba(100,60,10,0.15)"
          }}>
            <div style={{ fontSize: "8rem", lineHeight: 1 }}>💍</div>
            <div style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: "1.5rem", color: "#5a3010", marginTop: "1rem" }}>חתונת חלום</div>
            <div style={{ color: "#888", marginTop: "0.5rem" }}>הזמנות חכמות לאירוע המיוחד שלכם</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "3rem 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: "2.5rem", color: "#3a1f05" }}>כל מה שצריך</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
          <Feature icon={Send} title="שליחה חכמה" desc="שלחו הזמנות אישיות לכל אורח דרך WhatsApp בלחיצה אחת" />
          <Feature icon={BarChart3} title="מעקב בזמן אמת" desc="ראו מי פתח, מי אישר, מי מתלבט — הכל בלוח בקרה אחד" />
          <Feature icon={Sparkles} title="עיצוב יוקרתי" desc="הזמנה יפה ומרגשת שתרשים כל אורח" />
          <Feature icon={Smartphone} title="מותאם למובייל" desc="עובד מושלם בכל מכשיר, בכל דפדפן" />
          <Feature icon={ShieldCheck} title="פרטיות מלאה" desc="הנתונים שלכם מאובטחים ופרטיים לחלוטין" />
          <Feature icon={Heart} title="יצירת זכרונות" desc="מקום לאורחים להשאיר ברכות ולאשר הגעה בקלות" />
        </div>
      </section>
    </main>
  );
}

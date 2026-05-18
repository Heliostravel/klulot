# כלולות · Klulot 💍

**אפליקציית הזמנות חתונה דיגיטליות חכמות**

שלחו ב-WhatsApp הזמנה אישית לכל אורח, עקבו אחרי אישורי הגעה בזמן אמת, וניהלו את רשימת האורחים בקלות.

---

## ✨ פיצ'רים

- 💌 **הזמנה אישית** לכל אורח עם לינק ייחודי
- 📱 **שליחה ישירה ב-WhatsApp** מהדשבורד
- 📊 **יבוא אורחים** מ-Excel, Google Sheets או Word
- ⏳ **ספירה לאחור** לאירוע
- ✅ **אישור הגעה** + ברכות + העדפות תזונה
- 📈 **דשבורד** עם סטטיסטיקות וגרפים בזמן אמת
- 📤 **ייצוא CSV** של כל הרשימה
- 🎵 **מוזיקת רקע** בהזמנה

---

## 🗂️ מבנה הפרויקט

```
src/
  App.jsx              # ראוטינג ראשי
  pages/
    Landing.jsx        # דף בית
    Onboarding.jsx     # אשף יצירת אירוע
    Dashboard.jsx      # לוח בקרה
    Invitation.jsx     # הזמנה אישית לאורח

functions/
  parseGuestFile.ts    # Backend function — פרסור קבצי אורחים

entities/
  WeddingEvent.json    # סכמת אירוע חתונה
  Guest.json           # סכמת אורח
  InvitationOpen.json  # סכמת מעקב פתיחות
```

---

## 📋 מבנה נתוני אורחים לייבוא

| שם | טלפון | הוזמנו |
|---|---|---|
| משפחת כהן | 0521234567 | 4 |
| יוסי לוי | 0549876543 | 2 |

---

## 🛠️ טכנולוגיות

- **Frontend:** React, React Router, Recharts, Lucide Icons
- **Backend:** Base44 Platform (Entities, Backend Functions, Deno runtime)
- **Styling:** Inline CSS with gold/ivory design system
- **Fonts:** Heebo, Frank Ruhl Libre, Cormorant Garamond

---

Built with ❤️ on [Base44](https://base44.com)

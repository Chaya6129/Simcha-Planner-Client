# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.
# מתכנן שמחות משותף

מערכת למשפחה מורחבת לתכנון שמחות קטנות: סעודת הודיה, סיום מסכת, שבע ברכות, יום הולדת ועוד.
המארגן פותח שמחה, מגדיר משימות ומזמין את בני המשפחה, וכל אחד לוקח על עצמו משימות. כולם רואים מי לקח מה, כמה כבר מוכן, ואיך עומד התקציב.

## קישורים

| | |
| --- | --- |
| האתר | https://simcha-planner-client.onrender.com |
| השרת (API) | https://simcha-planner-api.onrender.com |
| תיעוד ה־API (Swagger) | https://simcha-planner-api.onrender.com/api-docs |
| קוד השרת | `<קישור ל־Repository של השרת>` |

> השרת רץ על שרת חינמי ב־Render, שנכנס למצב שינה כשאין פעילות. הבקשה הראשונה עשויה לקחת עד דקה. אחר כך הכל מהיר.

## איך לנסות את המערכת

המשתמשים הרשומים:
1. sara@example.com  Demo1234!
2. rachel@example.com rachel123
3. david@example.com david123
4. miriam@example.com miriam123
- המשתמשים שרה ודוד הנם מנהלי משימות, ע"מ לצפות בכל האופציות מוטב לפתוח את שרה
- תודה רבה ובדיקה נעימה!


## מה יש במערכת

- **הרשמה והתחברות** עם JWT. מסכים פרטיים חסומים למי שלא התחבר.
- **שני תפקידים, לפי השמחה:** מארגן ומשתתף. אותו משתמש יכול להיות מארגן בשמחה אחת ומשתתף באחרת.
- **השמחות שלי:** רשימה עם סינון לפי סוג וזמן (קרובות, שעברו), ומיון לפי תאריך.
- **דף השמחה:** פרטים, מצב הכנה (כמה משימות הושלמו), ותקציב (מתוכנן, הוצא, נשאר).
- **משימות:** חיפוש לפי כותרת, סינון לפי קטגוריה, "רק פנויות" ו"המשימות שלי", ומיון.
- **פעולות על משימה:** לקיחה, סיום, ויתור (חופשי עד 48 שעות לפני השמחה, ואחר כך בקשת ויתור למארגן).
- **פעולות מארגן:** יצירה ועריכה של שמחה, יצירת משימות, ניהול משתתפים, העברה ושחרור של משימות.
- **הודעות** בתוך המערכת, עם מונה הודעות שלא נקראו בסרגל העליון.

## טכנולוגיות

**צד הלקוח (Repository זה)**
- React + TypeScript (Vite)
- React Router: ניתוב, והגנה על מסכים פרטיים
- React Hook Form: כל הטפסים, עם ולידציה
- React Query: כל הקריאות לשרת (useQuery לקריאה, useMutation לשינויים)
- Context: המשתמש המחובר והתנתקות
- Tailwind CSS: עיצוב

**צד השרת**
- ASP.NET Core Web API (.NET 10), Clean Architecture
- PostgreSQL עם Entity Framework Core (Neon בענן)
- JWT, Swagger

## מבנה הפרויקט

```
src/
  api/         קריאות לשרת: client.ts, ופונקציה לכל נקודת קצה (auth, events, tasks, invites, notifications)
               types.ts (טיפוסים) ו־labels.ts (תרגום ערכי הבחירה לעברית)
  auth/        שמירת ה־token, ו־AuthContext (המשתמש המחובר)
  components/  Layout (סרגל עליון), ProtectedRoute (הגנה), TaskList (רשימת המשימות)
  pages/       מסך לכל נתיב
```

## הרצה מקומית

```
npm install
npm run dev
```

בקובץ `.env.development` מוגדרת כתובת השרת המקומי: `VITE_API_URL=http://localhost:5080`.

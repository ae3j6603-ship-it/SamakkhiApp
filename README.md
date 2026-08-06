# ระบบสารสนเทศโรงเรียนสามัคคีศรีวิชัย

**Samakkhi Sriwichai School Information System** — ระบบบริหารจัดการและติดตามสถานะตัวชี้วัด (KPIs/Indicators) สำหรับโรงเรียนสามัคคีศรีวิชัย (รหัสโรงเรียน 51020099)

## ✨ สิ่งสำคัญที่ระบบทำได้

- **Executive Dashboard**: การ์ดสรุป KPI, Pie Chart และ Bar Chart ด้วย Recharts
- **Interactive Datatable**: ค้นหา/กรองตัวชี้วัดตามสถานะหรือรหัส
- **Quick Edit Modal**: แก้ไขสถานะ/รายละเอียดเพื่อบันทึกทันที พร้อม Timestamp อัตโนมัติ
- **Import/Export CSV**: ส่งออกเป็น CSV แบบ UTF-8 BOM รองรับภาษาไทย และนำเข้ากลับได้
- **LocalStorage Persistence**: ข้อมูลไม่หายเมื่อรีเฟรชหน้าจอ
- **Responsive UI**: รองรับการใช้งานบนมือถือ

## 🛠 Tech Stack

- React 18 + Vite
- Tailwind CSS v4
- Recharts
- Lucide React

## 🚀 การติดตั้งและรันโปรเจกต์

```bash
npm install
npm run dev
```

เปิดเบราว์เซอร์ไปที่ `http://localhost:5173`

## 📁 โครงสร้างโฟลเดอร์

```text
SamakkhiApp/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
└── src/
    ├── main.jsx
    ├── index.css
    └── SamakkhiSriwichaiApp.jsx
```

## 🏢 รหัสโรงเรียน

51020099 — โรงเรียนสามัคคีศรีวิชัย

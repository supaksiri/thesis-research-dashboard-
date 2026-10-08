# Thesis Research Dashboard — Chapter 4

Interactive dashboard สำหรับนำเสนอผลการวิจัยบทที่ 4 ในวันสอบวิทยานิพนธ์

## วิธีเปิดใช้งาน
1. แตกไฟล์ ZIP
2. เปิด `index.html` ด้วย Chrome / Edge / Safari
3. หากต้องการเผยแพร่ออนไลน์ ให้อัปโหลดโฟลเดอร์ทั้งหมดขึ้น GitHub Pages, Netlify, Vercel หรือบริการ Static Hosting

## ไฟล์หลัก
- `index.html` — โครงสร้างหน้าเว็บ
- `css/style.css` — Theme, Responsive, Presentation, Print
- `js/data.js` — ข้อมูลวิจัยทั้งหมด (Single Source of Truth)
- `js/charts.js` — Chart.js charts
- `js/dashboard.js` — UI, navigation, presentation, export

## ฟังก์ชัน
- Sidebar navigation + mobile drawer
- Current vs Desired chart
- PNI Modified ranking
- 6 Academic Areas cards
- SWOT / TOWS
- Strategy expandable cards
- Evaluation chart
- Presentation mode + keyboard arrows
- Fullscreen
- Export PNG (section ปัจจุบัน)
- Export PDF (8 sections)
- Print CSS แบบ 1 section = 1 page

## หมายเหตุ
กราฟและการ Export ใช้ CDN: Chart.js, html2canvas และ jsPDF ดังนั้นเมื่อเปิดครั้งแรกควรเชื่อมต่ออินเทอร์เน็ต

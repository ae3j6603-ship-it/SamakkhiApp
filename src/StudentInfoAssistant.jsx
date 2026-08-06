import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Baby,
  BarChart3,
  Bot,
  Database,
  Download,
  FileUp,
  Lock,
  Send,
  ShieldCheck,
  Sparkles,
  Unlock,
  User,
} from "lucide-react";

const STORAGE_KEY = "samakkhi-sriwichai-student-db-2569";
const SCHOOL_ID = "51020099";
const SCHOOL_NAME = "สามัคคีศรีวิชัย";

// โครงสร้างฟิลด์ 39 ฟิลด์ตามลำดับคอลัมน์ของไฟล์ 2569-1-student.csv (5 กลุ่มหลัก)
const FIELD_ORDER = [
  "schoolId", "schoolName", "nationalId", "studentId", "grade", "room", "gender", "prefix", "firstName", "lastName",
  "birthDay", "birthMonth", "birthYearBE", "age", "weight", "height", "bloodType", "religion", "ethnicity", "nationality",
  "houseNo", "moo", "street", "subdistrict", "district", "province",
  "guardianPrefix", "guardianFirstName", "guardianLastName", "guardianOccupation", "guardianRelation",
  "fatherPrefix", "fatherFirstName", "fatherLastName", "fatherOccupation",
  "motherPrefix", "motherFirstName", "motherLastName", "motherOccupation",
  "disadvantage", "dischargeStatus",
];

// ชุดข้อมูลตัวอย่างสำหรับสาธิตระบบ (กรุณาอัปโหลดไฟล์ 2569-1-student.csv จริงเพื่อผลลัพธ์ที่ถูกต้องตามฐานข้อมูลจริง)
const DEMO_DATA = [
  { schoolId: SCHOOL_ID, schoolName: SCHOOL_NAME, nationalId: "1519900012345", studentId: "10021", grade: "ม.3", room: "1", gender: "ชาย", prefix: "เด็กชาย", firstName: "สมชาย", lastName: "ใจดี", birthDay: "12", birthMonth: "5", birthYearBE: "2554", age: "15", weight: "48", height: "160", bloodType: "O", religion: "พุทธ", ethnicity: "ไทย", nationality: "ไทย", houseNo: "12", moo: "3", street: "-", subdistrict: "ทุ่งหัวช้าง", district: "ทุ่งหัวช้าง", province: "ลำพูน", guardianPrefix: "นาย", guardianFirstName: "สมพร", guardianLastName: "ใจดี", guardianOccupation: "เกษตรกร", guardianRelation: "บิดา", fatherPrefix: "นาย", fatherFirstName: "สมพร", fatherLastName: "ใจดี", fatherOccupation: "เกษตรกร", motherPrefix: "นาง", motherFirstName: "สมหญิง", motherLastName: "ใจดี", motherOccupation: "รับจ้าง", disadvantage: "เด็กยากจน", dischargeStatus: "-" },
  { schoolId: SCHOOL_ID, schoolName: SCHOOL_NAME, nationalId: "1519900054321", studentId: "10022", grade: "ม.3", room: "1", gender: "หญิง", prefix: "เด็กหญิง", firstName: "สมหญิง", lastName: "ดีใจ", birthDay: "3", birthMonth: "8", birthYearBE: "2554", age: "15", weight: "42", height: "155", bloodType: "A", religion: "พุทธ", ethnicity: "ไทย", nationality: "ไทย", houseNo: "45", moo: "2", street: "-", subdistrict: "ทุ่งหัวช้าง", district: "ทุ่งหัวช้าง", province: "ลำพูน", guardianPrefix: "นาง", guardianFirstName: "มาลี", guardianLastName: "ดีใจ", guardianOccupation: "ค้าขาย", guardianRelation: "มารดา", fatherPrefix: "นาย", fatherFirstName: "มานะ", fatherLastName: "ดีใจ", fatherOccupation: "รับจ้าง", motherPrefix: "นาง", motherFirstName: "มาลี", motherLastName: "ดีใจ", motherOccupation: "ค้าขาย", disadvantage: "-", dischargeStatus: "-" },
  { schoolId: SCHOOL_ID, schoolName: SCHOOL_NAME, nationalId: "1519900098765", studentId: "20015", grade: "ป.3", room: "1", gender: "ชาย", prefix: "เด็กชาย", firstName: "วีรยุทธ", lastName: "แสนดี", birthDay: "20", birthMonth: "1", birthYearBE: "2560", age: "9", weight: "26", height: "128", bloodType: "B", religion: "พุทธ", ethnicity: "ไทย", nationality: "ไทย", houseNo: "8", moo: "5", street: "-", subdistrict: "ทุ่งหัวช้าง", district: "ทุ่งหัวช้าง", province: "ลำพูน", guardianPrefix: "นาย", guardianFirstName: "วีระ", guardianLastName: "แสนดี", guardianOccupation: "เกษตรกร", guardianRelation: "บิดา", fatherPrefix: "นาย", fatherFirstName: "วีระ", fatherLastName: "แสนดี", fatherOccupation: "เกษตรกร", motherPrefix: "นาง", motherFirstName: "สายทอง", motherLastName: "แสนดี", motherOccupation: "เกษตรกร", disadvantage: "เด็กยากจน", dischargeStatus: "-" },
  { schoolId: SCHOOL_ID, schoolName: SCHOOL_NAME, nationalId: "1519900011122", studentId: "30002", grade: "อ.2", room: "1", gender: "หญิง", prefix: "เด็กหญิง", firstName: "ปาริชาต", lastName: "งามพร้อม", birthDay: "15", birthMonth: "11", birthYearBE: "2564", age: "5", weight: "17", height: "104", bloodType: "AB", religion: "พุทธ", ethnicity: "ไทย", nationality: "ไทย", houseNo: "23", moo: "1", street: "-", subdistrict: "ทุ่งหัวช้าง", district: "ทุ่งหัวช้าง", province: "ลำพูน", guardianPrefix: "นาง", guardianFirstName: "จันทร์เพ็ญ", guardianLastName: "งามพร้อม", guardianOccupation: "รับจ้าง", guardianRelation: "มารดา", fatherPrefix: "นาย", fatherFirstName: "ประเสริฐ", fatherLastName: "งามพร้อม", fatherOccupation: "รับจ้าง", motherPrefix: "นาง", motherFirstName: "จันทร์เพ็ญ", motherLastName: "งามพร้อม", motherOccupation: "รับจ้าง", disadvantage: "เด็กยากจน", dischargeStatus: "-" },
];

const GRADE_TOKENS = ["อ.1", "อ.2", "อ.3", "ป.1", "ป.2", "ป.3", "ป.4", "ป.5", "ป.6", "ม.1", "ม.2", "ม.3"];

function loadInitialData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEMO_DATA;
  } catch {
    return DEMO_DATA;
  }
}

// มาสก์เลกประจำตัวประชาชน 13 หลัก ตามนโยบาย PDPA (แสดงเต็มเฉพาะโหมดครูประจำชั้น)
function maskNationalId(id, teacherMode) {
  if (!id || id === "-" || id === "0") return "ไม่มีข้อมูลในระบบ";
  if (teacherMode) return id;
  const digits = String(id).replace(/\D/g, "");
  if (digits.length !== 13) return "X-XXXX-XXXXX-XX-X";
  return `${digits[0]}-${digits.slice(1, 5)}-XXXXX-XX-X`;
}

function safeValue(value) {
  if (value === undefined || value === null || value === "" || value === "-" || value === "0") {
    return "ไม่มีข้อมูลในระบบ";
  }
  return value;
}

function calcBmi(weightKg, heightCm) {
  const w = parseFloat(weightKg);
  const h = parseFloat(heightCm);
  if (!w || !h) return null;
  const m = h / 100;
  const bmi = w / (m * m);
  let category = "ปกติ";
  if (bmi < 18.5) category = "ผอม";
  else if (bmi >= 18.5 && bmi < 23) category = "ปกติ";
  else if (bmi >= 23 && bmi < 25) category = "น้ำหนักเกิน";
  else category = "อ้วน";
  return { value: Math.round(bmi * 10) / 10, category };
}

// แปลง Array ของ Object เป็นตาราง Markdown สำหรับแสดงผลในแชต
 function toMarkdownTable(rows, columns) {
  if (!rows.length) return "_ไม่พบข้อมูลตามเงื่อนไขที่ระบุ_";
  const header = `| ${columns.map((c) => c.label).join(" | ")} |`;
  const divider = `| ${columns.map(() => "---").join(" | ")} |`;
  const body = rows.map((r) => `| ${columns.map((c) => r[c.key]).join(" | ")} |`).join("\n");
  return `${header}\n${divider}\n${body}`;
}

function escapeCsv(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function parseCsvText(text) {
  const cleaned = text.replace(/^\uFEFF/, "");
  const lines = cleaned.split(/\r?\n/).filter((l) => l.trim() !== "");
  const parseLine = (line) =>
    (line.match(/("(?:[^"]|"")*"|[^,]*)/g) || [])
      .filter((x) => x !== "")
      .map((x) => x.replace(/^"|"$/g, "").replaceAll('""', '"').trim());
  const rows = lines.map(parseLine);
  // แทวแรกสือเป็นหัวคอลัมน์ (header) แต่ระบบจะจับคู่ฟิลด์ตามลำดับ FIELD_ORDER เป็นหลัก
  const dataRows = rows.slice(1);
  return dataRows.map((cells) => {
    const record = {};
    FIELD_ORDER.forEach((key, i) => {
      record[key] = cells[i] ?? "-";
    });
    return record;
  });
}

function App() {
  const [students, setStudents] = useState(loadInitialData);
  const [teacherMode, setTeacherMode] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: `สวัสดีค่ะ/ครับ ดิฉัน/ผมคือ **AI ผู้ช่วยจัดการระบบสารสนเทศนักเรียน** ประจำโรงเรียน${SCHOOL_NAME} (รหัสโรงเรียน ${SCHOOL_ID})\n\nพร้อมช่วยค้นหา วิเคราะห์ และสรุปข้อมูลนักเรียนจากฐานข้อมูลปีการศึกษา 2569 กรุณาอัปโหลดไฟล์ **2569-1-student.csv** หรือลองพิมพ์คำสั่งตัวอย่างด้านล่างได้เลยค่ะ`,
    },
  ]);
  const [input, setInput] = useState("");
  const fileRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const stats = useMemo(() => ({
    total: students.length,
    male: students.filter((s) => s.gender === "ชาย").length,
    female: students.filter((s) => s.gender === "หญิง").length,
  }), [students]);

  const pushMessage = (role, text) => setMessages((prev) => [...prev, { role, text }]);

  const handleImportCsv = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseCsvText(String(reader.result));
      if (!parsed.length) {
        pushMessage("assistant", "ไม่พบข้อมูลในไฟล์ที่อัปโหลด กรุนาตรวจสอบรูปแบบไฟล์ CSV อีกครั้ง");
        return;
      }
      setStudents(parsed);
      pushMessage("assistant", `นำเข้าข้อมูลนักเรียนสำเร็จ จำนวน **${parsed.length} คน** จากไฟล์ **${file.name}** เรียบร้อยแล้ว สามารถเริ่มค้นหาหรือสรุปข้อมูลได้ทันที`);
    };
    reader.readAsText(file, "UTF-8");
    event.target.value = "";
  };

  const exportResultCsv = (rows, columns, filename) => {
    if (!rows.length) return;
    const headerRow = columns.map((c) => escapeCsv(c.label)).join(",");
    const body = rows.map((r) => columns.map((c) => escapeCsv(r[c.key])).join(",")).join("\r\n");
    const csv = "\uFEFF" + headerRow + "\r\n" + body;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ตัวประมวลผลคำสั่ง (Intent Parser): จับคำสำคัญภาษาไทยแล้วจับคู่กับฟังก์ชนประมวลผลข้อมูลที่เหมาะสม
  const processQuery = (rawQuery) => {
    const q = rawQuery.trim();

    if (!students.length) {
      return "ยังไม่มีข้อมูลนักเรียนในระบบ กรุนาอัปโหลดไฟล์ 2569-1-student.csv ก่อนใช้งาน";
    }

    // 1) ค้นหารายบุคคลด้วยเลกประจำตัวประชาชน 13 หลัก
    const nationalIdMatch = q.match(/\d{13}/);
    if (nationalIdMatch) {
      const found = students.filter((s) => s.nationalId === nationalIdMatch[0]);
      if (!found.length) return "ไม่พบนักเรียนที่มีเลขประจำตัวประชาชนตรงกับที่ระบุในฐานข้อมูล";
      return renderStudentProfile(found[0]);
    }

    // 2) ค้นหาด้วยเลขประจำตัวนักเรียน (ตัวเลข 4-6 หลัก)
    const studentIdMatch = q.match(/(?:รหัสนักเรียน|เลกประจำตัวนักเรียน)\s*(\d{3,8})/) || (q.match(/^\d{3,8}$/) ? [null, q] : null);
    if (studentIdMatch) {
      const found = students.filter((s) => s.studentId === studentIdMatch[1]);
      if (found.length) return renderStudentProfile(found[0]);
    }

    // 3) กรองตามระดับชั้น/ห้อง เช่น "ม.3/1", "ป.3"
    const gradeToken = GRADE_TOKENS.find((g) => q.includes(g));
    if (gradeToken && (q.includes("รายชื่อ") || q.includes("สรุป") || q.includes("ขอ") || q.includes("ชั้น"))) {
      const roomMatch = q.match(new RegExp(`${gradeToken.replace(".", "\\.")}\\/(\\d+)`));
      let rows = students.filter((s) => s.grade === gradeToken);
      if (roomMatch) rows = rows.filter((s) => s.room === roomMatch[1]);

      const wantGuardian = q.includes("ผู้ปกครอง") || q.includes("อาชีพ");
      const columns = wantGuardian
        ? [
            { key: "studentId", label: "เลกประจำตัว" },
            { key: "fullName", label: "ชื่อ-สกุล" },
            { key: "guardianFullName", label: "ผู้ปกครอง" },
            { key: "guardianOccupation", label: "อาชีพผู้ปกครอง" },
          ]
        : [
            { key: "studentId", label: "เลกประจำตัว" },
            { key: "fullName", label: "ชื่อ-สกุล" },
            { key: "gender", label: "เพศ" },
            { key: "room", label: "ห้อง" },
          ];
      const tableRows = rows.map((s) => ({
        ...s,
        fullName: `${s.prefix} ${s.firstName} ${s.lastName}`,
        guardianFullName: `${safeValue(s.guardianPrefix)} ${safeValue(s.guardianFirstName)} ${safeValue(s.guardianLastName)}`.replace(/ไม่มีข้อมูลในระบบ/g, "-").trim(),
        guardianOccupation: safeValue(s.guardianOccupation),
      }));
      const roomLabel = roomMatch ? `${gradeToken}/${roomMatch[1]}` : gradeToken;
      return `รายชื่อนักเรียนชั้น **${roomLabel}** จำนวน **${rows.length} คน**\n\n${toMarkdownTable(tableRows, columns)}`;
    }

    // 4) สรุปจำนวนนักเรียนแยกเพศ/ระดับชั้น
    if (q.includes("สรุป") && (q.includes("เพศ") || q.includes("ชาย") || q.includes("หญิง") || q.includes("จำนวนนักเรียน"))) {
      const grades = [...new Set(students.map((s) => s.grade))];
      const rows = grades.map((g) => {
        const inGrade = students.filter((s) => s.grade === g);
        return {
          grade: g,
          male: inGrade.filter((s) => s.gender === "ชาย").length,
          female: inGrade.filter((s) => s.gender === "หญิง").length,
          total: inGrade.length,
        };
      });
      const columns = [
        { key: "grade", label: "ระดับชั้น" },
        { key: "male", label: "ชาย" },
        { key: "female", label: "หญิง" },
        { key: "total", label: "รวม" },
      ];
      return `สรุปจำนวนนักเรียนโรงเรียน${SCHOOL_NAME} จำแนกตามระดับชั้นและเพศ\n\n${toMarkdownTable(rows, columns)}\n\n**รวมทั้งหมด ${stats.total} คน** (ชาย ${stats.male} คน, หญิง ${stats.female} คน)`;
    }

    // 5) รายงานกลุ่มความด้อยโอกาส (งานดูแลช่วยเหลือนักเรียน)
    if (q.includes("ด้อยโอกาส") || q.includes("ยากจน") || q.includes("ทุนการศึกษา") || q.includes("ทุน")) {
      let rows = students.filter((s) => s.disadvantage && s.disadvantage !== "-" && s.disadvantage !== "0");
      const rangeMatch = q.match(/ป\.(\d)\s*(?:ถึง|-)\s*(\d)/);
      if (rangeMatch) {
        const from = parseInt(rangeMatch[1], 10);
        const to = parseInt(rangeMatch[2], 10);
        rows = rows.filter((s) => {
          const m = s.grade.match(/ป\.(\d)/);
          return m && parseInt(m[1], 10) >= from && parseInt(m[1], 10) <= to;
        });
      }
      const columns = [
        { key: "studentId", label: "เลกประจำตัว" },
        { key: "fullName", label: "ชื่อ-สกุล" },
        { key: "grade", label: "ชั้น" },
        { key: "disadvantage", label: "สถานะความด้อยโอกาส" },
      ];
      const tableRows = rows.map((s) => ({ ...s, fullName: `${s.prefix} ${s.firstName} ${s.lastName}` }));
      return `รายชื่อนักเรียนกลุ่มความด้อยโอกาสที่พบในระบบ จำนวน **${rows.length} คน**\n\n${toMarkdownTable(tableRows, columns)}\n\n_หมายเหตุ: ใช้สำหรับจัดทำแบบกรอกทุนการศึกษาและงานดูแลช่วยเหลือนักเรียนเท่านั้น_`;
    }

    // 6) วิเคราะห์ BMI / น้ำหนัก-ส่วนสูง / โภชนาการ
    if (q.includes("bmi") || q.toLowerCase().includes("bmi") || (q.includes("น้ำหนัก") && q.includes("ส่วนสูง")) || q.includes("โภชนาการ") || q.includes("พัฒนาการ")) {
      let rows = students;
      const gradeTokenBmi = GRADE_TOKENS.find((g) => q.includes(g));
      if (gradeTokenBmi) rows = rows.filter((s) => s.grade === gradeTokenBmi);
      const withBmi = rows.map((s) => {
        const bmi = calcBmi(s.weight, s.height);
        return {
          ...s,
          fullName: `${s.prefix} ${s.firstName} ${s.lastName}`,
          bmiValue: bmi ? bmi.value : "ไม่มีข้อมูลในระบบ",
          bmiCategory: bmi ? bmi.category : "ไม่มีข้อมูลในระบบ",
        };
      });
      const columns = [
        { key: "fullName", label: "ชื่อ-สกุล" },
        { key: "grade", label: "ชั้น" },
        { key: "weight", label: "น้ำหนัก (กก.)" },
        { key: "height", label: "ส่วนสูง (ซม.)" },
        { key: "bmiValue", label: "BMI" },
        { key: "bmiCategory", label: "ผลการประเมิน" },
      ];
      const scopeLabel = gradeTokenBmi ? `ชั้น ${gradeTokenBmi}` : "ทุกระดับชั้น";
      return `ผลวิเคราะห์ดัชนีมวลกาย (BMI) ของนักเรียน${scopeLabel} จำนวน ${withBmi.length} คน\n\n${toMarkdownTable(withBmi, columns)}\n\n_เกณฑ์อ้างอิง: ผอม < 18.5, ปกติ 18.5–22.9, น้ำหนักเกิน 23–24.9, อ้วน ≥ 25 (ควรเทียบกับเกณฑ์ BMI-for-age ของกรมอนามีสำหรับเด็กเพื่อความแม่นยำ)_`;
    }

    // 7) กรองผู้ปกครองอาชีพเกษตรกรรม
    if (q.includes("เกษตร")) {
      const rows = students.filter((s) => [s.guardianOccupation, s.fatherOccupation, s.motherOccupation].some((o) => o && o.includes("เกษตร")));
      const columns = [
        { key: "studentId", label: "เลกประจำตัว" },
        { key: "fullName", label: "ชื่อ-สกุล" },
        { key: "grade", label: "ชั้น" },
        { key: "guardianOccupation", label: "อาชีพผู้ปกครอง" },
      ];
      const tableRows = rows.map((s) => ({ ...s, fullName: `${s.prefix} ${s.firstName} ${s.lastName}` }));
      return `นักเรียนที่ผู้ปกครองมีอาชีพเกษตรกรรม จำนวน **${rows.length} คน**\n\n${toMarkdownTable(tableRows, columns)}`;
    }

    // 8) ค้นหาด้วยชื่อ/นามสกุล
    const nameMatch = students.find((s) => q.includes(s.firstName) || q.includes(s.lastName));
    if (nameMatch) return renderStudentProfile(nameMatch);

    return `ไม่พบคำสั่งที่รองรับสำหรับข้อความนี้ ลองใช้คำสั่งตัวอย่าง เช่น:\n\n- "ขอรายชื่อนักเรียนชั้น ม.3/1 พร้อมชื่อผู้ปกครองและอาชีพ"\n- "สรุปจำนวนนักเรียนจำแนกชาย-หญิง ทุกระดับชั้น"\n- "ดึงรายชื่อนักเรียนที่มีสถานะความด้อยโอกาสเป็นเด็กยากจน ในระดับชั้น ป.1 ถึง 6"\n- "วิเคราะห์ค่าน้ำหนักและส่วนสูงของนักเรียนชั้น อ.2"`;
  };

  const renderStudentProfile = (s) => {
    const rows = [
      ["เลกประจำตัวประชาชน", maskNationalId(s.nationalId, teacherMode)],
      ["เลกประจำตัวนักเรียน", safeValue(s.studentId)],
      ["ชื่อ-สกุล", `${s.prefix} ${s.firstName} ${s.lastName}`],
      ["ระดับชั้น/ห้อง", `${safeValue(s.grade)} / ${safeValue(s.room)}`],
      ["เพศ", safeValue(s.gender)],
      ["วันเกิด", `${safeValue(s.birthDay)}/${safeValue(s.birthMonth)}/${safeValue(s.birthYearBE)} (อายุ ${safeValue(s.age)} ปี)`],
      ["น้ำหนัก/ส่วนสูง", `${safeValue(s.weight)} กก. / ${safeValue(s.height)} ซม.`],
      ["กลุ่มเลือด", safeValue(s.bloodType)],
      ["ที่อยู่", teacherMode ? `${safeValue(s.houseNo)} หมู่ ${safeValue(s.moo)} ต.${safeValue(s.subdistrict)} อ.${safeValue(s.district)} จ.${safeValue(s.province)}` : "ต้องเปิดโหมดครูประจำชั้นเพื่อดูที่อยู่แบบเต็ม"],
      ["ผู้ปกครอง", `${safeValue(s.guardianPrefix)} ${safeValue(s.guardianFirstName)} ${safeValue(s.guardianLastName)} (${safeValue(s.guardianOccupation)})`],
      ["บิดา", `${safeValue(s.fatherPrefix)} ${safeValue(s.fatherFirstName)} ${safeValue(s.fatherLastName)} (${safeValue(s.fatherOccupation)})`],
      ["มารดา", `${safeValue(s.motherPrefix)} ${safeValue(s.motherFirstName)} ${safeValue(s.motherLastName)} (${safeValue(s.motherOccupation)})`],
      ["สถานะความด้อยโอกาส", safeValue(s.disadvantage)],
    ];
    const table = rows.map(([k, v]) => `| ${k} | ${v} |`).join("\n");
    return `**ข้อมูลนักเรียนรายบุคคล**\n\n| รายการ | ข้อมูล |\n| --- | --- |\n${table}`;
  };

  const handleSend = () => {
    const query = input.trim();
    if (!query) return;
    pushMessage("user", query);
    setInput("");
    setTimeout(() => {
      const answer = processQuery(query);
      pushMessage("assistant", answer);
    }, 200);
  };

  const quickCommands = [
    "ขอรายชื่อนักเรียนชั้น ม.3 พร้อมชื่อผู้ปกครองและอาชีพ",
    "สรุปจำนวนนักเรียนจำแนกชาย-หญิง ทุกระดับชั้น",
    "ดึงรายชื่อนักเรียนที่มีสถานะความด้อยโอกาสเป็นเด็กยากจน ในระดับชั้น ป.1 ถึง 6",
    "วิเคราะห์ค่าน้ำหนักและส่วนสูงของนักเรียนชั้น อ.2",
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
      <header className="bg-[#0b1f3a] text-white shadow-lg">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#d6a84f] p-2 text-[#0b1f3a]"><Bot size={26} /></div>
            <div>
              <h1 className="text-base font-bold sm:text-xl">AI ผู้ช่วยจัดการระบบสารสนเทศนักเรียน</h1>
              <p className="text-xs text-blue-200 sm:text-sm">โรงเรียน{SCHOOL_NAME} · รหัสโรงเรียน {SCHOOL_ID} · ปีการศึกษา 2569</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-full bg-white/10 px-3 py-1">นักเรียนในระบบ {stats.total} คน</span>
            <button
              onClick={() => setTeacherMode((v) => !v)}
              className={`flex items-center gap-1 rounded-full px-3 py-1 font-semibold transition ${teacherMode ? "bg-[#d6a84f] text-[#0b1f3a]" : "bg-white/10 text-white"}`}
              title="เปิดเฉพาะเมื่อต้องใช้ข้อมูลภายในสำหรับครูประจำชั้น"
            >
              {teacherMode ? <Unlock size={14} /> : <Lock size={14} />}
              {teacherMode ? "โหมดครูประจำชั้น: เปิด" : "โหมดครูประจำชั้น: ปิด"}
            </button>
          </div>
        </div>
      </header>

      {teacherMode && (
        <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 text-xs text-amber-800 sm:px-6">
          <AlertTriangle size={14} />
          กำลังแสดงข้อมูลเลกประจำตัวประชาชนและที่อยู่แบบเต็ม ใช้เพื่อวัตถุประสงค์ดูแลช่วยเหลือนักเรียนเท่านั้น
        </div>
      )}

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 py-5 sm:px-6">
        <section className="grid grid-cols-3 gap-3">
          <StatCard icon={<Database />} label="นักเรียนทั้งหมด" value={stats.total} />
          <StatCard icon={<User />} label="ชาย" value={stats.male} />
          <StatCard icon={<User />} label="หญิง" value={stats.female} />
        </section>

        <section className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-5" style={{ maxHeight: "55vh" }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[90%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === "user" ? "bg-[#0b1f3a] text-white" : "border border-slate-200 bg-slate-50 text-slate-800"}`}>
                  {m.role === "assistant" && <Sparkles className="mb-1 inline text-[#d6a84f]" size={14} />} {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 p-3 sm:p-4">
            <div className="mb-2 flex flex-wrap gap-2">
              {quickCommands.map((cmd) => (
                <button key={cmd} onClick={() => setInput(cmd)} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 hover:bg-amber-50">
                  {cmd}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => fileRef.current?.click()} className="btn-secondary" title="อัปโหลดไฟล์ 2569-1-student.csv">
                <FileUp size={16} />
              </button>
              <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={handleImportCsv} hidden />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="พิมพ์คำสั่ง เช่น สรุปจำนวนนักเรียนจำแนกชาย-หญิง..."
                className="input flex-1"
              />
              <button onClick={handleSend} className="btn-primary"><Send size={16} /></button>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-green-600" /> ข้อมูลอ้างอิงจากฐานข้อมูล 2569-1-student.csv ตามนโยบาย PDPA</span>
          <button
            onClick={() => exportResultCsv(students, FIELD_ORDER.map((k) => ({ key: k, label: k })), `students-2569-${Date.now()}.csv`)}
            className="flex items-center gap-1 text-[#0b1f3a] hover:underline"
          >
            <Download size={14} /> ส่งออกฐานข้อมูลทั้งหมด (CSV)
          </button>
        </section>
      </main>

      <style>{`.input{width:100%;border:1px solid #cbd5e1;border-radius:.65rem;padding:.6rem .9rem;background:white;outline:none}.input:focus{border-color:#d6a84f;box-shadow:0 0 0 3px #fef3c7}.btn-secondary,.btn-primary{display:inline-flex;align-items:center;gap:.4rem;border-radius:.6rem;padding:.6rem .8rem;font-size:.875rem;font-weight:600;transition:.2s}.btn-secondary{border:1px solid #cbd5e1;background:white;color:#334155}.btn-secondary:hover{background:#f8fafc}.btn-primary{background:#0b1f3a;color:white}.btn-primary:hover{background:#16365f}`}</style>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <span className="text-[#0b1f3a]">{icon}</span>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-lg font-bold text-[#0b1f3a]">{value}</p>
      </div>
    </div>
  );
}

export default App;

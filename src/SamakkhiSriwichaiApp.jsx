import React, { useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Download,
  FileUp,
  Filter,
  RotateCcw,
  Save,
  Search,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const STORAGE_KEY = "samakkhi-sriwichai-indicators-v1";
const SCHOOL_ID = "51020099";
const DEFAULT_UPDATED = "2026-06-10 03:05:01";

const STATUS = {
  completed: "ดำเนินการแล้ว",
  progress: "อยู่ระหว่างดำเนินการ",
  notStarted: "ยังไม่ได้ดำเนินการ",
  issue: "มีปัญหา/ต้องแก้ไข",
};

// ชุดข้อมูลตั้งต้น: แทนแถวจาก Raw Log ที่มีค่าว่างด้วยสถานะที่ใช้งานได้จริง
const DEFAULT_DATA = [
  {
    id: "1.1.1",
    schoolId: SCHOOL_ID,
    indicatorName: "การกำหนดวิสัยทัศน์ พันทกิจ และเป้าหมายของสถานศึกษา",
    lastUpdated: DEFAULT_UPDATED,
    status: STATUS.notStarted,
    detail: "รอการระบุข้อมูลจากผู้รับผิดชอบ",
  },
  {
    id: "1.2.1",
    schoolId: SCHOOL_ID,
    indicatorName: "การจัดทำแผนพัฒนาคุณภาพการศึกษา",
    lastUpdated: DEFAULT_UPDATED,
    status: STATUS.notStarted,
    detail: "รอการระบุข้อมูลจากผู้รับผิดชอบ",
  },
  {
    id: "2.1.1",
    schoolId: SCHOOL_ID,
    indicatorName: "การบริหารจัดการและติดตามโครงการ",
    lastUpdated: DEFAULT_UPDATED,
    status: STATUS.progress,
    detail: "อยู่ระหว่างการดำเนินการติดตาม",
  },
  {
    id: "2.1.2",
    schoolId: SCHOOL_ID,
    indicatorName: "การจัดทำและติดตามแผนปฏิบัติการประจำปี",
    lastUpdated: DEFAULT_UPDATED,
    status: STATUS.completed,
    detail: "ดำเนินการแล้ว",
  },
  {
    id: "2.2.1",
    schoolId: SCHOOL_ID,
    indicatorName: "การพัฒนาระบบประกันคุณภาพภายใน",
    lastUpdated: DEFAULT_UPDATED,
    status: STATUS.notStarted,
    detail: "รอการระบุข้อมูลจากผู้รับผิดชอบ",
  },
  {
    id: "3.1.1",
    schoolId: SCHOOL_ID,
    indicatorName: "การบริหารทรัพยากรและงบประมาญ",
    lastUpdated: DEFAULT_UPDATED,
    status: STATUS.completed,
    detail: "ดำเนินการแล้ว",
  },
  {
    id: "3.1.8",
    schoolId: SCHOOL_ID,
    indicatorName: "การจำหน่ายและการจัดการพัสดุ/ครุภัณฑ์",
    lastUpdated: DEFAULT_UPDATED,
    status: STATUS.issue,
    detail: "ยังไม่สามารถจำหน่ายได้",
  },
  {
    id: "3.2.1",
    schoolId: SCHOOL_ID,
    indicatorName: "การส่งเสริมและพัฒนาบุคลากร",
    lastUpdated: DEFAULT_UPDATED,
    status: STATUS.progress,
    detail: "อยู่ระหว่างรวบรวมหลักฐาน",
  },
];

const COLORS = ["#16a34a", "#f59e0b", "#64748b", "#dc2626"];

function getInitialData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_DATA;
  } catch {
    return DEFAULT_DATA;
  }
}

function nowString() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function escapeCsv(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function statusClass(status) {
  if (status === STATUS.completed) return "bg-green-100 text-green-700";
  if (status === STATUS.progress) return "bg-amber-100 text-amber-700";
  if (status === STATUS.issue) return "bg-red-100 text-red-700";
  return "bg-slate-100 text-slate-600";
}

function App() {
  const [items, setItems] = useState(getInitialData);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ทั้งหมด");
  const [categoryFilter, setCategoryFilter] = useState("ทั้งหมด");
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState("");
  const fileRef = useRef(null);

  const persist = (next) => {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const filtered = useMemo(() => items.filter((item) => {
    const text = `${item.id} ${item.indicatorName} ${item.detail}`.toLowerCase();
    const matchesQuery = text.includes(query.toLowerCase());
    const matchesStatus = statusFilter === "ทั้งหมด" || item.status === statusFilter;
    const matchesCategory = categoryFilter === "ทั้งหมด" || item.id.startsWith(`${categoryFilter}.`);
    return matchesQuery && matchesStatus && matchesCategory;
  }), [items, query, statusFilter, categoryFilter]);

  const counts = useMemo(() => ({
    total: items.length,
    completed: items.filter((x) => x.status === STATUS.completed).length,
    progress: items.filter((x) => x.status === STATUS.progress).length,
    issue: items.filter((x) => x.status === STATUS.issue).length,
  }), [items]);

  const pieData = [
    { name: STATUS.completed, value: counts.completed },
    { name: STATUS.progress, value: counts.progress },
    { name: STATUS.notStarted, value: items.filter((x) => x.status === STATUS.notStarted).length },
    { name: STATUS.issue, value: counts.issue },
  ];

  const barData = ["1", "2", "3"].map((category) => ({
    name: `หมวด ${category}`,
    "ดำเนินการแล้ว": items.filter((x) => x.id.startsWith(`${category}.`) && x.status === STATUS.completed).length,
    "อยู่ระหว่างดำเนินการ": items.filter((x) => x.id.startsWith(`${category}.`) && x.status === STATUS.progress).length,
    "ปัญหา": items.filter((x) => x.id.startsWith(`${category}.`) && x.status === STATUS.issue).length,
  }));

  const saveEdit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next = items.map((item) => item.id === editing.id ? {
      ...item,
      status: form.get("status"),
      detail: form.get("detail") || "-",
      lastUpdated: nowString(),
    } : item);
    persist(next);
    setEditing(null);
    setNotice("บันทึกข้อมูลลง LocalStorage แล้ว");
    setTimeout(() => setNotice(""), 2500);
  };

  const exportCsv = () => {
    const headers = ["id", "schoolId", "indicatorName", "lastUpdated", "status", "detail"];
    const rows = items.map((x) => headers.map((h) => escapeCsv(x[h])).join(","));
    const csv = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `samakkhi-indicators-${nowString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetData = () => {
    if (window.confirm("ยืนยันการคืนค่าข้อมูลตั้งต้น? ข้อมูลที่แก้ไขไว้จะถูกแทนที่")) {
      persist(DEFAULT_DATA);
      setNotice("คืนค่าข้อมูลตั้งต้นแล้ว");
      setTimeout(() => setNotice(""), 2500);
    }
  };

  const importCsv = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const lines = String(reader.result).replace(/^\uFEFF/, "").split(/\r?\n/).filter(Boolean);
      const headers = lines.shift().split(",").map((x) => x.replaceAll('"', "").trim());
      const parseLine = (line) => line.match(/("(?:[^"]|"")*"|[^,]*)/g).filter((x) => x !== "").slice(0, headers.length).map((x) => x.replace(/^"|"$/g, "").replaceAll('""', '"'));
      const imported = lines.map((line) => Object.fromEntries(parseLine(line).map((v, i) => [headers[i], v]))).filter((x) => x.id);
      if (imported.length) persist(imported.map((x) => ({ ...x, schoolId: x.schoolId || SCHOOL_ID, status: x.status || STATUS.notStarted, detail: x.detail || "-" })));
      setNotice(`นำเข้า ${imported.length} รายการแล้ว`);
      setTimeout(() => setNotice(""), 2500);
    };
    reader.readAsText(file, "UTF-8");
    event.target.value = "";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-[#0b1f3a] text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#d6a84f] p-2 text-[#0b1f3a]"><Activity size={27} /></div>
            <div>
              <h1 className="text-lg font-bold sm:text-2xl">ระบบสารสนเทศโรงเรียนสามัคคีศรีวิชัย</h1>
              <p className="text-xs text-blue-200 sm:text-sm">Samakkhi Sriwichai School Information System · รหัสโรงเรียน {SCHOOL_ID}</p>
            </div>
          </div>
          <div className="hidden text-right text-xs text-blue-200 sm:block">Executive Dashboard<br /><span className="text-[#f3cf75]">KPI & Indicator Tracking</span></div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        {notice && <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{notice}</div>}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <KpiCard title="ตัวชี้วัดทั้งหมด" value={counts.total} icon={<BarChart3 />} color="text-[#0b1f3a]" />
          <KpiCard title="ดำเนินการเสร็จสิ้น" value={counts.completed} icon={<CheckCircle2 />} color="text-green-600" />
          <KpiCard title="อยู่ระหว่างดำเนินการ" value={counts.progress} icon={<Activity />} color="text-amber-600" />
          <KpiCard title="ปัญหา/รอการจำหน่าย" value={counts.issue} icon={<AlertTriangle />} color="text-red-600" />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <ChartCard title="สัดส่วนสถานะการดำเนินงาน">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="48%" outerRadius={85} label={({ value }) => value}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="สถานะตามหมวดหมู่ตัวชี้วัด">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip /><Legend />
                <Bar dataKey="ดำเนินการแล้ว" fill="#16a34a" />
                <Bar dataKey="อยู่ระหว่างดำเนินการ" fill="#f59e0b" />
                <Bar dataKey="ปัญหา" fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-5">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div>
                <h2 className="text-lg font-bold text-[#0b1f3a]">รายการตัวชี้วัด</h2>
                <p className="text-sm text-slate-500">คลีกแตวเพื่อเปิดฟอร์มแก้ไขข้อมูลด่วน</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={exportCsv} className="btn-secondary"><Download size={16} /> Export CSV</button>
                <button onClick={() => fileRef.current?.click()} className="btn-secondary"><FileUp size={16} /> Import CSV</button>
                <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={importCsv} hidden />
                <button onClick={resetData} className="btn-danger"><RotateCcw size={16} /> Reset</button>
              </div>
            </div>
            <div className="grid gap-2 md:grid-cols-[1fr_210px_150px]">
              <label className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ค้นหารหัส ชื่อ หรือรายละเอียด..." className="input pl-10" />
              </label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input">
                <option>ทั้งหมด</option>
                {Object.values(STATUS).map((s) => <option key={s}>{s}</option>)}
              </select>
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="input">
                <option>ทั้งหมด</option>
                <option value="1">หมวด 1</option>
                <option value="2">หมวด 2</option>
                <option value="3">หมวด 3</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-[#0b1f3a] text-xs uppercase text-white">
                <tr>
                  <th className="px-5 py-3">รหัส</th>
                  <th className="px-5 py-3">ชื่อตัวชี้วัด</th>
                  <th className="px-5 py-3">สถานะ</th>
                  <th className="px-5 py-3">รายละเอียด</th>
                  <th className="px-5 py-3">อัปเดตล่าสุด</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id} onClick={() => setEditing(item)} className="cursor-pointer transition hover:bg-amber-50">
                    <td className="px-5 py-4 font-bold text-[#0b1f3a]">{item.id}</td>
                    <td className="max-w-[280px] px-5 py-4 font-medium">{item.indicatorName}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${statusClass(item.status)}`}>{item.status}</span>
                    </td>
                    <td className="max-w-[300px] px-5 py-4 text-slate-600">{item.detail || "-"}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">{item.lastUpdated}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-5 py-12 text-center text-slate-500">
                      <Filter className="mx-auto mb-2" />
                      ไม่พบรายการตามเงื่อนไข
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <form onSubmit={saveEdit} className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b p-5">
              <div>
                <p className="text-sm font-semibold text-[#d19528]">แก้ไขตัวชี้วัด {editing.id}</p>
                <h3 className="mt-1 text-lg font-bold text-[#0b1f3a]">{editing.indicatorName}</h3>
              </div>
              <button type="button" onClick={() => setEditing(null)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"><X /></button>
            </div>
            <div className="space-y-4 p-5">
              <label className="block text-sm font-semibold">
                สถานะ
                <select name="status" defaultValue={editing.status} className="input mt-2">
                  {Object.values(STATUS).map((s) => <option key={s}>{s}</option>)}
                </select>
              </label>
              <label className="block text-sm font-semibold">
                รายละเอียดการดำเนินงาน
                <textarea name="detail" defaultValue={editing.detail === "-" ? "" : editing.detail} rows="5" placeholder="เช่น อยู่ระหว่างรวบรวมเอกสาร..." className="input mt-2 resize-y" />
              </label>
              <p className="text-xs text-slate-500">ระบบจะบันทึกวันเวลาอัตโนมัติเป็นเวลาปัจจุบันของเครื่อง</p>
            </div>
            <div className="flex justify-end gap-2 border-t bg-slate-50 p-4">
              <button type="button" onClick={() => setEditing(null)} className="btn-secondary">ยกเลิก</button>
              <button type="submit" className="btn-primary"><Save size={17} /> บันทึกข้อมูล</button>
            </div>
          </form>
        </div>
      )}

      <style>{`.input{width:100%;border:1px solid #cbd5e1;border-radius:.65rem;padding:.6rem .75rem;background:white;outline:none}.input:focus{border-color:#d6a84f;box-shadow:0 0 0 3px #fef3c7}.btn-secondary,.btn-danger,.btn-primary{display:inline-flex;align-items:center;gap:.4rem;border-radius:.6rem;padding:.6rem .8rem;font-size:.875rem;font-weight:600;transition:.2s}.btn-secondary{border:1px solid #cbd5e1;background:white;color:#334155}.btn-secondary:hover{background:#f8fafc}.btn-danger{border:1px solid #fecaca;background:#fff1f2;color:#b91c1c}.btn-danger:hover{background:#ffe4e6}.btn-primary{background:#0b1f3a;color:white}.btn-primary:hover{background:#16365f}`}</style>
    </div>
  );
}

function KpiCard({ title, value, icon, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500 sm:text-sm">{title}</p>
        <span className={color}>{React.cloneElement(icon, { size: 22 })}</span>
      </div>
      <p className={`mt-3 text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h2 className="mb-2 font-bold text-[#0b1f3a]">{title}</h2>
      {children}
    </div>
  );
}

export default App;

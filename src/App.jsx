import { useState, useMemo, useEffect, useCallback } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, CartesianGrid } from "recharts";

const API = "/.netlify/functions";
const fmt = n => "$" + Math.abs(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const fmtK = n => n >= 1000 ? "$" + (n / 1000).toFixed(1) + "k" : "$" + n.toFixed(0);
const pLabel = p => { const [y, m] = p.split("-"); const mn = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; return mn[+m] + " '" + y.slice(2); };
const today = () => new Date().toISOString().split("T")[0];
const HOUSE_TYPES = ["Grocery", "Misc", "Electricity", "Cat", "Household goods", "Rent"];
const TYPE_META = { Grocery: { c: "#7a8c6e", i: "\u{1F6D2}" }, Misc: { c: "#b89a7a", i: "\u{1F4E6}" }, Electricity: { c: "#c9a84c", i: "\u26A1" }, "Household goods": { c: "#7a9aad", i: "\u{1F3E0}" }, Cat: { c: "#c48b9f", i: "\u{1F431}" }, Rent: { c: "#9b8ab5", i: "\u{1F3E1}" } };
const tts = { background: "#fbf8f4", border: "1px solid #e0d8ce", borderRadius: 10, fontSize: 12, fontFamily: "'Outfit',sans-serif", boxShadow: "0 2px 8px rgba(0,0,0,.06)" };
const PINS = { KT: "1104", GLC: "2102" };

/* ── Friends data (hardcoded until sheets backend) ── */
const PETTY_DATA=[{date:"28 Sep 2024",item:"Julias Wedding Part 1",price:94,paid:false,notes:""},{date:"5 Oct 2024",item:"Julias Wedding Part 2",price:144,paid:false,notes:""},{date:"16 Nov 2024",item:"Loan",price:200,paid:true,notes:"Settlement in Jan"},{date:"17 Nov 2024",item:"Loan for shopee",price:200,paid:true,notes:"Settlement in Jan"},{date:"23 Nov 2024",item:"Nic Goh's Wedding",price:190,paid:false,notes:""},{date:"28 Mar 2025",item:"Rybelsus",price:361.85,paid:false,notes:""},{date:"18 Apr 2025",item:"DHL",price:367.9,paid:false,notes:""},{date:"17 May 2025",item:"Grab balance",price:100,paid:false,notes:""},{date:"28 May 2025",item:"Shit",price:800,paid:false,notes:"did you already pay me 295 for this?"},{date:"7 Jul 2025",item:"Framer",price:25,paid:true,notes:""},{date:"8 Jul 2025",item:"massage",price:40,paid:false,notes:""},{date:"18 Jul 2025",item:"massage",price:44,paid:false,notes:""},{date:"23 Jul 2025",item:"massage",price:44,paid:false,notes:""},{date:"3 Aug 2025",item:"massage + rental",price:780,paid:false,notes:""},{date:"14 Aug 2025",item:"cigs + 10 paylah",price:20,paid:false,notes:""},{date:"18 Aug 2025",item:"Car tyre replacement",price:105,paid:false,notes:""},{date:"14 Jul 2024",item:"Movie tickets and superman cup",price:28,paid:false,notes:""},{date:"",item:"Hitch from Wave9",price:13.3,paid:false,notes:""},{date:"23 Aug 2024",item:"NTUC income Travel Insurance Top up",price:15,paid:false,notes:"Supposed to be $12.27"},{date:"1 August 2024",item:"Tyre Repair",price:35,paid:false,notes:""},{date:"22 July 2024",item:"Pocket Flip Coffee",price:8,paid:false,notes:""},{date:"23 July 2024",item:"Fujiwara Tofu Shop",price:14.14,paid:false,notes:""},{date:"14 July 2024",item:"Enjoy eating dinner",price:31.2,paid:false,notes:""},{date:"16 July 2024",item:"I love taimei",price:10.9,paid:false,notes:""},{date:"2 December 2025",item:"LTA fine",price:300,paid:false,notes:""},{date:"8 Nov",item:"Cheryls wedding angpow",price:280,paid:false,notes:""},{date:"10 Nov",item:"Ashi",price:45,paid:false,notes:""},{date:"16 Dec",item:"Vietnam Cash",price:100,paid:false,notes:""},{date:"19 Dec",item:"Morning Glory Dinner",price:36.2,paid:false,notes:""},{date:"",item:"Kenneth's Santa gift",price:35.6,paid:false,notes:""},{date:"16 Jan",item:"Danang Flight tix",price:425,paid:false,notes:""},{date:"22 Jan",item:"Elephant & Ostrich",price:760,paid:false,notes:""},{date:"Feb-Mar 2026",item:"Grab/Gojek/CDG/Tada",price:79.12,paid:false,notes:"all receipts in Telegram"},{date:"7 Mar",item:"Peach Garden Dads bday",price:46,paid:false,notes:""},{date:"15 Mar",item:"Daisy Dream Kitchen",price:30.65,paid:false,notes:""}];
const FRIENDS_DATA=[{date:"Jun 30 2024",item:"Hunan Lunch",price:29,owedBy:"Sarah",paid:true,notes:""},{date:"Jun 30 2024",item:"Cat teaser",price:5,owedBy:"Sarah",paid:true,notes:""},{date:"Jul 1 2024",item:"Splitwise",price:18.91,owedBy:"Eunice Lee",paid:false,notes:""},{date:"Jul 1 2024",item:"Splitwise",price:18.81,owedBy:"Trina",paid:false,notes:""},{date:"Jul 1 2024",item:"IVINs Dinner",price:18.91,owedBy:"Chloe See",paid:false,notes:"Write off"},{date:"6 Jul 2024",item:"Sandwich",price:12.5,owedBy:"Julia",paid:true,notes:""},{date:"6 Jul 2024",item:"Isshin Machi Drink",price:3.9,owedBy:"Julia",paid:false,notes:"Write off"},{date:"3 Jul 2024",item:"Isshin Machi Dinner",price:15.5,owedBy:"Dave",paid:true,notes:""},{date:"26 May 2024",item:"Korkor Cake",price:28.5,owedBy:"Aaron",paid:false,notes:""},{date:"13 July 2024",item:"NY Cafe",price:9.63,owedBy:"Julia",paid:true,notes:""},{date:"14 July 2024",item:"Enjoy eating dinner",price:31.2,owedBy:"Kenneth",paid:false,notes:""},{date:"16 July 2024",item:"I love taimei",price:10.9,owedBy:"Kenneth",paid:false,notes:""},{date:"17 July 2024",item:"Huggs Coffee",price:5.5,owedBy:"Mun",paid:false,notes:"Write off"},{date:"24 July 2024",item:"Welcia Mask",price:8,owedBy:"Sheryl",paid:false,notes:"Write off?"},{date:"25 July 2024",item:"Funtoast Coffee",price:3.2,owedBy:"Chloe See",paid:false,notes:"Write off"},{date:"25 July 2024",item:"Funtoast Coffee",price:3.2,owedBy:"Siew Mei",paid:true,notes:""},{date:"25 July 2024",item:"Funtoast Coffee",price:2.1,owedBy:"Edwin",paid:false,notes:"Write off"},{date:"1 Sep 2024",item:"Pocket Flip Coffee",price:6.6,owedBy:"Vanessa",paid:false,notes:"Write off?"},{date:"1 Sep 2024",item:"Pocket Flip Coffee",price:6.6,owedBy:"Rina",paid:false,notes:"Write off?"},{date:"1 Sep 2024",item:"Pocket Flip Coffee",price:6.6,owedBy:"GLC",paid:false,notes:""},{date:"7 Sep 2024",item:"Steamboat",price:70,owedBy:"Frans/Bel",paid:true,notes:""},{date:"7 Sep 2024",item:"Steamboat",price:35,owedBy:"Darrell",paid:true,notes:""},{date:"",item:"Rockfish",price:104.72,owedBy:"Aveline",paid:false,notes:""},{date:"",item:"Kinfolk Perfume",price:166.42,owedBy:"Chloe",paid:false,notes:""}];

/* ── Shared Components ── */
const Card = ({ children, s = {} }) => <div style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1px solid #ede7df", boxShadow: "0 1px 3px rgba(0,0,0,.03)", marginBottom: 12, ...s }}>{children}</div>;
const Lbl_ = ({ children }) => <p style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#bbb0a2", margin: "0 0 12px", fontWeight: 500 }}>{children}</p>;
const Badge = ({ who }) => <span style={{ padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: who === "KT" ? "#e8ded3" : "#dce5dc", color: who === "KT" ? "#8b7355" : "#5c7a5c" }}>{who === "KT" ? "Kenneth" : "Gracelynn"}</span>;
const Inp = ({ ...p }) => <input {...p} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e0d8ce", background: "#fbf8f4", color: "#5c4f42", fontSize: 14, fontFamily: "'Outfit',sans-serif", boxSizing: "border-box", ...(p.style || {}) }} />;
const Sel = ({ ...p }) => <select {...p} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e0d8ce", background: "#fbf8f4", color: "#5c4f42", fontSize: 14, fontFamily: "'Outfit',sans-serif", boxSizing: "border-box", ...(p.style || {}) }} />;
const Fl = ({ children }) => <label style={{ display: "block", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "#b0a395", marginBottom: 5, fontWeight: 500 }}>{children}</label>;
const Btn = ({ children, active, onClick, s = {} }) => <button onClick={onClick} style={{ padding: "8px 16px", borderRadius: 8, border: active ? "none" : "1px solid #e0d8ce", background: active ? "#5c4f42" : "#fff", color: active ? "#f7f3ee" : "#9a8e82", fontSize: 12, fontWeight: 500, fontFamily: "inherit", cursor: "pointer", ...s }}>{children}</button>;

/* ── PIN Screen ── */
function PinScreen({ onUnlock }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const handleSubmit = () => {
    if (pin === PINS.KT) { onUnlock("KT"); }
    else if (pin === PINS.GLC) { onUnlock("GLC"); }
    else { setError(true); setPin(""); }
  };
  return (
    <Card s={{ textAlign: "center", padding: "40px 24px" }}>
      <p style={{ fontSize: 32, margin: "0 0 8px" }}>{"\u{1F512}"}</p>
      <p style={{ fontSize: 16, fontFamily: "'Fraunces',serif", fontWeight: 600, color: "#5c4f42", margin: "0 0 4px" }}>Private Ledger</p>
      <p style={{ fontSize: 13, color: "#b0a395", margin: "0 0 24px" }}>Enter your PIN to view</p>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ width: 40, height: 48, borderRadius: 10, border: "1px solid #e0d8ce", background: pin.length >= i ? "#5c4f42" : "#fbf8f4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#fff", transition: "all .15s" }}>
            {pin.length >= i ? "\u2022" : ""}
          </div>
        ))}
      </div>
      {error && <p style={{ color: "#c07070", fontSize: 12, margin: "0 0 12px" }}>Wrong PIN. Try again.</p>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, maxWidth: 220, margin: "0 auto" }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, "del"].map((n, i) => (
          n === null ? <div key={i} /> : (
            <button key={i} onClick={() => {
              setError(false);
              if (n === "del") setPin(p => p.slice(0, -1));
              else if (pin.length < 4) {
                const np = pin + n;
                setPin(np);
                if (np.length === 4) setTimeout(() => {
                  if (np === PINS.KT) onUnlock("KT");
                  else if (np === PINS.GLC) onUnlock("GLC");
                  else { setError(true); setPin(""); }
                }, 150);
              }
            }} style={{
              width: 56, height: 56, borderRadius: 14, border: "1px solid #e0d8ce", background: "#fff", fontSize: n === "del" ? 16 : 22, fontFamily: "'Outfit',sans-serif", color: "#5c4f42", cursor: "pointer", fontWeight: 400,
            }}>{n === "del" ? "\u232B" : n}</button>
          )
        ))}
      </div>
    </Card>
  );
}

/* ── Loan/Petty Row ── */
const LoanRow = ({ tx, type }) => {
  const isPaid = tx.status === 'Paid' || tx.paid;
  return (
  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: "1px solid #f5f0ea" }}>
    <div style={{ width: 36, height: 36, borderRadius: 10, background: isPaid ? "#7a8c6e18" : type === "loan" ? "#c0707018" : "#b89a7a18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>
      {isPaid ? "\u2705" : type === "loan" ? "\u{1F4B8}" : "\u{1F4B0}"}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
        <p style={{ fontSize: 13, fontWeight: 500, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 8, textDecoration: isPaid ? "line-through" : "none", opacity: isPaid ? 0.5 : 1 }}>{tx.item}</p>
        <p style={{ fontSize: 14, fontFamily: "'Fraunces',serif", fontWeight: 600, color: isPaid ? "#7a8c6e" : "#c07070", margin: 0, flexShrink: 0, opacity: isPaid ? 0.5 : 1 }}>{fmt(tx.amount || tx.price)}</p>
      </div>
      <p style={{ fontSize: 11, color: "#b8ada0", margin: 0 }}>
        {tx.date || "No date"}{tx.notes ? ` \u2022 ${tx.notes}` : ""}
      </p>
    </div>
  </div>
);};

/* ═══════════ MAIN APP ═══════════ */
export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [houseTx, setHouseTx] = useState([]);
  const [monthlyMeta, setMonthlyMeta] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [loanEntries, setLoanEntries] = useState([]);
  const [saving, setSaving] = useState(false);

  const [account, setAccount] = useState("household");
  const [tab, setTab] = useState("overview");
  const [pinUser, setPinUser] = useState(null); // null = locked, "KT" or "GLC" = unlocked

  // Household filters
  const [hPeriod, setHPeriod] = useState("all");
  const [hPaidBy, setHPaidBy] = useState("All");
  const [hType, setHType] = useState("All");
  const [hSearch, setHSearch] = useState("");
  const [hSort, setHSort] = useState("date");
  const [hSortDir, setHSortDir] = useState("desc");
  const [delConfirm, setDelConfirm] = useState(null);

  // Add form
  const [fDate, setFDate] = useState(today());
  const [fItem, setFItem] = useState("");
  const [fAmount, setFAmount] = useState("");
  const [fPaidBy, setFPaidBy] = useState("KT");
  const [fType, setFType] = useState("Grocery");
  const [fRemarks, setFRemarks] = useState("");

  // Loan sub-tab
  const [loanTab, setLoanTab] = useState("loans"); // loans | petty

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API}/read-transactions`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setHouseTx(data.transactions || []);
      setMonthlyMeta(data.monthly_meta || []);
      setSettlements(data.settlements || []);
      setLoanEntries(data.loan_entries || []);
    } catch (e) { setError(e.message); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── Household computed ── */
  const hPeriods = useMemo(() => [...new Set(houseTx.map(t => t.period))].sort(), [houseTx]);
  const hFiltered = useMemo(() => {
    let l = [...houseTx];
    if (hPeriod !== "all") l = l.filter(t => t.period === hPeriod);
    if (hPaidBy !== "All") l = l.filter(t => t.paidBy === hPaidBy);
    if (hType !== "All") l = l.filter(t => t.type === hType);
    if (hSearch) l = l.filter(t => t.item.toLowerCase().includes(hSearch.toLowerCase()));
    l.sort((a, b) => { if (hSort === "price") return hSortDir === "asc" ? a.price - b.price : b.price - a.price; return hSortDir === "asc" ? String(a[hSort]).localeCompare(String(b[hSort])) : String(b[hSort]).localeCompare(String(a[hSort])); });
    return l;
  }, [houseTx, hPeriod, hPaidBy, hType, hSearch, hSort, hSortDir]);

  const hStats = useMemo(() => {
    const src = hPeriod === "all" ? houseTx : hFiltered;
    const g = src.filter(t => t.paidBy === "GLC").reduce((s, t) => s + t.price, 0);
    const k = src.filter(t => t.paidBy === "KT").reduce((s, t) => s + t.price, 0);
    const byType = {}; src.forEach(t => { byType[t.type] = (byType[t.type] || 0) + t.price; });
    return { glc: g, kt: k, total: g + k, byType };
  }, [houseTx, hFiltered, hPeriod]);

  const monthlyTrend = useMemo(() => hPeriods.map(p => {
    const mt = houseTx.filter(t => t.period === p);
    return { period: pLabel(p), total: mt.reduce((s, t) => s + t.price, 0), glc: mt.filter(t => t.paidBy === "GLC").reduce((s, t) => s + t.price, 0), kt: mt.filter(t => t.paidBy === "KT").reduce((s, t) => s + t.price, 0) };
  }), [houseTx, hPeriods]);

  const balanceHistory = monthlyMeta.map(m => ({ period: pLabel(m.period), owed: m.balance_owed || 0 }));
  const latestMeta = monthlyMeta.length > 0 ? monthlyMeta[monthlyMeta.length - 1] : null;
  const latestSettle = (() => { const s = settlements.find(x => x.period === (latestMeta?.period)); return s || { kt_status: "open", glc_status: "open" }; })();

  /* ── Loan/Petty stats (live from sheets) ── */
  const LOAN_DATA = useMemo(() => loanEntries.filter(e => e.type === 'Loan'), [loanEntries]);
  const PETTY_DATA = useMemo(() => loanEntries.filter(e => e.type === 'Petty'), [loanEntries]);
  const loanUnpaid = LOAN_DATA.filter(t => t.status !== 'Paid').reduce((s, t) => s + t.amount, 0);
  const pettyUnpaid = PETTY_DATA.filter(t => t.status !== 'Paid').reduce((s, t) => s + t.amount, 0);
  const pettyPaid = PETTY_DATA.filter(t => t.status === 'Paid').reduce((s, t) => s + t.amount, 0);

  /* ── Friends stats ── */
  const friendBalances = useMemo(() => {
    const bal = {};
    FRIENDS_DATA.forEach(f => {
      if (!bal[f.owedBy]) bal[f.owedBy] = { total: 0, paid: 0, unpaid: 0, writeOff: 0 };
      bal[f.owedBy].total += f.price;
      if (f.paid) bal[f.owedBy].paid += f.price;
      else if (f.notes?.toLowerCase().includes("write off")) bal[f.owedBy].writeOff += f.price;
      else bal[f.owedBy].unpaid += f.price;
    });
    return Object.entries(bal).sort((a, b) => b[1].unpaid - a[1].unpaid);
  }, []);

  /* ── Actions ── */
  const resetForm = () => { setFDate(today()); setFItem(""); setFAmount(""); setFPaidBy("KT"); setFType("Grocery"); setFRemarks(""); };
  const handleAdd = async () => {
    if (!fDate || !fItem || !fAmount) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/add-transaction`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ date: fDate, item: fItem.trim(), price: parseFloat(fAmount), paidBy: fPaidBy, type: fType, remarks: fRemarks.trim(), period: fDate.slice(0, 7) }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      resetForm(); await fetchData(); setTab("entries");
    } catch (e) { alert("Error: " + e.message); }
    setSaving(false);
  };
  const handleDelete = async (tx) => {
    if (delConfirm !== tx.id) { setDelConfirm(tx.id); return; }
    setSaving(true);
    try {
      const res = await fetch(`${API}/delete-transaction`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sheet: tx.sheet, row: tx.row }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setDelConfirm(null); await fetchData();
    } catch (e) { alert("Error: " + e.message); }
    setSaving(false);
  };
  const handleSettle = async (period, person, action) => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/settle-up`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ period, person, action }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      await fetchData();
    } catch (e) { alert("Error: " + e.message); }
    setSaving(false);
  };
  const toggleHSort = f => { if (hSort === f) setHSortDir(d => d === "asc" ? "desc" : "asc"); else { setHSort(f); setHSortDir("desc"); } };
  const formatDate = d => { try { const dt = new Date(d + "T00:00:00"); return dt.toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "2-digit" }); } catch { return d; } };

  const needsPin = account === "loan" || account === "friends";
  const showContent = !needsPin || pinUser;

  return (
    <div style={{ fontFamily: "'Outfit','Nunito',sans-serif", background: "#f7f3ee", color: "#4a4440", minHeight: "100vh", paddingBottom: 80 }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Fraunces:opsz,wght@9..144,400;9..144,600&display=swap" rel="stylesheet" />
      <style>{`*,*::before,*::after{box-sizing:border-box}::selection{background:#c8b8a4;color:#fff}input:focus,select:focus{outline:none;border-color:#b8a898!important}@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}@keyframes spin{to{transform:rotate(360deg)}}.recharts-cartesian-axis-tick-value{fill:#b0a395!important;font-size:10px!important}`}</style>

      {/* Header */}
      <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid #e8e0d6", background: "#fbf8f4" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <p style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#b0a395", margin: "0 0 4px", fontWeight: 500 }}>Hillcrest Arcadia</p>
          <h1 style={{ fontSize: 22, fontFamily: "'Fraunces',serif", fontWeight: 600, color: "#3d3530", margin: "0 0 14px" }}>Our Ledger</h1>

          {/* Account switcher */}
          <div style={{ display: "flex", gap: 6, marginBottom: 12, overflowX: "auto" }}>
            {[{ k: "household", l: "\u{1F3E0} Household", cl: "#7a8c6e" }, { k: "loan", l: "\u{1F512} KT Loans", cl: "#c07070" }, { k: "friends", l: "\u{1F512} GLC Friends", cl: "#c48b9f" }].map(a => (
              <button key={a.k} onClick={() => { setAccount(a.k); setTab("overview"); if (a.k === "household") setPinUser(null); else if (account !== a.k) setPinUser(null); }} style={{
                padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit", whiteSpace: "nowrap",
                background: account === a.k ? a.cl + "22" : "transparent", color: account === a.k ? a.cl : "#b0a090",
                borderBottom: account === a.k ? `2px solid ${a.cl}` : "2px solid transparent",
              }}>{a.l}</button>
            ))}
          </div>

          {/* Tab switcher — only for household or when unlocked */}
          {(account === "household" || showContent) && (
            <div style={{ display: "flex", gap: 4, background: "#f0ebe4", borderRadius: 10, padding: 3 }}>
              {(account === "household" ? ["overview", "entries", "settle", "add"] : ["overview", "entries"]).map(t => (
                <button key={t} onClick={() => { setTab(t); if (t === "add") resetForm(); }} style={{
                  flex: 1, padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "inherit", textTransform: "capitalize",
                  background: tab === t ? "#fff" : "transparent", color: tab === t ? "#5c4f42" : "#b0a090",
                  boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,.06)" : "none",
                }}>{t === "add" ? "+ Add" : t}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px 16px" }}>

        {/* PIN gate for loan & friends */}
        {needsPin && !pinUser && <PinScreen onUnlock={(u) => { setPinUser(u); setTab("overview"); }} />}

        {/* Loading */}
        {account === "household" && loading && (
          <Card s={{ textAlign: "center", padding: 40 }}>
            <div style={{ width: 32, height: 32, border: "3px solid #ede7df", borderTopColor: "#b89a7a", borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto 12px" }} />
            <p style={{ color: "#b0a395", margin: 0 }}>Loading from Google Sheets...</p>
          </Card>
        )}

        {account === "household" && error && (
          <Card s={{ background: "#fff5f5", borderColor: "#f5dada" }}>
            <p style={{ color: "#c07070", margin: "0 0 8px", fontWeight: 600 }}>Connection Error</p>
            <p style={{ color: "#9a7070", margin: "0 0 12px", fontSize: 13 }}>{error}</p>
            <Btn onClick={fetchData} active>Retry</Btn>
          </Card>
        )}

        {/* ═══ HOUSEHOLD ═══ */}
        {account === "household" && !loading && !error && (
          <>
            {tab === "overview" && (
              <div style={{ animation: "fadeIn .3s" }}>
                {/* Settle banner */}
                {(() => { const s = latestSettle; const kd = s.kt_status !== "open"; const gd = s.glc_status !== "open"; if (kd && gd && s.kt_status === "settled") return null; return (
                  <Card s={{ background: "#fff8f0", borderColor: "#f0e0c8", padding: "16px 20px" }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "#b07a5b", margin: 0 }}>
                      {!kd && !gd && `\u{1F4CB} ${latestMeta ? pLabel(latestMeta.period) : ""} \u2014 Both KT and GLC have not submitted entries yet`}
                      {!kd && gd && `\u{1F4CB} ${latestMeta ? pLabel(latestMeta.period) : ""} \u2014 Kenneth has not submitted his entries yet`}
                      {kd && !gd && `\u{1F4CB} ${latestMeta ? pLabel(latestMeta.period) : ""} \u2014 Gracelynn has not submitted her entries yet`}
                      {kd && gd && s.kt_status !== "settled" && `\u2705 ${latestMeta ? pLabel(latestMeta.period) : ""} \u2014 Both done! Ready to settle.`}
                    </p>
                  </Card>
                ); })()}

                <Card s={{ textAlign: "center", padding: "28px 24px" }}>
                  <Lbl_>Latest {latestMeta ? `\u00B7 ${pLabel(latestMeta.period)}` : ""}</Lbl_>
                  {latestMeta?.balance_owed != null ? (<>
                    <p style={{ fontSize: 40, fontFamily: "'Fraunces',serif", fontWeight: 600, margin: "0 0 6px", color: latestMeta.balance_owed >= 0 ? "#b07a5b" : "#7a8c6e" }}>{fmt(latestMeta.balance_owed)}</p>
                    <p style={{ fontSize: 13, color: "#9a8e82", margin: 0 }}>{latestMeta.balance_owed >= 0 ? <><Badge who="KT" /> owes <Badge who="GLC" /></> : <><Badge who="GLC" /> owes <Badge who="KT" /></>}</p>
                  </>) : <p style={{ fontSize: 18, color: "#c0b5a8" }}>No data</p>}
                </Card>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
                  {[{ l: "Total", v: fmt(hStats.total), c: "#5c4f42" }, { l: "Gracelynn", v: fmt(hStats.glc), c: "#7a8c6e" }, { l: "Kenneth", v: fmt(hStats.kt), c: "#b07a5b" }].map((c, i) => (
                    <Card key={i} s={{ textAlign: "center", padding: "16px 10px" }}>
                      <p style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#bbb0a2", margin: "0 0 6px", fontWeight: 500 }}>{c.l}</p>
                      <p style={{ fontSize: 18, fontFamily: "'Fraunces',serif", fontWeight: 600, color: c.c, margin: 0 }}>{c.v}</p>
                    </Card>
                  ))}
                </div>

                {monthlyTrend.length > 1 && <Card><Lbl_>Monthly Spending</Lbl_><ResponsiveContainer width="100%" height={200}><AreaChart data={monthlyTrend} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}><defs><linearGradient id="gG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a3b896" stopOpacity={.4} /><stop offset="95%" stopColor="#a3b896" stopOpacity={0} /></linearGradient><linearGradient id="gK" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#d4bfa8" stopOpacity={.4} /><stop offset="95%" stopColor="#d4bfa8" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#ede7df" /><XAxis dataKey="period" tick={{ fontSize: 9 }} interval={3} /><YAxis tick={{ fontSize: 9 }} tickFormatter={fmtK} /><Tooltip contentStyle={tts} formatter={v => "$" + v.toFixed(0)} /><Area type="monotone" dataKey="glc" name="Gracelynn" stroke="#7a8c6e" fill="url(#gG)" strokeWidth={2} /><Area type="monotone" dataKey="kt" name="Kenneth" stroke="#b89a7a" fill="url(#gK)" strokeWidth={2} /></AreaChart></ResponsiveContainer></Card>}

                {balanceHistory.length > 1 && <Card><Lbl_>Balance History</Lbl_><ResponsiveContainer width="100%" height={160}><BarChart data={balanceHistory} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}><CartesianGrid strokeDasharray="3 3" stroke="#ede7df" /><XAxis dataKey="period" tick={{ fontSize: 9 }} interval={3} /><YAxis tick={{ fontSize: 9 }} tickFormatter={v => "$" + v.toFixed(0)} /><Tooltip contentStyle={tts} formatter={v => [v > 0 ? "KT owes $" + v.toFixed(2) : "GLC owes $" + Math.abs(v).toFixed(2)]} /><Bar dataKey="owed" radius={[3, 3, 0, 0]}>{balanceHistory.map((e, i) => <Cell key={i} fill={e.owed >= 0 ? "#d4bfa8" : "#a3b896"} opacity={.7} />)}</Bar></BarChart></ResponsiveContainer></Card>}

                <Card><Lbl_>By Category</Lbl_>{Object.entries(hStats.byType).sort((a, b) => b[1] - a[1]).map(([type, amt]) => { const m = TYPE_META[type] || { c: "#999", i: "\u2022" }; const mx = Object.values(hStats.byType).reduce((a, b) => Math.max(a, b), 1); return (<div key={type} style={{ marginBottom: 12 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}><span>{m.i}</span>{type}</span><span style={{ fontSize: 13, fontWeight: 500, color: m.c }}>{fmt(amt)}</span></div><div style={{ height: 4, background: "#f0ebe4", borderRadius: 3, overflow: "hidden" }}><div style={{ width: `${(amt / mx) * 100}%`, height: "100%", background: m.c, opacity: .6, borderRadius: 3 }} /></div></div>); })}</Card>
              </div>
            )}

            {tab === "entries" && (
              <div style={{ animation: "fadeIn .3s" }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                  <Sel value={hPeriod} onChange={e => setHPeriod(e.target.value)} style={{ width: "auto", flex: "0 0 auto" }}><option value="all">All months</option>{hPeriods.map(p => <option key={p} value={p}>{pLabel(p)}</option>)}</Sel>
                  {["All", "KT", "GLC"].map(p => <Btn key={p} active={hPaidBy === p} onClick={() => setHPaidBy(p)}>{p}</Btn>)}
                  <Sel value={hType} onChange={e => setHType(e.target.value)} style={{ width: "auto", flex: "0 0 auto" }}><option value="All">All</option>{HOUSE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</Sel>
                </div>
                <Inp value={hSearch} onChange={e => setHSearch(e.target.value)} placeholder="Search..." style={{ marginBottom: 12 }} />
                <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                  {[{ f: "date", l: "Date" }, { f: "item", l: "Name" }, { f: "price", l: "Amt" }].map(s => (<button key={s.f} onClick={() => toggleHSort(s.f)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600, color: hSort === s.f ? "#5c4f42" : "#c0b5a8", fontFamily: "inherit" }}>{s.l}{hSort === s.f ? (hSortDir === "asc" ? " \u2191" : " \u2193") : ""}</button>))}
                  <span style={{ marginLeft: "auto", fontSize: 11, color: "#c0b5a8" }}>{hFiltered.length}</span>
                </div>
                {hFiltered.map(tx => { const m = TYPE_META[tx.type] || { c: "#999", i: "\u2022" }; return (<div key={`${tx.sheet}-${tx.row}`} style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", marginBottom: 6, border: "1px solid #ede7df", display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 36, height: 36, borderRadius: 10, background: m.c + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{m.i}</div><div style={{ flex: 1, minWidth: 0 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}><p style={{ fontSize: 13, fontWeight: 500, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 8 }}>{tx.item}</p><p style={{ fontSize: 14, fontWeight: 600, fontFamily: "'Fraunces',serif", color: tx.paidBy === "KT" ? "#b07a5b" : "#7a8c6e", margin: 0, flexShrink: 0 }}>{fmt(tx.price)}</p></div><div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", fontSize: 11, color: "#b8ada0" }}><span>{formatDate(tx.date)}</span><span style={{ color: "#ddd" }}>&middot;</span><Badge who={tx.paidBy} /><span style={{ color: "#ddd" }}>&middot;</span><span style={{ color: m.c }}>{tx.type}</span>{tx.remarks && <><span style={{ color: "#ddd" }}>&middot;</span><span style={{ fontStyle: "italic", color: "#c0b5a8" }}>{tx.remarks}</span></>}</div></div><button onClick={() => handleDelete(tx)} disabled={saving} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, padding: 6, color: delConfirm === tx.id ? "#c07070" : "#ccc" }}>{delConfirm === tx.id ? "Sure?" : "\u{1F5D1}"}</button></div>); })}
              </div>
            )}

            {tab === "settle" && (
              <div style={{ animation: "fadeIn .3s" }}>
                <Card s={{ padding: 24 }}>
                  <Lbl_>Monthly Settlement Status</Lbl_>
                  {[...hPeriods].reverse().map(period => {
                    const s = settlements.find(x => x.period === period) || { kt_status: "open", glc_status: "open" };
                    const meta = monthlyMeta.find(m => m.period === period);
                    const isSettled = s.kt_status === "settled";
                    const bothDone = s.kt_status === "done" && s.glc_status === "done";
                    return (<div key={period} style={{ padding: "16px 0", borderBottom: "1px solid #f5f0ea", opacity: isSettled ? 0.5 : 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <div>
                          <p style={{ fontSize: 15, fontWeight: 600, fontFamily: "'Fraunces',serif", color: "#5c4f42", margin: 0 }}>{pLabel(period)}</p>
                          {meta?.balance_owed != null && <p style={{ fontSize: 12, color: "#b0a395", margin: "2px 0 0" }}>Balance: <strong style={{ color: meta.balance_owed >= 0 ? "#b07a5b" : "#7a8c6e" }}>{fmt(meta.balance_owed)}</strong></p>}
                        </div>
                        {isSettled && <span style={{ fontSize: 12, color: "#7a8c6e", fontWeight: 600 }}>{"\u2705"} Settled</span>}
                      </div>
                      {!isSettled && <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button onClick={() => handleSettle(period, "KT", s.kt_status === "open" ? "done" : "reopen")} disabled={saving} style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #e0d8ce", cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: 500, background: s.kt_status === "done" ? "#e8ded3" : "#fff", color: s.kt_status === "done" ? "#8b7355" : "#b0a090" }}>{s.kt_status === "done" ? "\u2705 KT done" : "\u23F3 KT pending"}</button>
                        <button onClick={() => handleSettle(period, "GLC", s.glc_status === "open" ? "done" : "reopen")} disabled={saving} style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #e0d8ce", cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: 500, background: s.glc_status === "done" ? "#dce5dc" : "#fff", color: s.glc_status === "done" ? "#5c7a5c" : "#b0a090" }}>{s.glc_status === "done" ? "\u2705 GLC done" : "\u23F3 GLC pending"}</button>
                        {bothDone && <button onClick={() => handleSettle(period, "KT", "settle")} disabled={saving} style={{ padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: 600, background: "#5c4f42", color: "#f7f3ee", marginLeft: "auto" }}>Settle {pLabel(period)}</button>}
                      </div>}
                    </div>);
                  })}
                </Card>
              </div>
            )}

            {tab === "add" && (
              <div style={{ animation: "fadeIn .3s" }}>
                <Card s={{ padding: 24 }}>
                  <p style={{ fontSize: 16, fontFamily: "'Fraunces',serif", fontWeight: 600, color: "#5c4f42", margin: "0 0 20px" }}>New Entry</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}><div><Fl>Date</Fl><Inp type="date" value={fDate} onChange={e => setFDate(e.target.value)} /></div><div><Fl>Amount ($)</Fl><Inp type="number" step="0.01" value={fAmount} onChange={e => setFAmount(e.target.value)} placeholder="0.00" /></div></div>
                  <div style={{ marginBottom: 12 }}><Fl>Item</Fl><Inp value={fItem} onChange={e => setFItem(e.target.value)} placeholder="e.g. PandaMart" /></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                    <div><Fl>Paid by</Fl><div style={{ display: "flex", gap: 6 }}>{["KT", "GLC"].map(p => (<button key={p} onClick={() => setFPaidBy(p)} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: fPaidBy === p ? "none" : "1px solid #e0d8ce", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "inherit", background: fPaidBy === p ? (p === "KT" ? "#d4bfa8" : "#a3b896") : "#fff", color: fPaidBy === p ? "#fff" : "#b0a090" }}>{p === "KT" ? "Kenneth" : "Gracelynn"}</button>))}</div></div>
                    <div><Fl>Category</Fl><Sel value={fType} onChange={e => setFType(e.target.value)}>{HOUSE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</Sel></div>
                  </div>
                  <div style={{ marginBottom: 16 }}><Fl>Remarks</Fl><Inp value={fRemarks} onChange={e => setFRemarks(e.target.value)} placeholder="optional" /></div>
                  <button onClick={handleAdd} disabled={saving || !fDate || !fItem || !fAmount} style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", fontSize: 15, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", background: saving ? "#d8d0c6" : "#5c4f42", color: "#f7f3ee" }}>{saving ? "Saving..." : "Save Entry"}</button>
                </Card>
              </div>
            )}
          </>
        )}

        {/* ═══ LOAN LEDGER (PIN protected) ═══ */}
        {account === "loan" && pinUser && (
          <>
            {tab === "overview" && (
              <div style={{ animation: "fadeIn .3s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <p style={{ fontSize: 12, color: "#b0a395", margin: 0 }}>Logged in as <Badge who={pinUser} /></p>
                  <button onClick={() => setPinUser(null)} style={{ background: "none", border: "none", fontSize: 12, color: "#c0b5a8", cursor: "pointer" }}>{"\u{1F512}"} Lock</button>
                </div>

                <Card s={{ textAlign: "center", padding: "28px 24px" }}>
                  <Lbl_>Total KT Owes GLC</Lbl_>
                  <p style={{ fontSize: 42, fontFamily: "'Fraunces',serif", fontWeight: 600, color: "#c07070", margin: "0 0 8px" }}>{fmt(loanUnpaid + pettyUnpaid)}</p>
                  <div style={{ display: "flex", justifyContent: "center", gap: 16, fontSize: 13, color: "#9a8e82" }}>
                    <span>Loans: <strong style={{ color: "#c07070" }}>{fmt(loanUnpaid)}</strong></span>
                    <span>Petty: <strong style={{ color: "#b89a7a" }}>{fmt(pettyUnpaid)}</strong></span>
                  </div>
                </Card>

                {/* Loan/Petty toggle */}
                <div style={{ display: "flex", gap: 4, background: "#f0ebe4", borderRadius: 10, padding: 3, marginBottom: 12 }}>
                  {[{ k: "loans", l: `Loans (${LOAN_DATA.length})` }, { k: "petty", l: `Petty Cash (${PETTY_DATA.length})` }].map(t => (
                    <button key={t.k} onClick={() => setLoanTab(t.k)} style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500, fontFamily: "inherit", background: loanTab === t.k ? "#fff" : "transparent", color: loanTab === t.k ? "#5c4f42" : "#b0a090", boxShadow: loanTab === t.k ? "0 1px 4px rgba(0,0,0,.06)" : "none" }}>{t.l}</button>
                  ))}
                </div>

                <Card>
                  <Lbl_>{loanTab === "loans" ? `Loans \u2014 ${fmt(loanUnpaid)} outstanding` : `Petty Cash \u2014 ${fmt(pettyUnpaid)} outstanding (${fmt(pettyPaid)} paid)`}</Lbl_>
                  {(loanTab === "loans" ? LOAN_DATA : PETTY_DATA).map((tx, i) => <LoanRow key={i} tx={tx} type={loanTab === "loans" ? "loan" : "petty"} />)}
                </Card>
              </div>
            )}

            {tab === "entries" && (
              <div style={{ animation: "fadeIn .3s" }}>
                <p style={{ fontSize: 13, color: "#b0a395", marginBottom: 12 }}>Showing all {LOAN_DATA.length + PETTY_DATA.length} entries. Edit in Google Sheets for now.</p>
                <Card><Lbl_>All Loans</Lbl_>{LOAN_DATA.map((tx, i) => <LoanRow key={i} tx={tx} type="loan" />)}</Card>
                <Card><Lbl_>All Petty Cash</Lbl_>{PETTY_DATA.map((tx, i) => <LoanRow key={i} tx={tx} type="petty" />)}</Card>
              </div>
            )}
          </>
        )}

        {/* ═══ GLC FRIENDS (PIN protected) ═══ */}
        {account === "friends" && pinUser && (
          <>
            {tab === "overview" && (
              <div style={{ animation: "fadeIn .3s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <p style={{ fontSize: 12, color: "#b0a395", margin: 0 }}>Logged in as <Badge who={pinUser} /></p>
                  <button onClick={() => setPinUser(null)} style={{ background: "none", border: "none", fontSize: 12, color: "#c0b5a8", cursor: "pointer" }}>{"\u{1F512}"} Lock</button>
                </div>

                <Card s={{ textAlign: "center", padding: "24px" }}>
                  <Lbl_>Total Owed to Gracelynn</Lbl_>
                  <p style={{ fontSize: 36, fontFamily: "'Fraunces',serif", fontWeight: 600, color: "#c48b9f", margin: "0 0 4px" }}>{fmt(friendBalances.reduce((s, [, d]) => s + d.unpaid, 0))}</p>
                  <p style={{ fontSize: 12, color: "#b0a395", margin: 0 }}>{friendBalances.filter(([, d]) => d.unpaid > 0).length} people &middot; excl. write-offs</p>
                </Card>

                <Card>
                  <Lbl_>By Person</Lbl_>
                  {friendBalances.map(([name, data]) => (
                    <div key={name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f5f0ea" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#c48b9f18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, color: "#c48b9f" }}>{name[0]}</div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 500, margin: 0 }}>{name}</p>
                          {data.writeOff > 0 && <p style={{ fontSize: 10, color: "#c0b5a8", margin: "2px 0 0" }}>Write-off: {fmt(data.writeOff)}</p>}
                          {data.paid > 0 && <p style={{ fontSize: 10, color: "#7a8c6e", margin: "2px 0 0" }}>Paid: {fmt(data.paid)}</p>}
                        </div>
                      </div>
                      <span style={{ fontSize: 16, fontFamily: "'Fraunces',serif", fontWeight: 600, color: data.unpaid > 0 ? "#c07070" : data.writeOff > 0 ? "#c9a84c" : "#7a8c6e" }}>
                        {data.unpaid > 0 ? fmt(data.unpaid) : data.writeOff > 0 ? "Write off?" : "\u2705"}
                      </span>
                    </div>
                  ))}
                </Card>
              </div>
            )}

            {tab === "entries" && (
              <div style={{ animation: "fadeIn .3s" }}>
                <Card>
                  <Lbl_>All Transactions ({FRIENDS_DATA.length})</Lbl_>
                  {FRIENDS_DATA.map((tx, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #f5f0ea", opacity: tx.paid ? 0.5 : 1 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#c48b9f18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#c48b9f" }}>{tx.owedBy[0]}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                          <p style={{ fontSize: 13, fontWeight: 500, margin: 0, textDecoration: tx.paid ? "line-through" : "none" }}>{tx.item}</p>
                          <p style={{ fontSize: 14, fontFamily: "'Fraunces',serif", fontWeight: 600, color: tx.paid ? "#7a8c6e" : "#c48b9f", margin: 0 }}>{fmt(tx.price)}</p>
                        </div>
                        <p style={{ fontSize: 11, color: "#b8ada0", margin: 0 }}>
                          {tx.owedBy} &middot; {tx.date || "No date"}{tx.notes ? ` \u2022 ${tx.notes}` : ""}{tx.paid ? " \u2022 \u2705 Paid" : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

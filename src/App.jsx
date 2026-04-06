import { useState, useMemo, useEffect, useCallback } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, CartesianGrid } from "recharts";

const API = "/.netlify/functions";
const fmt = n => "$" + Math.abs(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const fmtK = n => n >= 1000 ? "$" + (n / 1000).toFixed(1) + "k" : "$" + n.toFixed(0);
const pLabel = p => { const [y, m] = p.split("-"); const mn = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; return mn[+m] + " '" + y.slice(2); };
const today = () => new Date().toISOString().split("T")[0];
const tooltipStyle = { background: "#fbf8f4", border: "1px solid #e0d8ce", borderRadius: 10, fontSize: 12, fontFamily: "'Outfit',sans-serif" };

const HOUSE_TYPES = ["Grocery","Misc","Electricity","Cat","Household goods","Rent"];
const TYPE_META = { Grocery:{c:"#7a8c6e",i:"\u{1F6D2}"}, Misc:{c:"#b89a7a",i:"\u{1F4E6}"}, Electricity:{c:"#c9a84c",i:"\u26A1"}, "Household goods":{c:"#7a9aad",i:"\u{1F3E0}"}, Cat:{c:"#c48b9f",i:"\u{1F431}"}, Rent:{c:"#9b8ab5",i:"\u{1F3E1}"}, Uncategorized:{c:"#999",i:"\u2022"} };

const Card = ({ children, style = {} }) => <div style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1px solid #ede7df", boxShadow: "0 1px 3px rgba(0,0,0,.03)", marginBottom: 12, ...style }}>{children}</div>;
const Label = ({ children }) => <p style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#bbb0a2", margin: "0 0 12px", fontWeight: 500 }}>{children}</p>;
const Badge = ({ who }) => <span style={{ padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: who === "KT" ? "#e8ded3" : "#dce5dc", color: who === "KT" ? "#8b7355" : "#5c7a5c" }}>{who === "KT" ? "Kenneth" : "Gracelynn"}</span>;
const Btn = ({ children, active, onClick }) => <button onClick={onClick} style={{ padding: "8px 16px", borderRadius: 8, border: active ? "none" : "1px solid #e0d8ce", background: active ? "#5c4f42" : "#fff", color: active ? "#f7f3ee" : "#9a8e82", fontSize: 12, fontWeight: 500, fontFamily: "inherit", cursor: "pointer" }}>{children}</button>;
const Inp = ({ ...p }) => <input {...p} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e0d8ce", background: "#fbf8f4", color: "#5c4f42", fontSize: 14, fontFamily: "'Outfit',sans-serif", boxSizing: "border-box", ...(p.style || {}) }} />;
const Sel = ({ ...p }) => <select {...p} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e0d8ce", background: "#fbf8f4", color: "#5c4f42", fontSize: 14, fontFamily: "'Outfit',sans-serif", boxSizing: "border-box", ...(p.style || {}) }} />;
const Lbl = ({ children }) => <label style={{ display: "block", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "#b0a395", marginBottom: 5, fontWeight: 500 }}>{children}</label>;

export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [houseTx, setHouseTx] = useState([]);
  const [monthlyMeta, setMonthlyMeta] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [hPeriod, setHPeriod] = useState("all");
  const [hPaidBy, setHPaidBy] = useState("All");
  const [hType, setHType] = useState("All");
  const [hSearch, setHSearch] = useState("");
  const [hSort, setHSort] = useState("date");
  const [hSortDir, setHSortDir] = useState("desc");
  const [delConfirm, setDelConfirm] = useState(null);
  const [fDate, setFDate] = useState(today());
  const [fItem, setFItem] = useState("");
  const [fAmount, setFAmount] = useState("");
  const [fPaidBy, setFPaidBy] = useState("KT");
  const [fType, setFType] = useState("Grocery");
  const [fRemarks, setFRemarks] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const res = await fetch(API + "/read-transactions");
      if (!res.ok) throw new Error("API error: " + res.status);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setHouseTx(data.transactions || []);
      setMonthlyMeta(data.monthly_meta || []);
      setSettlements(data.settlements || []);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

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

  const getSettleStatus = p => { const s = settlements.find(x => x.period === p); if (!s) return { kt: "open", glc: "open" }; return { kt: s.kt_status || "open", glc: s.glc_status || "open" }; };
  const currentPeriod = hPeriods.length > 0 ? hPeriods[hPeriods.length - 1] : null;
  const currentSettle = currentPeriod ? getSettleStatus(currentPeriod) : { kt: "open", glc: "open" };

  const resetForm = () => { setFDate(today()); setFItem(""); setFAmount(""); setFPaidBy("KT"); setFType("Grocery"); setFRemarks(""); };

  const handleAdd = async () => {
    if (!fDate || !fItem || !fAmount) return;
    setSaving(true);
    try {
      const res = await fetch(API + "/add-transaction", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ date: fDate, item: fItem.trim(), price: parseFloat(fAmount), paidBy: fPaidBy, type: fType, remarks: fRemarks.trim(), period: fDate.slice(0, 7) }) });
      const data = await res.json();
      if (data.success) { resetForm(); await loadData(); setActiveTab("entries"); } else alert("Error: " + (data.error || "Unknown"));
    } catch (e) { alert("Failed: " + e.message); } finally { setSaving(false); }
  };

  const handleDelete = async tx => {
    if (delConfirm === tx.id) {
      setSaving(true);
      try {
        const res = await fetch(API + "/delete-transaction", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sheet: tx.sheet, row: tx.row }) });
        const data = await res.json();
        if (data.success) await loadData(); else alert("Error: " + (data.error || "Unknown"));
      } catch (e) { alert("Failed: " + e.message); } finally { setSaving(false); setDelConfirm(null); }
    } else setDelConfirm(tx.id);
  };

  const handleSettle = async (person, action) => {
    if (!currentPeriod) return; setSaving(true);
    try {
      const res = await fetch(API + "/settle-up", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ period: currentPeriod, person, action }) });
      const data = await res.json();
      if (data.success) await loadData(); else alert("Error: " + (data.error || "Unknown"));
    } catch (e) { alert("Failed: " + e.message); } finally { setSaving(false); }
  };

  const toggleHSort = f => { if (hSort === f) setHSortDir(d => d === "asc" ? "desc" : "asc"); else { setHSort(f); setHSortDir("desc"); } };
  const formatDate = d => { try { return new Date(d + "T00:00:00").toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "2-digit" }); } catch { return d; } };

  return (
    <div style={{ fontFamily: "'Outfit',sans-serif", background: "#f7f3ee", color: "#4a4440", minHeight: "100vh", paddingBottom: 80 }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Fraunces:opsz,wght@9..144,400;9..144,600&display=swap" rel="stylesheet" />
      <style>{`*,*::before,*::after{box-sizing:border-box}::selection{background:#c8b8a4;color:#fff}input:focus,select:focus{outline:none;border-color:#b8a898!important}@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}.recharts-cartesian-axis-tick-value{fill:#b0a395!important;font-size:10px!important}@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Header */}
      <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid #e8e0d6", background: "#fbf8f4" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <p style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#b0a395", margin: "0 0 4px", fontWeight: 500 }}>Hillcrest Arcadia</p>
          <h1 style={{ fontSize: 22, fontFamily: "'Fraunces',serif", fontWeight: 600, color: "#3d3530", margin: "0 0 14px" }}>Our Home Ledger</h1>
          <div style={{ display: "flex", gap: 4, background: "#f0ebe4", borderRadius: 10, padding: 3 }}>
            {["overview", "entries", "add", "settle"].map(t => (
              <button key={t} onClick={() => { setActiveTab(t); if (t === "add") resetForm(); }} style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500, fontFamily: "inherit", textTransform: "capitalize", background: activeTab === t ? "#fff" : "transparent", color: activeTab === t ? "#5c4f42" : "#b0a090", boxShadow: activeTab === t ? "0 1px 4px rgba(0,0,0,.06)" : "none" }}>
                {t === "add" ? "+ Add" : t === "settle" ? "\u2705 Settle" : t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px 16px" }}>
        {loading && <Card style={{ textAlign: "center", padding: 40 }}><div style={{ width: 32, height: 32, border: "3px solid #ede7df", borderTopColor: "#5c4f42", borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto 12px" }} /><p style={{ color: "#9a8e82", fontSize: 14, margin: 0 }}>Loading from Google Sheets...</p></Card>}

        {error && <Card style={{ borderColor: "#e8c4c4", background: "#fdf5f5" }}><p style={{ color: "#c07070", fontSize: 14, margin: "0 0 8px", fontWeight: 600 }}>Connection error</p><p style={{ color: "#b08080", fontSize: 13, margin: "0 0 12px" }}>{error}</p><Btn active onClick={loadData}>Retry</Btn></Card>}

        {/* OVERVIEW */}
        {!loading && !error && activeTab === "overview" && (
          <div style={{ animation: "fadeIn .3s" }}>
            {currentPeriod && (currentSettle.kt === "open" || currentSettle.glc === "open") && (
              <Card style={{ background: "#fef9ed", borderColor: "#ede1c4", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 20 }}>{"\u{1F4CB}"}</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#8b7355", margin: "0 0 2px" }}>{pLabel(currentPeriod)} — not settled</p>
                  <p style={{ fontSize: 12, color: "#b0a090", margin: 0 }}>
                    {currentSettle.kt === "open" && currentSettle.glc === "open" && "Neither has submitted entries yet"}
                    {currentSettle.kt === "done" && currentSettle.glc === "open" && "KT done. Waiting for GLC."}
                    {currentSettle.kt === "open" && currentSettle.glc === "done" && "GLC done. Waiting for KT."}
                  </p>
                </div>
              </Card>
            )}

            {latestMeta && <Card style={{ textAlign: "center", padding: "28px 24px" }}>
              <Label>Latest · {pLabel(latestMeta.period)}</Label>
              <p style={{ fontSize: 40, fontFamily: "'Fraunces',serif", fontWeight: 600, margin: "0 0 6px", color: (latestMeta.balance_owed || 0) >= 0 ? "#b07a5b" : "#7a8c6e" }}>{fmt(latestMeta.balance_owed || 0)}</p>
              <p style={{ fontSize: 13, color: "#9a8e82", margin: 0 }}>{(latestMeta.balance_owed || 0) >= 0 ? <><Badge who="KT" /> owes <Badge who="GLC" /></> : <><Badge who="GLC" /> owes <Badge who="KT" /></>}</p>
            </Card>}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
              {[{ l: "Total", v: fmt(hStats.total), c: "#5c4f42" }, { l: "Gracelynn", v: fmt(hStats.glc), c: "#7a8c6e" }, { l: "Kenneth", v: fmt(hStats.kt), c: "#b07a5b" }].map((c, i) => (
                <Card key={i} style={{ textAlign: "center", padding: "16px 10px" }}>
                  <p style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#bbb0a2", margin: "0 0 6px", fontWeight: 500 }}>{c.l}</p>
                  <p style={{ fontSize: 18, fontFamily: "'Fraunces',serif", fontWeight: 600, color: c.c, margin: 0 }}>{c.v}</p>
                </Card>
              ))}
            </div>

            <Card><Label>Monthly Spending</Label>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={monthlyTrend} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
                  <defs><linearGradient id="gG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a3b896" stopOpacity={.4} /><stop offset="95%" stopColor="#a3b896" stopOpacity={0} /></linearGradient><linearGradient id="gK" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#d4bfa8" stopOpacity={.4} /><stop offset="95%" stopColor="#d4bfa8" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ede7df" /><XAxis dataKey="period" tick={{ fontSize: 9 }} interval={3} /><YAxis tick={{ fontSize: 9 }} tickFormatter={fmtK} /><Tooltip contentStyle={tooltipStyle} formatter={v => "$" + v.toFixed(0)} />
                  <Area type="monotone" dataKey="glc" name="Gracelynn" stroke="#7a8c6e" fill="url(#gG)" strokeWidth={2} /><Area type="monotone" dataKey="kt" name="Kenneth" stroke="#b89a7a" fill="url(#gK)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {balanceHistory.length > 0 && <Card><Label>Who Owes Who</Label>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={balanceHistory} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ede7df" /><XAxis dataKey="period" tick={{ fontSize: 9 }} interval={3} /><YAxis tick={{ fontSize: 9 }} tickFormatter={v => "$" + v.toFixed(0)} /><Tooltip contentStyle={tooltipStyle} formatter={v => [v > 0 ? "KT owes $" + v.toFixed(2) : "GLC owes $" + Math.abs(v).toFixed(2)]} />
                  <Bar dataKey="owed" radius={[3, 3, 0, 0]}>{balanceHistory.map((e, i) => <Cell key={i} fill={e.owed >= 0 ? "#d4bfa8" : "#a3b896"} opacity={.7} />)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>}

            <Card><Label>By Category</Label>
              {Object.entries(hStats.byType).sort((a, b) => b[1] - a[1]).map(([type, amt]) => {
                const m = TYPE_META[type] || TYPE_META.Uncategorized; const mx = Math.max(...Object.values(hStats.byType), 1);
                return <div key={type} style={{ marginBottom: 12 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}><span>{m.i}</span>{type}</span><span style={{ fontSize: 13, fontWeight: 500, color: m.c }}>{fmt(amt)}</span></div><div style={{ height: 4, background: "#f0ebe4", borderRadius: 3, overflow: "hidden" }}><div style={{ width: `${(amt / mx) * 100}%`, height: "100%", background: m.c, opacity: .6, borderRadius: 3 }} /></div></div>;
              })}
            </Card>
            <p style={{ textAlign: "center", fontSize: 11, color: "#c0b5a8", marginTop: 8 }}>{houseTx.length} transactions · Live from Google Sheets</p>
          </div>
        )}

        {/* ENTRIES */}
        {!loading && !error && activeTab === "entries" && (
          <div style={{ animation: "fadeIn .3s" }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
              <Sel value={hPeriod} onChange={e => setHPeriod(e.target.value)} style={{ width: "auto" }}><option value="all">All months</option>{hPeriods.map(p => <option key={p} value={p}>{pLabel(p)}</option>)}</Sel>
              {["All", "KT", "GLC"].map(p => <Btn key={p} active={hPaidBy === p} onClick={() => setHPaidBy(p)}>{p}</Btn>)}
              <Sel value={hType} onChange={e => setHType(e.target.value)} style={{ width: "auto" }}><option value="All">All</option>{HOUSE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</Sel>
            </div>
            <Inp value={hSearch} onChange={e => setHSearch(e.target.value)} placeholder="Search..." style={{ marginBottom: 12 }} />
            <Card style={{ padding: "14px 20px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <span style={{ fontSize: 13, color: "#9a8e82" }}><strong style={{ color: "#5c4f42" }}>{hFiltered.length}</strong> entries</span>
              <span style={{ fontSize: 13 }}>Total: <strong style={{ color: "#5c4f42", fontFamily: "'Fraunces',serif" }}>{fmt(hFiltered.reduce((s, t) => s + t.price, 0))}</strong></span>
            </Card>
            <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              {[{ f: "date", l: "Date" }, { f: "item", l: "Name" }, { f: "price", l: "Amt" }].map(s => (
                <button key={s.f} onClick={() => toggleHSort(s.f)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600, color: hSort === s.f ? "#5c4f42" : "#c0b5a8", fontFamily: "inherit" }}>{s.l}{hSort === s.f ? (hSortDir === "asc" ? " ↑" : " ↓") : ""}</button>
              ))}
            </div>
            {hFiltered.map(tx => {
              const m = TYPE_META[tx.type] || TYPE_META.Uncategorized;
              return <div key={tx.id + "-" + tx.row} style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", marginBottom: 6, border: "1px solid #ede7df", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: m.c + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{m.i}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 8 }}>{tx.item}</p>
                    <p style={{ fontSize: 14, fontWeight: 600, fontFamily: "'Fraunces',serif", color: tx.paidBy === "KT" ? "#b07a5b" : "#7a8c6e", margin: 0, flexShrink: 0 }}>{fmt(tx.price)}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", fontSize: 11, color: "#b8ada0" }}>
                    <span>{formatDate(tx.date)}</span><span style={{ color: "#ddd" }}>·</span><Badge who={tx.paidBy} /><span style={{ color: "#ddd" }}>·</span><span style={{ color: m.c }}>{tx.type}</span>
                    {tx.remarks && <><span style={{ color: "#ddd" }}>·</span><span style={{ fontStyle: "italic", color: "#c0b5a8" }}>{tx.remarks}</span></>}
                  </div>
                </div>
                <button onClick={() => handleDelete(tx)} disabled={saving} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, padding: 6, color: delConfirm === tx.id ? "#c07070" : "#ccc" }}>{delConfirm === tx.id ? "Sure?" : "🗑"}</button>
              </div>;
            })}
            {hFiltered.length === 0 && <p style={{ textAlign: "center", color: "#c0b5a8", padding: 40 }}>No entries found.</p>}
          </div>
        )}

        {/* ADD */}
        {!loading && !error && activeTab === "add" && (
          <div style={{ animation: "fadeIn .3s" }}>
            <Card style={{ padding: 24 }}>
              <p style={{ fontSize: 16, fontFamily: "'Fraunces',serif", fontWeight: 600, color: "#5c4f42", margin: "0 0 20px" }}>New Entry</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div><Lbl>Date</Lbl><Inp type="date" value={fDate} onChange={e => setFDate(e.target.value)} /></div>
                <div><Lbl>Amount ($)</Lbl><Inp type="number" step="0.01" value={fAmount} onChange={e => setFAmount(e.target.value)} placeholder="0.00" /></div>
              </div>
              <div style={{ marginBottom: 12 }}><Lbl>Item</Lbl><Inp value={fItem} onChange={e => setFItem(e.target.value)} placeholder="e.g. PandaMart / Foodpanda" /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div><Lbl>Paid by</Lbl><div style={{ display: "flex", gap: 6 }}>{["KT", "GLC"].map(p => <button key={p} onClick={() => setFPaidBy(p)} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: fPaidBy === p ? "none" : "1px solid #e0d8ce", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "inherit", background: fPaidBy === p ? (p === "KT" ? "#d4bfa8" : "#a3b896") : "#fff", color: fPaidBy === p ? "#fff" : "#b0a090" }}>{p === "KT" ? "Kenneth" : "Gracelynn"}</button>)}</div></div>
                <div><Lbl>Category</Lbl><Sel value={fType} onChange={e => setFType(e.target.value)}>{HOUSE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</Sel></div>
              </div>
              <div style={{ marginBottom: 16 }}><Lbl>Remarks <span style={{ fontWeight: 300, color: "#c8bfb4" }}>(optional)</span></Lbl><Inp value={fRemarks} onChange={e => setFRemarks(e.target.value)} placeholder="Any notes?" /></div>
              <button onClick={handleAdd} disabled={saving || !fDate || !fItem || !fAmount} style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", fontSize: 15, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", background: saving || !fDate || !fItem || !fAmount ? "#d8d0c6" : "#5c4f42", color: "#f7f3ee" }}>{saving ? "Saving to Google Sheets..." : "Save Entry"}</button>
            </Card>
          </div>
        )}

        {/* SETTLE */}
        {!loading && !error && activeTab === "settle" && (
          <div style={{ animation: "fadeIn .3s" }}>
            <Card>
              <Label>Monthly Accounting Status</Label>
              <p style={{ fontSize: 13, color: "#9a8e82", margin: "0 0 20px" }}>Mark your entries as done when you've added everything for the month.</p>
              {hPeriods.slice().reverse().map(period => {
                const ss = getSettleStatus(period);
                const meta = monthlyMeta.find(m => m.period === period);
                const isSettled = ss.kt === "settled" && ss.glc === "settled";
                const bothDone = ss.kt === "done" && ss.glc === "done";
                return <div key={period} style={{ padding: "16px 0", borderBottom: "1px solid #f5f0ea" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 600, fontFamily: "'Fraunces',serif", color: "#5c4f42", margin: "0 0 2px" }}>{pLabel(period)}</p>
                      {meta && meta.balance_owed != null && <p style={{ fontSize: 12, color: "#9a8e82", margin: 0 }}>Balance: <span style={{ color: meta.balance_owed >= 0 ? "#b07a5b" : "#7a8c6e", fontWeight: 600 }}>{fmt(meta.balance_owed)}</span>{meta.balance_owed >= 0 ? " (KT owes GLC)" : " (GLC owes KT)"}</p>}
                    </div>
                    {isSettled && <span style={{ fontSize: 12, padding: "4px 12px", borderRadius: 20, background: "#e8f5e8", color: "#5c7a5c", fontWeight: 600 }}>✅ Settled</span>}
                  </div>
                  {!isSettled && <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 140, background: ss.kt === "done" ? "#f0f7f0" : "#fef9ed", borderRadius: 10, padding: "10px 14px" }}>
                      <p style={{ fontSize: 11, color: "#9a8e82", margin: "0 0 6px", fontWeight: 500 }}>Kenneth</p>
                      {ss.kt === "open" && <button onClick={() => handleSettle("KT", "done")} disabled={saving} style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: "#d4bfa8", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Mark as done</button>}
                      {ss.kt === "done" && <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 12, color: "#5c7a5c", fontWeight: 500 }}>✅ Done</span><button onClick={() => handleSettle("KT", "reopen")} disabled={saving} style={{ background: "none", border: "none", fontSize: 11, color: "#c0b5a8", cursor: "pointer", textDecoration: "underline" }}>undo</button></div>}
                    </div>
                    <div style={{ flex: 1, minWidth: 140, background: ss.glc === "done" ? "#f0f7f0" : "#fef9ed", borderRadius: 10, padding: "10px 14px" }}>
                      <p style={{ fontSize: 11, color: "#9a8e82", margin: "0 0 6px", fontWeight: 500 }}>Gracelynn</p>
                      {ss.glc === "open" && <button onClick={() => handleSettle("GLC", "done")} disabled={saving} style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: "#a3b896", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Mark as done</button>}
                      {ss.glc === "done" && <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 12, color: "#5c7a5c", fontWeight: 500 }}>✅ Done</span><button onClick={() => handleSettle("GLC", "reopen")} disabled={saving} style={{ background: "none", border: "none", fontSize: 11, color: "#c0b5a8", cursor: "pointer", textDecoration: "underline" }}>undo</button></div>}
                    </div>
                    {bothDone && <button onClick={() => handleSettle("KT", "settle")} disabled={saving} style={{ width: "100%", padding: 10, borderRadius: 10, border: "none", background: "#5c4f42", color: "#f7f3ee", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginTop: 4 }}>✅ Settle this month</button>}
                  </div>}
                </div>;
              })}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

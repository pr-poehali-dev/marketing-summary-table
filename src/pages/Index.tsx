import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const MONTHS = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];

type InputCellProps = {
  value: string;
  onChange: (v: string) => void;
  align?: "left" | "right" | "center";
  placeholder?: string;
  mono?: boolean;
};

function InputCell({ value, onChange, align = "right", placeholder = "", mono = true }: InputCellProps) {
  return (
    <input
      className={`w-full bg-transparent border-0 outline-none text-sm px-2 py-1 focus:bg-accent rounded transition-colors ${mono ? "font-mono" : "font-sans"} text-${align}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

function ColHead({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 py-2 border-b border-border whitespace-nowrap text-left ${className}`}>
      {children}
    </th>
  );
}

function TD({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return (
    <td className={`border-b border-border px-1 py-0.5 ${className}`}>
      {children}
    </td>
  );
}

// ─── KPI ───────────────────────────────────────────────────────────────────
type KPIRow = { metric: string; unit: string; plan: string; fact: string; note: string };
const initKPI = (): KPIRow[] => [
  { metric: "Охват аудитории", unit: "чел.", plan: "", fact: "", note: "" },
  { metric: "Показы рекламы", unit: "шт.", plan: "", fact: "", note: "" },
  { metric: "Клики", unit: "шт.", plan: "", fact: "", note: "" },
  { metric: "CTR", unit: "%", plan: "", fact: "", note: "" },
  { metric: "Лиды", unit: "шт.", plan: "", fact: "", note: "" },
  { metric: "Конверсия лидов", unit: "%", plan: "", fact: "", note: "" },
  { metric: "Стоимость лида (CPL)", unit: "₽", plan: "", fact: "", note: "" },
  { metric: "Стоимость клика (CPC)", unit: "₽", plan: "", fact: "", note: "" },
  { metric: "Выручка с канала", unit: "₽", plan: "", fact: "", note: "" },
  { metric: "ROAS", unit: "x", plan: "", fact: "", note: "" },
  { metric: "ROI", unit: "%", plan: "", fact: "", note: "" },
];

function TabKPI() {
  const [rows, setRows] = useState<KPIRow[]>(initKPI());
  const [period, setPeriod] = useState("Q1 2025");

  const update = (i: number, key: keyof KPIRow, val: string) => {
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [key]: val } : row)));
  };

  const addRow = () => setRows((r) => [...r, { metric: "", unit: "", plan: "", fact: "", note: "" }]);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold">KPI и аналитические показатели</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Плановые и фактические значения ключевых метрик</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Период:</span>
          <input
            className="border border-border rounded px-2 py-1 text-sm font-mono w-28 focus:outline-none focus:ring-1 focus:ring-primary"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-muted/60">
            <tr>
              <ColHead className="w-8">#</ColHead>
              <ColHead className="min-w-52">Метрика</ColHead>
              <ColHead className="w-20">Ед. изм.</ColHead>
              <ColHead className="w-32">План</ColHead>
              <ColHead className="w-32">Факт</ColHead>
              <ColHead className="w-24">Выполнение</ColHead>
              <ColHead className="min-w-48">Примечание</ColHead>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const pv = parseFloat(row.plan.replace(/\s/g, "").replace(",", "."));
              const fv = parseFloat(row.fact.replace(/\s/g, "").replace(",", "."));
              const pct = !isNaN(pv) && !isNaN(fv) && pv !== 0 ? Math.round((fv / pv) * 100) : null;
              const color = pct === null ? "" : pct >= 100 ? "text-green-600" : pct >= 70 ? "text-yellow-600" : "text-red-500";
              return (
                <tr key={i} className="hover:bg-muted/30 group">
                  <TD><span className="text-xs text-muted-foreground px-2">{i + 1}</span></TD>
                  <TD><InputCell value={row.metric} onChange={(v) => update(i, "metric", v)} align="left" mono={false} placeholder="Название метрики" /></TD>
                  <TD><InputCell value={row.unit} onChange={(v) => update(i, "unit", v)} align="center" placeholder="шт." /></TD>
                  <TD><InputCell value={row.plan} onChange={(v) => update(i, "plan", v)} placeholder="0" /></TD>
                  <TD><InputCell value={row.fact} onChange={(v) => update(i, "fact", v)} placeholder="0" /></TD>
                  <TD>
                    <span className={`font-mono text-sm px-2 font-medium ${color}`}>
                      {pct !== null ? `${pct}%` : "—"}
                    </span>
                  </TD>
                  <TD><InputCell value={row.note} onChange={(v) => update(i, "note", v)} align="left" mono={false} placeholder="Комментарий…" /></TD>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button onClick={addRow} className="mt-3 flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors">
        <Icon name="Plus" size={14} /> Добавить метрику
      </button>
    </div>
  );
}

// ─── BUDGET ────────────────────────────────────────────────────────────────
type BudgetRow = { channel: string; category: string; plan: string; fact: string; note: string };
const initBudget = (): BudgetRow[] => [
  { channel: "Контекстная реклама", category: "Digital", plan: "", fact: "", note: "" },
  { channel: "Таргетированная реклама", category: "Digital", plan: "", fact: "", note: "" },
  { channel: "SEO / контент", category: "Digital", plan: "", fact: "", note: "" },
  { channel: "Email-маркетинг", category: "Digital", plan: "", fact: "", note: "" },
  { channel: "SMM", category: "Digital", plan: "", fact: "", note: "" },
  { channel: "Наружная реклама", category: "Офлайн", plan: "", fact: "", note: "" },
  { channel: "Мероприятия / PR", category: "Офлайн", plan: "", fact: "", note: "" },
  { channel: "Агентское вознаграждение", category: "Услуги", plan: "", fact: "", note: "" },
];

function TabBudget() {
  const [rows, setRows] = useState<BudgetRow[]>(initBudget());
  const update = (i: number, key: keyof BudgetRow, val: string) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [key]: val } : row)));
  const addRow = () => setRows((r) => [...r, { channel: "", category: "", plan: "", fact: "", note: "" }]);

  const totalPlan = rows.reduce((s, r) => s + (parseFloat(r.plan.replace(/\s/g, "").replace(",", ".")) || 0), 0);
  const totalFact = rows.reduce((s, r) => s + (parseFloat(r.fact.replace(/\s/g, "").replace(",", ".")) || 0), 0);
  const fmt = (n: number) => n > 0 ? n.toLocaleString("ru-RU") + " ₽" : "—";

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold">Бюджет и расходы</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Плановые и фактические расходы по каналам</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Бюджет план</div>
            <div className="font-mono font-semibold text-sm text-primary">{fmt(totalPlan)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Факт расход</div>
            <div className={`font-mono font-semibold text-sm ${totalFact > totalPlan && totalPlan > 0 ? "text-red-500" : "text-green-600"}`}>{fmt(totalFact)}</div>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-muted/60">
            <tr>
              <ColHead className="w-8">#</ColHead>
              <ColHead className="min-w-52">Канал / статья</ColHead>
              <ColHead className="w-36">Категория</ColHead>
              <ColHead className="w-36">Бюджет план, ₽</ColHead>
              <ColHead className="w-36">Факт расход, ₽</ColHead>
              <ColHead className="w-24">Остаток</ColHead>
              <ColHead className="min-w-40">Примечание</ColHead>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const p = parseFloat(row.plan.replace(/\s/g, "").replace(",", ".")) || 0;
              const f = parseFloat(row.fact.replace(/\s/g, "").replace(",", ".")) || 0;
              const rem = p - f;
              return (
                <tr key={i} className="hover:bg-muted/30">
                  <TD><span className="text-xs text-muted-foreground px-2">{i + 1}</span></TD>
                  <TD><InputCell value={row.channel} onChange={(v) => update(i, "channel", v)} align="left" mono={false} placeholder="Название канала" /></TD>
                  <TD><InputCell value={row.category} onChange={(v) => update(i, "category", v)} align="left" mono={false} placeholder="Категория" /></TD>
                  <TD><InputCell value={row.plan} onChange={(v) => update(i, "plan", v)} placeholder="0" /></TD>
                  <TD><InputCell value={row.fact} onChange={(v) => update(i, "fact", v)} placeholder="0" /></TD>
                  <TD>
                    <span className={`font-mono text-sm px-2 font-medium ${p === 0 ? "text-muted-foreground" : rem >= 0 ? "text-green-600" : "text-red-500"}`}>
                      {p > 0 ? rem.toLocaleString("ru-RU") + " ₽" : "—"}
                    </span>
                  </TD>
                  <TD><InputCell value={row.note} onChange={(v) => update(i, "note", v)} align="left" mono={false} placeholder="Примечание…" /></TD>
                </tr>
              );
            })}
            <tr className="bg-muted/40 font-semibold">
              <TD></TD>
              <TD><span className="text-xs font-semibold text-muted-foreground px-2">ИТОГО</span></TD>
              <TD></TD>
              <TD><span className="font-mono text-sm px-2 text-primary">{fmt(totalPlan)}</span></TD>
              <TD><span className={`font-mono text-sm px-2 ${totalFact > totalPlan && totalPlan > 0 ? "text-red-500" : "text-foreground"}`}>{fmt(totalFact)}</span></TD>
              <TD><span className={`font-mono text-sm px-2 font-medium ${totalPlan > 0 && (totalPlan - totalFact) < 0 ? "text-red-500" : "text-green-600"}`}>{totalPlan > 0 ? (totalPlan - totalFact).toLocaleString("ru-RU") + " ₽" : "—"}</span></TD>
              <TD></TD>
            </tr>
          </tbody>
        </table>
      </div>
      <button onClick={addRow} className="mt-3 flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors">
        <Icon name="Plus" size={14} /> Добавить статью
      </button>
    </div>
  );
}

// ─── CAMPAIGNS ─────────────────────────────────────────────────────────────
type CampaignRow = {
  name: string; channel: string; start: string; end: string;
  goal: string; budget: string; status: string; kpi: string; note: string;
};
const STATUSES = ["Не начато", "В работе", "Выполнено", "Провалено", "Пауза"];
const initCampaigns = (): CampaignRow[] => [
  { name: "", channel: "", start: "", end: "", goal: "", budget: "", status: "Не начато", kpi: "", note: "" },
  { name: "", channel: "", start: "", end: "", goal: "", budget: "", status: "Не начато", kpi: "", note: "" },
  { name: "", channel: "", start: "", end: "", goal: "", budget: "", status: "Не начато", kpi: "", note: "" },
];

function TabCampaigns() {
  const [rows, setRows] = useState<CampaignRow[]>(initCampaigns());
  const update = (i: number, key: keyof CampaignRow, val: string) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [key]: val } : row)));
  const addRow = () => setRows((r) => [...r, { name: "", channel: "", start: "", end: "", goal: "", budget: "", status: "Не начато", kpi: "", note: "" }]);

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h2 className="text-base font-semibold">Кампании и планы</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Постановка целей и планирование маркетинговых кампаний</p>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-muted/60">
            <tr>
              <ColHead className="w-8">#</ColHead>
              <ColHead className="min-w-48">Название кампании</ColHead>
              <ColHead className="w-36">Канал</ColHead>
              <ColHead className="w-28">Дата старта</ColHead>
              <ColHead className="w-28">Дата финиша</ColHead>
              <ColHead className="min-w-48">Цель кампании</ColHead>
              <ColHead className="w-32">Бюджет, ₽</ColHead>
              <ColHead className="w-28">Статус</ColHead>
              <ColHead className="min-w-40">KPI / Метрики</ColHead>
              <ColHead className="min-w-40">Примечание</ColHead>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-muted/30">
                <TD><span className="text-xs text-muted-foreground px-2">{i + 1}</span></TD>
                <TD><InputCell value={row.name} onChange={(v) => update(i, "name", v)} align="left" mono={false} placeholder="Название…" /></TD>
                <TD><InputCell value={row.channel} onChange={(v) => update(i, "channel", v)} align="left" mono={false} placeholder="Канал…" /></TD>
                <TD><InputCell value={row.start} onChange={(v) => update(i, "start", v)} placeholder="дд.мм.гг" /></TD>
                <TD><InputCell value={row.end} onChange={(v) => update(i, "end", v)} placeholder="дд.мм.гг" /></TD>
                <TD><InputCell value={row.goal} onChange={(v) => update(i, "goal", v)} align="left" mono={false} placeholder="Цель…" /></TD>
                <TD><InputCell value={row.budget} onChange={(v) => update(i, "budget", v)} placeholder="0" /></TD>
                <TD>
                  <select
                    className="w-full bg-transparent border-0 outline-none text-xs px-2 py-1 focus:bg-accent rounded cursor-pointer"
                    value={row.status}
                    onChange={(e) => update(i, "status", e.target.value)}
                  >
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </TD>
                <TD><InputCell value={row.kpi} onChange={(v) => update(i, "kpi", v)} align="left" mono={false} placeholder="Лиды, охват…" /></TD>
                <TD><InputCell value={row.note} onChange={(v) => update(i, "note", v)} align="left" mono={false} placeholder="Примечание…" /></TD>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={addRow} className="mt-3 flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors">
        <Icon name="Plus" size={14} /> Добавить кампанию
      </button>
    </div>
  );
}

// ─── CHANNELS ──────────────────────────────────────────────────────────────
type ChannelRow = {
  channel: string; impressions: string; clicks: string; ctr: string;
  leads: string; conv: string; spend: string; revenue: string; roas: string;
};
const initChannels = (): ChannelRow[] => [
  { channel: "Яндекс.Директ", impressions: "", clicks: "", ctr: "", leads: "", conv: "", spend: "", revenue: "", roas: "" },
  { channel: "ВКонтакте Ads", impressions: "", clicks: "", ctr: "", leads: "", conv: "", spend: "", revenue: "", roas: "" },
  { channel: "Telegram Ads", impressions: "", clicks: "", ctr: "", leads: "", conv: "", spend: "", revenue: "", roas: "" },
  { channel: "SEO (органика)", impressions: "", clicks: "", ctr: "", leads: "", conv: "", spend: "", revenue: "", roas: "" },
  { channel: "Email", impressions: "", clicks: "", ctr: "", leads: "", conv: "", spend: "", revenue: "", roas: "" },
  { channel: "SMM", impressions: "", clicks: "", ctr: "", leads: "", conv: "", spend: "", revenue: "", roas: "" },
];

function calcChannel(row: ChannelRow) {
  const imp = parseFloat(row.impressions.replace(/\s/g, "")) || 0;
  const clk = parseFloat(row.clicks.replace(/\s/g, "")) || 0;
  const ctr = imp > 0 ? ((clk / imp) * 100).toFixed(2) + "%" : row.ctr;
  const spend = parseFloat(row.spend.replace(/\s/g, "")) || 0;
  const revenue = parseFloat(row.revenue.replace(/\s/g, "")) || 0;
  const roas = spend > 0 ? (revenue / spend).toFixed(2) + "x" : row.roas;
  return { ctr, roas };
}

function TabChannels() {
  const [rows, setRows] = useState<ChannelRow[]>(initChannels());
  const update = (i: number, key: keyof ChannelRow, val: string) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [key]: val } : row)));
  const addRow = () => setRows((r) => [...r, { channel: "", impressions: "", clicks: "", ctr: "", leads: "", conv: "", spend: "", revenue: "", roas: "" }]);

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h2 className="text-base font-semibold">Анализ по каналам</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Сравнение эффективности маркетинговых каналов. CTR и ROAS считаются автоматически.</p>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-muted/60">
            <tr>
              <ColHead className="w-8">#</ColHead>
              <ColHead className="min-w-44">Канал</ColHead>
              <ColHead className="w-28">Показы</ColHead>
              <ColHead className="w-28">Клики</ColHead>
              <ColHead className="w-20">CTR</ColHead>
              <ColHead className="w-24">Лиды</ColHead>
              <ColHead className="w-24">Конверсия</ColHead>
              <ColHead className="w-32">Расход, ₽</ColHead>
              <ColHead className="w-32">Выручка, ₽</ColHead>
              <ColHead className="w-20">ROAS</ColHead>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const { ctr, roas } = calcChannel(row);
              return (
                <tr key={i} className="hover:bg-muted/30">
                  <TD><span className="text-xs text-muted-foreground px-2">{i + 1}</span></TD>
                  <TD><InputCell value={row.channel} onChange={(v) => update(i, "channel", v)} align="left" mono={false} placeholder="Канал…" /></TD>
                  <TD><InputCell value={row.impressions} onChange={(v) => update(i, "impressions", v)} placeholder="0" /></TD>
                  <TD><InputCell value={row.clicks} onChange={(v) => update(i, "clicks", v)} placeholder="0" /></TD>
                  <TD><span className="font-mono text-xs px-2 text-muted-foreground">{ctr || "—"}</span></TD>
                  <TD><InputCell value={row.leads} onChange={(v) => update(i, "leads", v)} placeholder="0" /></TD>
                  <TD><InputCell value={row.conv} onChange={(v) => update(i, "conv", v)} placeholder="%" /></TD>
                  <TD><InputCell value={row.spend} onChange={(v) => update(i, "spend", v)} placeholder="0" /></TD>
                  <TD><InputCell value={row.revenue} onChange={(v) => update(i, "revenue", v)} placeholder="0" /></TD>
                  <TD><span className="font-mono text-xs px-2 text-muted-foreground">{roas || "—"}</span></TD>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button onClick={addRow} className="mt-3 flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors">
        <Icon name="Plus" size={14} /> Добавить канал
      </button>
    </div>
  );
}

// ─── REPORT ────────────────────────────────────────────────────────────────
type ReportRow = { campaign: string; result: string; status: string; kpiReach: string; roi: string; conclusion: string };
const initReport = (): ReportRow[] => [
  { campaign: "", result: "", status: "Выполнено", kpiReach: "", roi: "", conclusion: "" },
  { campaign: "", result: "", status: "В работе", kpiReach: "", roi: "", conclusion: "" },
];

function TabReport() {
  const [rows, setRows] = useState<ReportRow[]>(initReport());
  const [summary, setSummary] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const update = (i: number, key: keyof ReportRow, val: string) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [key]: val } : row)));
  const addRow = () => setRows((r) => [...r, { campaign: "", result: "", status: "Выполнено", kpiReach: "", roi: "", conclusion: "" }]);

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h2 className="text-base font-semibold">Финальный отчёт</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Итоги кампаний, выводы и следующие шаги</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card mb-4">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-muted/60">
            <tr>
              <ColHead className="w-8">#</ColHead>
              <ColHead className="min-w-44">Кампания</ColHead>
              <ColHead className="min-w-48">Результат</ColHead>
              <ColHead className="w-28">Статус</ColHead>
              <ColHead className="w-28">Вып. KPI</ColHead>
              <ColHead className="w-24">ROI</ColHead>
              <ColHead className="min-w-56">Вывод / рекомендация</ColHead>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-muted/30">
                <TD><span className="text-xs text-muted-foreground px-2">{i + 1}</span></TD>
                <TD><InputCell value={row.campaign} onChange={(v) => update(i, "campaign", v)} align="left" mono={false} placeholder="Название…" /></TD>
                <TD><InputCell value={row.result} onChange={(v) => update(i, "result", v)} align="left" mono={false} placeholder="Описание результата…" /></TD>
                <TD>
                  <select
                    className="w-full bg-transparent border-0 outline-none text-xs px-2 py-1 focus:bg-accent rounded cursor-pointer"
                    value={row.status}
                    onChange={(e) => update(i, "status", e.target.value)}
                  >
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </TD>
                <TD><InputCell value={row.kpiReach} onChange={(v) => update(i, "kpiReach", v)} placeholder="%" /></TD>
                <TD><InputCell value={row.roi} onChange={(v) => update(i, "roi", v)} placeholder="%" /></TD>
                <TD><InputCell value={row.conclusion} onChange={(v) => update(i, "conclusion", v)} align="left" mono={false} placeholder="Вывод…" /></TD>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={addRow} className="mb-5 flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors">
        <Icon name="Plus" size={14} /> Добавить кампанию
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="bg-muted/60 px-4 py-2 border-b border-border">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Общие выводы по периоду</span>
          </div>
          <textarea
            className="w-full p-4 text-sm bg-transparent border-0 outline-none resize-none min-h-28 placeholder:text-muted-foreground/50"
            placeholder="Напишите ключевые выводы по итогам периода…"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="bg-muted/60 px-4 py-2 border-b border-border">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Следующие шаги</span>
          </div>
          <textarea
            className="w-full p-4 text-sm bg-transparent border-0 outline-none resize-none min-h-28 placeholder:text-muted-foreground/50"
            placeholder="Задачи и инициативы на следующий период…"
            value={nextSteps}
            onChange={(e) => setNextSteps(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

// ─── APP ───────────────────────────────────────────────────────────────────
const TABS = [
  { id: "kpi", label: "KPI", icon: "BarChart2" },
  { id: "budget", label: "Бюджет", icon: "Wallet" },
  { id: "campaigns", label: "Кампании", icon: "Megaphone" },
  { id: "channels", label: "Каналы", icon: "Layers" },
  { id: "report", label: "Отчёт", icon: "FileText" },
] as const;

type TabId = typeof TABS[number]["id"];

export default function Index() {
  const [activeTab, setActiveTab] = useState<TabId>("kpi");
  const [title, setTitle] = useState("РнП Маркетинг");
  const [period, setPeriod] = useState("2025");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded bg-primary flex items-center justify-center flex-shrink-0">
                <Icon name="TableProperties" size={14} className="text-white" />
              </div>
              <input
                className="font-semibold text-sm bg-transparent border-0 outline-none focus:bg-accent rounded px-1 py-0.5 min-w-0 w-48 transition-colors"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <span className="text-muted-foreground text-xs hidden sm:block">·</span>
              <input
                className="text-xs text-muted-foreground bg-transparent border-0 outline-none focus:bg-accent rounded px-1 py-0.5 w-16 transition-colors hidden sm:block"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="Год"
              />
            </div>
            <nav className="flex items-center gap-1">
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-primary font-medium rounded-md bg-accent transition-colors"
              >
                <Icon name="Table2" size={13} />
                Таблицы
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
              >
                <Icon name="LayoutDashboard" size={13} />
                Дашборд
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-card border-b border-border">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
          <div className="flex gap-0 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                <Icon name={tab.icon} size={14} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === "kpi" && <TabKPI />}
        {activeTab === "budget" && <TabBudget />}
        {activeTab === "campaigns" && <TabCampaigns />}
        {activeTab === "channels" && <TabChannels />}
        {activeTab === "report" && <TabReport />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-8 py-4">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>{title} · {period}</span>
          <span>Данные не сохраняются автоматически</span>
        </div>
      </footer>
    </div>
  );
}
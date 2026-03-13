import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";
import Icon from "@/components/ui/icon";

// ─── Mock marketing data (связан с РНП, Воронками, Инфлюенсерами) ─────────────
const WEEKLY_DATA = [
  { week: "Нед 1", budget: 85000, leads: 42, conversions: 8, reach: 12400, cpl: 2024, romi: 118 },
  { week: "Нед 2", budget: 92000, leads: 58, conversions: 11, reach: 18700, cpl: 1586, romi: 142 },
  { week: "Нед 3", budget: 78000, leads: 35, conversions: 7, reach: 9800, cpl: 2229, romi: 98 },
  { week: "Нед 4", budget: 105000, leads: 74, conversions: 15, reach: 24300, cpl: 1419, romi: 187 },
];

const FUNNEL_DATA = [
  { stage: "Охват", value: 64500, pct: 100 },
  { stage: "Клики", value: 3870, pct: 6 },
  { stage: "Лиды", value: 209, pct: 0.3 },
  { stage: "Квал.", value: 84, pct: 0.13 },
  { stage: "Продажи", value: 41, pct: 0.06 },
];

const CHANNEL_DATA = [
  { name: "Instagram / Reels", value: 38, color: "#3b82f6" },
  { name: "Telegram", value: 27, color: "#8b5cf6" },
  { name: "Таргет", value: 19, color: "#06b6d4" },
  { name: "SEO / Органика", value: 10, color: "#10b981" },
  { name: "Прочее", value: 6, color: "#e5e7eb" },
];

const KPI_DATA = [
  { name: "Охват", plan: 60000, fact: 64500, unit: "чел." },
  { name: "Лиды", plan: 200, fact: 209, unit: "шт." },
  { name: "Продажи", plan: 35, fact: 41, unit: "шт." },
  { name: "ROMI", plan: 130, fact: 136, unit: "%" },
];

const INFLUENCER_DATA = [
  { name: "Блогер А", reach: 24300, cpm: 820, leads: 28, status: "Опубликовано" },
  { name: "Блогер Б", reach: 18700, cpm: 1140, leads: 19, status: "Опубликовано" },
  { name: "Блогер В", reach: 12400, cpm: 960, leads: 14, status: "В работе" },
  { name: "Блогер Г", reach: 9100, cpm: 1380, leads: 7, status: "Согласовано" },
];

const CPL_TREND = [
  { week: "Нед 1", cpl: 2024, ltv: 14200 },
  { week: "Нед 2", cpl: 1586, ltv: 15800 },
  { week: "Нед 3", cpl: 2229, ltv: 13900 },
  { week: "Нед 4", cpl: 1419, ltv: 16400 },
];

const PERIODS = ["Нед 1–4 (март)", "Март 2025", "Q1 2025", "2025"];

// ─── Helpers ────────────────────────────────────────────────────────────────
function Trend({ pct, positive = true }: { pct: string; positive?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${positive ? "text-green-600" : "text-red-500"}`}>
      <Icon name={positive ? "TrendingUp" : "TrendingDown"} size={11} />
      {pct}
    </span>
  );
}

interface TooltipItem { dataKey: string; name: string; value: number; color: string; }
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: TooltipItem[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg shadow-lg px-3 py-2 text-xs">
      <div className="font-semibold mb-1 text-foreground">{label}</div>
      {payload.map((p: TooltipItem) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-mono font-semibold text-foreground">{p.value?.toLocaleString("ru-RU")}</span>
        </div>
      ))}
    </div>
  );
};

function DashCard({ title, subtitle, children, className = "" }: {
  title: string; subtitle?: string; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={`bg-card border border-border rounded-xl p-4 flex flex-col gap-3 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold text-foreground">{title}</div>
          {subtitle && <div className="text-xs text-muted-foreground mt-0.5">{subtitle}</div>}
        </div>
        <Icon name="MoreHorizontal" size={16} className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
      </div>
      {children}
    </div>
  );
}

function StatPill({ label, value, trend, up = true, icon }: { label: string; value: string; trend: string; up?: boolean; icon?: string }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
        {icon && <Icon name={icon as "Activity"} size={10} className="text-muted-foreground" />}
        {label}
      </div>
      <div className="font-mono text-xl font-bold leading-none text-foreground">{value}</div>
      <Trend pct={trend} positive={up} />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Опубликовано": "bg-green-100 text-green-700",
    "В работе": "bg-blue-100 text-blue-700",
    "Согласовано": "bg-yellow-100 text-yellow-700",
    "Отправлено": "bg-gray-100 text-gray-600",
    "Не начато": "bg-gray-100 text-gray-500",
  };
  return (
    <span className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium ${map[status] ?? "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

// ─── Nav shared ──────────────────────────────────────────────────────────────
function TopNav({ active }: { active: string }) {
  const navigate = useNavigate();
  const items = [
    { path: "/dashboard", label: "Дашборд", icon: "LayoutDashboard" },
    { path: "/", label: "Основное", icon: "Table2" },
    { path: "/analytics", label: "Аналитика", icon: "LineChart" },
    { path: "/economics", label: "Экономика", icon: "Calculator" },
    { path: "/research", label: "Исследование", icon: "Search" },
    { path: "/content", label: "Контент", icon: "Film" },
  ] as const;
  return (
    <nav className="flex items-center gap-1 overflow-x-auto">
      {items.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-colors whitespace-nowrap font-medium ${
            active === item.path
              ? "text-primary bg-accent"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Icon name={item.icon as "Activity"} size={13} />
          {item.label}
        </button>
      ))}
    </nav>
  );
}

// ─── Dashboard page ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const [period, setPeriod] = useState(0);

  const totalBudget = WEEKLY_DATA.reduce((s, w) => s + w.budget, 0);
  const totalLeads = WEEKLY_DATA.reduce((s, w) => s + w.leads, 0);
  const totalSales = WEEKLY_DATA.reduce((s, w) => s + w.conversions, 0);
  const avgCPL = Math.round(totalBudget / totalLeads);
  const avgROMI = Math.round(WEEKLY_DATA.reduce((s, w) => s + w.romi, 0) / WEEKLY_DATA.length);
  const totalReach = WEEKLY_DATA.reduce((s, w) => s + w.reach, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded bg-primary flex items-center justify-center flex-shrink-0">
                <Icon name="Activity" size={14} className="text-white" />
              </div>
              <span className="font-semibold text-sm">РнП Маркетинг</span>
              <span className="text-muted-foreground text-xs hidden sm:block">·</span>
              <span className="text-xs text-muted-foreground hidden sm:block">2025</span>
            </div>
            <TopNav active="/dashboard" />
          </div>
        </div>
      </header>

      {/* Period selector */}
      <div className="bg-card border-b border-border">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-10 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {PERIODS.map((p, i) => (
              <button
                key={p}
                onClick={() => setPeriod(i)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${period === i ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
              >
                {p}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground hidden sm:block">Обновлено 13 мар, 09:00</span>
        </div>
      </div>

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">

        {/* KPI summary row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 mb-4">
          {[
            { label: "Бюджет", value: `${(totalBudget / 1000).toFixed(0)} тыс ₽`, trend: "+12%", up: true, icon: "Wallet" },
            { label: "Охват", value: `${(totalReach / 1000).toFixed(1)}К`, trend: "+18%", up: true, icon: "Eye" },
            { label: "Лиды", value: String(totalLeads), trend: "+76%", up: true, icon: "Users" },
            { label: "Продажи", value: String(totalSales), trend: "+46%", up: true, icon: "ShoppingCart" },
            { label: "Ср. CPL", value: `${avgCPL.toLocaleString("ru-RU")} ₽`, trend: "-30%", up: true, icon: "Tag" },
            { label: "ROMI", value: `${avgROMI}%`, trend: "+36%", up: true, icon: "TrendingUp" },
          ].map((item) => (
            <div key={item.label} className="bg-card border border-border rounded-xl p-3 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon name={item.icon as "Activity"} size={11} />
                {item.label}
              </div>
              <div className="font-mono text-lg font-bold text-foreground leading-none">{item.value}</div>
              <Trend pct={item.trend} positive={item.up} />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

          {/* Бюджет + Лиды по неделям */}
          <DashCard title="Бюджет и лиды по неделям" subtitle={PERIODS[period]} className="xl:col-span-2">
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WEEKLY_DATA} margin={{ top: 4, right: 0, left: -20, bottom: 0 }} barGap={4}>
                  <defs>
                    <linearGradient id="gradBudget" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.5} />
                    </linearGradient>
                    <linearGradient id="gradLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.5} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="budget" orientation="left" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}к`} />
                  <YAxis yAxisId="leads" orientation="right" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar yAxisId="budget" dataKey="budget" name="Бюджет ₽" fill="url(#gradBudget)" radius={[3, 3, 0, 0]} />
                  <Bar yAxisId="leads" dataKey="leads" name="Лиды" fill="url(#gradLeads)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </DashCard>

          {/* Каналы привлечения */}
          <DashCard title="Каналы привлечения" subtitle="Доля лидов, %">
            <div className="flex flex-col gap-2">
              {CHANNEL_DATA.map((c) => (
                <div key={c.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs text-foreground truncate">{c.name}</span>
                      <span className="text-xs font-mono font-semibold text-foreground ml-2">{c.value}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${c.value}%`, backgroundColor: c.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DashCard>

          {/* Воронка */}
          <DashCard title="Воронка конверсии" subtitle="Охват → Продажи">
            <div className="flex flex-col gap-1.5">
              {FUNNEL_DATA.map((s, i) => {
                const widths = [100, 60, 32, 20, 14];
                const colors = ["#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#10b981"];
                return (
                  <div key={s.stage} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-12 text-right shrink-0">{s.stage}</span>
                    <div className="flex-1 h-6 relative flex items-center">
                      <div
                        className="h-full rounded flex items-center justify-end pr-2 transition-all"
                        style={{ width: `${widths[i]}%`, backgroundColor: colors[i] + "33", border: `1px solid ${colors[i]}44` }}
                      >
                        <span className="font-mono text-xs font-semibold" style={{ color: colors[i] }}>
                          {s.value.toLocaleString("ru-RU")}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground w-10 shrink-0">{s.pct}%</span>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4 pt-1 border-t border-border/50">
              <div className="text-xs text-muted-foreground">
                Конверсия <span className="font-mono font-semibold text-foreground">0.06%</span>
              </div>
              <div className="text-xs text-muted-foreground">
                CR лид→продажа <span className="font-mono font-semibold text-foreground">19.6%</span>
              </div>
            </div>
          </DashCard>

          {/* CPL vs LTV тренд */}
          <DashCard title="CPL vs LTV по неделям" subtitle="Стоимость привлечения и ценность клиента">
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CPL_TREND} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradCPL" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradLTV" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}к`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="cpl" name="CPL ₽" stroke="#ef4444" strokeWidth={1.5} fill="url(#gradCPL)" dot={false} />
                  <Area type="monotone" dataKey="ltv" name="LTV ₽" stroke="#10b981" strokeWidth={1.5} fill="url(#gradLTV)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </DashCard>

          {/* KPI план/факт */}
          <DashCard title="KPI: план vs факт" subtitle={PERIODS[period]}>
            <div className="flex flex-col gap-2">
              {KPI_DATA.map((k) => {
                const pct = Math.round((k.fact / k.plan) * 100);
                const color = pct >= 100 ? "#10b981" : pct >= 70 ? "#f59e0b" : "#ef4444";
                return (
                  <div key={k.name} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-foreground font-medium">{k.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{k.plan.toLocaleString("ru-RU")} {k.unit}</span>
                        <span className="font-mono font-semibold" style={{ color }}>{k.fact.toLocaleString("ru-RU")}</span>
                        <span className="font-mono text-xs" style={{ color }}>{pct}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </DashCard>

          {/* ROMI тренд */}
          <DashCard title="ROMI по неделям" subtitle="Возврат на маркетинговые инвестиции">
            <div className="flex gap-5 flex-wrap">
              <StatPill label="Ср. ROMI" value={`${avgROMI}%`} trend="+36%" up icon="Percent" />
              <StatPill label="Лучшая неделя" value="187%" trend="Нед 4" up icon="Star" />
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={WEEKLY_DATA} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradROMI" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="romi" name="ROMI %" stroke="#3b82f6" strokeWidth={2} fill="url(#gradROMI)" dot={{ fill: "#3b82f6", r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </DashCard>

          {/* Инфлюенсеры */}
          <DashCard title="Инфлюенсеры" subtitle="Результаты размещений" className="xl:col-span-2">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/60">
                    <th className="text-left py-1.5 font-medium text-muted-foreground">Блогер</th>
                    <th className="text-right py-1.5 font-medium text-muted-foreground">Охват</th>
                    <th className="text-right py-1.5 font-medium text-muted-foreground">CPM ₽</th>
                    <th className="text-right py-1.5 font-medium text-muted-foreground">Лиды</th>
                    <th className="text-center py-1.5 font-medium text-muted-foreground">Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {INFLUENCER_DATA.map((inf) => (
                    <tr key={inf.name} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-2 font-medium text-foreground">{inf.name}</td>
                      <td className="py-2 text-right font-mono text-foreground">{inf.reach.toLocaleString("ru-RU")}</td>
                      <td className="py-2 text-right font-mono text-foreground">{inf.cpm.toLocaleString("ru-RU")}</td>
                      <td className="py-2 text-right font-mono font-semibold text-foreground">{inf.leads}</td>
                      <td className="py-2 text-center"><StatusBadge status={inf.status} /></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-border/60">
                    <td className="py-1.5 font-semibold text-xs text-muted-foreground">Итого</td>
                    <td className="py-1.5 text-right font-mono font-bold text-foreground">
                      {INFLUENCER_DATA.reduce((s, r) => s + r.reach, 0).toLocaleString("ru-RU")}
                    </td>
                    <td className="py-1.5 text-right font-mono text-muted-foreground">—</td>
                    <td className="py-1.5 text-right font-mono font-bold text-foreground">
                      {INFLUENCER_DATA.reduce((s, r) => s + r.leads, 0)}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </DashCard>

        </div>
      </main>

      <footer className="border-t border-border mt-8 py-4">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>РнП Маркетинг · 2025</span>
          <span>Данные не сохраняются автоматически</span>
        </div>
      </footer>
    </div>
  );
}

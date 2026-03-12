import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import Icon from "@/components/ui/icon";

// ─── Mock data ──────────────────────────────────────────────────────────────
const TRAFFIC_DATA = [
  { day: "01 мар", users: 420, sessions: 890, new: 240 },
  { day: "02 мар", users: 380, sessions: 820, new: 210 },
  { day: "03 мар", users: 510, sessions: 1100, new: 290 },
  { day: "04 мар", users: 340, sessions: 750, new: 180 },
  { day: "05 мар", users: 460, sessions: 980, new: 260 },
  { day: "06 мар", users: 530, sessions: 1140, new: 310 },
  { day: "07 мар", users: 490, sessions: 1050, new: 285 },
  { day: "08 мар", users: 610, sessions: 1320, new: 350 },
  { day: "09 мар", users: 580, sessions: 1250, new: 330 },
  { day: "10 мар", users: 640, sessions: 1380, new: 370 },
  { day: "11 мар", users: 700, sessions: 1510, new: 410 },
  { day: "12 мар", users: 660, sessions: 1430, new: 390 },
];

const CHANNELS_DATA = [
  { name: "Direct", value: 8872, pct: 59, color: "#3b82f6" },
  { name: "Paid Search", value: 905, pct: 9, color: "#60a5fa" },
  { name: "Social", value: 138, pct: 3, color: "#93c5fd" },
  { name: "Organic Search", value: 120, pct: 1, color: "#bfdbfe" },
  { name: "Referral", value: 51, pct: 1, color: "#dbeafe" },
  { name: "Email", value: 6, pct: 0, color: "#eff6ff" },
  { name: "Прочее", value: 2, pct: 0, color: "#e5e7eb" },
];

const BOUNCE_DATA = [
  { day: "01 мар", bounce: 58, duration: 62 },
  { day: "02 мар", bounce: 61, duration: 59 },
  { day: "03 мар", bounce: 55, duration: 68 },
  { day: "04 мар", bounce: 63, duration: 55 },
  { day: "05 мар", bounce: 59, duration: 65 },
  { day: "06 мар", bounce: 56, duration: 70 },
  { day: "07 мар", bounce: 57, duration: 67 },
  { day: "08 мар", bounce: 54, duration: 72 },
  { day: "09 мар", bounce: 52, duration: 75 },
  { day: "10 мар", bounce: 51, duration: 78 },
  { day: "11 мар", bounce: 49, duration: 82 },
  { day: "12 мар", bounce: 61, duration: 74 },
];

const COUNTRIES = [
  { name: "Россия", value: 8002 },
  { name: "Казахстан", value: 648 },
  { name: "Беларусь", value: 304 },
  { name: "Украина", value: 12 },
  { name: "Германия", value: 3 },
  { name: "США", value: 2 },
];

const CITIES = [
  { name: "Москва", value: 633 },
  { name: "Санкт-Петербург", value: 378 },
  { name: "Новосибирск", value: 281 },
  { name: "Екатеринбург", value: 219 },
  { name: "Казань", value: 190 },
  { name: "Нижний Новгород", value: 131 },
];

const DEVICES_DATA = [
  { name: "Desktop", value: 8268, pct: 92, color: "#3b82f6" },
  { name: "Mobile", value: 570, pct: 6, color: "#93c5fd" },
  { name: "Tablet", value: 93, pct: 1, color: "#dbeafe" },
];

const TOTAL_SESSIONS = 8992;

// ─── Helpers ────────────────────────────────────────────────────────────────
function Trend({ pct, positive = true }: { pct: string; positive?: boolean }) {
  const up = positive;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${up ? "text-green-600" : "text-red-500"}`}>
      <Icon name={up ? "TrendingUp" : "TrendingDown"} size={11} />
      {pct}
    </span>
  );
}

interface TooltipPayloadItem { dataKey: string; name: string; value: number; color: string; }
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadItem[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg shadow-lg px-3 py-2 text-xs">
      <div className="font-semibold mb-1 text-foreground">{label}</div>
      {payload.map((p: TooltipPayloadItem) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-mono font-semibold text-foreground">{p.value?.toLocaleString("ru-RU")}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Card wrapper ───────────────────────────────────────────────────────────
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

// ─── Stat pill ──────────────────────────────────────────────────────────────
function StatPill({ label, value, trend, up = true }: { label: string; value: string; trend: string; up?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
        <Icon name="TrendingUp" size={10} className={up ? "text-green-500" : "text-red-400"} />
        {label}
      </div>
      <div className="font-mono text-xl font-bold leading-none text-foreground">{value}</div>
      <Trend pct={trend} positive={up} />
    </div>
  );
}

// ─── Donut chart ─────────────────────────────────────────────────────────────
function DonutChart({ data, total, size = 200 }: { data: typeof CHANNELS_DATA; total: number; size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <PieChart width={size} height={size}>
        <Pie
          data={data}
          cx={size / 2 - 1}
          cy={size / 2 - 1}
          innerRadius={size * 0.35}
          outerRadius={size * 0.47}
          dataKey="value"
          strokeWidth={0}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="font-mono font-bold text-xl leading-none text-foreground">{total.toLocaleString("ru-RU")}</div>
        </div>
      </div>
    </div>
  );
}

// ─── PERIODS ──────────────────────────────────────────────────────────────
const PERIODS = ["01 – 12 мар", "Март 2025", "Q1 2025", "2025"];

// ─── Dashboard page ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState(0);

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
              <span className="font-semibold text-sm">РнП Маркетинг</span>
              <span className="text-muted-foreground text-xs hidden sm:block">·</span>
              <span className="text-xs text-muted-foreground hidden sm:block">2025</span>
            </div>
            <nav className="flex items-center gap-1">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
              >
                <Icon name="Table2" size={13} />
                Таблицы
              </button>
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-primary font-medium rounded-md bg-accent transition-colors"
              >
                <Icon name="LayoutDashboard" size={13} />
                Дашборд
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Sub-header: period selector */}
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
          <span className="text-xs text-muted-foreground hidden sm:block">Обновлено 12 мар, 11:00</span>
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

          {/* 1. Traffic */}
          <DashCard title="Посещаемость сайта" subtitle={PERIODS[period]} className="xl:col-span-1">
            <div className="flex gap-5 flex-wrap">
              <StatPill label="Пользователи" value="4 614" trend="+631%" />
              <StatPill label="Сеансы" value="10 845" trend="+1455%" />
              <StatPill label="Новые" value="2 747" trend="+400%" />
            </div>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TRAFFIC_DATA} margin={{ top: 4, right: 0, left: -30, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradSessions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} interval={2} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="users" name="Польз." stroke="#3b82f6" strokeWidth={1.5} fill="url(#gradUsers)" dot={false} />
                  <Area type="monotone" dataKey="sessions" name="Сеансы" stroke="#8b5cf6" strokeWidth={1.5} fill="url(#gradSessions)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </DashCard>

          {/* 2. Channels donut */}
          <DashCard title="Сеансы по каналам" subtitle={PERIODS[period]}>
            <div className="flex items-center gap-4">
              <DonutChart data={CHANNELS_DATA} total={TOTAL_SESSIONS} size={160} />
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                {CHANNELS_DATA.slice(0, 6).map((c) => (
                  <div key={c.name} className="flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                      <span className="text-xs text-muted-foreground truncate">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="font-mono text-xs font-medium text-foreground">{c.value.toLocaleString("ru-RU")}</span>
                      <span className="text-xs text-muted-foreground w-7 text-right">{c.pct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DashCard>

          {/* 3. Relevance / bounce */}
          <DashCard title="Релевантность сайта" subtitle={PERIODS[period]}>
            <div className="flex gap-5">
              <StatPill label="Ср. длит. сеанса" value="1h 10m" trend="+1965%" />
              <StatPill label="Отказы" value="61,94%" trend="-14%" up={false} />
            </div>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={BOUNCE_DATA} margin={{ top: 4, right: 0, left: -30, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradBounce" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} interval={2} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="duration" name="Длительность" stroke="#3b82f6" strokeWidth={1.5} fill="url(#gradBounce)" dot={false} />
                  <Area type="monotone" dataKey="bounce" name="Отказы, %" stroke="#f59e0b" strokeWidth={1.5} fill="none" dot={false} strokeDasharray="4 2" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </DashCard>

          {/* 4. Countries */}
          <DashCard title="Сеансы по странам" subtitle={PERIODS[period]}>
            <div className="flex flex-col gap-0">
              <div className="flex items-center justify-between py-1.5 border-b border-border/60">
                <span className="text-xs text-muted-foreground font-medium">Название</span>
                <span className="text-xs text-muted-foreground font-medium">Значение</span>
              </div>
              {COUNTRIES.map((c, i) => {
                const maxVal = COUNTRIES[0].value;
                const pct = Math.round((c.value / maxVal) * 100);
                return (
                  <div key={c.name} className="flex items-center gap-3 py-2 border-b border-border/40 last:border-0 group">
                    <span className="text-xs text-muted-foreground w-4 shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-foreground">{c.name}</div>
                      <div className="mt-1 h-1 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary/40 transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <span className="font-mono text-sm font-semibold text-foreground shrink-0">{c.value.toLocaleString("ru-RU")}</span>
                  </div>
                );
              })}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-semibold text-muted-foreground">Итого</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-foreground">10 845</span>
                  <Trend pct="+1455%" />
                </div>
              </div>
            </div>
          </DashCard>

          {/* 5. Cities */}
          <DashCard title="Сеансы по городам" subtitle={PERIODS[period]}>
            <div className="flex flex-col gap-0">
              <div className="flex items-center justify-between py-1.5 border-b border-border/60">
                <span className="text-xs text-muted-foreground font-medium">Название</span>
                <span className="text-xs text-muted-foreground font-medium">Значение</span>
              </div>
              {CITIES.map((c, i) => {
                const maxVal = CITIES[0].value;
                const pct = Math.round((c.value / maxVal) * 100);
                return (
                  <div key={c.name} className="flex items-center gap-3 py-2 border-b border-border/40 last:border-0">
                    <span className="text-xs text-muted-foreground w-4 shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-foreground">{c.name}</div>
                      <div className="mt-1 h-1 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary/40 transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <span className="font-mono text-sm font-semibold text-foreground shrink-0">{c.value.toLocaleString("ru-RU")}</span>
                  </div>
                );
              })}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-semibold text-muted-foreground">Итого</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-foreground">1 832</span>
                  <Trend pct="+1455%" />
                </div>
              </div>
            </div>
          </DashCard>

          {/* 6. Devices donut */}
          <DashCard title="Сеансы по устройствам" subtitle={PERIODS[period]}>
            <div className="flex items-center justify-center gap-6">
              <DonutChart data={DEVICES_DATA} total={TOTAL_SESSIONS} size={160} />
              <div className="flex flex-col gap-3">
                {DEVICES_DATA.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: d.color }} />
                    <div className="min-w-0">
                      <div className="text-xs text-muted-foreground">{d.name}</div>
                      <div className="font-mono text-sm font-bold text-foreground leading-none mt-0.5">
                        {d.value.toLocaleString("ru-RU")}
                        <span className="font-normal text-muted-foreground text-xs ml-1">· {d.pct}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DashCard>

        </div>

        {/* KPI summary strip */}
        <div className="mt-4 bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold">Сводка KPI за период</div>
            <span className="text-xs text-muted-foreground">{PERIODS[period]}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              { label: "Пользователи", value: "4 614", trend: "+631%", up: true },
              { label: "Сеансы", value: "10 845", trend: "+1455%", up: true },
              { label: "Новые", value: "2 747", trend: "+400%", up: true },
              { label: "Ср. сеанс", value: "1h 10m", trend: "+1965%", up: true },
              { label: "Отказы", value: "61,94%", trend: "-14%", up: false },
              { label: "Лиды", value: "342", trend: "+88%", up: true },
              { label: "CPL", value: "1 240 ₽", trend: "-22%", up: true },
              { label: "ROAS", value: "3,2x", trend: "+41%", up: true },
            ].map((s) => (
              <div key={s.label} className="flex flex-col gap-1 p-3 rounded-lg bg-muted/40">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <span className="font-mono text-base font-bold text-foreground leading-none">{s.value}</span>
                <Trend pct={s.trend} positive={s.up} />
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-border mt-4 py-4">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>РнП Маркетинг · Дашборд</span>
          <span>Данные демонстрационные</span>
        </div>
      </footer>
    </div>
  );
}
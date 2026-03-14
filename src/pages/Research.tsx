import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { api } from "@/api";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SwotItem {
  id: number;
  quadrant: "S" | "W" | "O" | "T";
  content: string;
  sort_order?: number;
}

interface PestItem {
  id: number;
  factor: string;
  content: string;
}

interface SmartGoal {
  id: number;
  goal: string;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  time_bound: string;
  status: string;
}

interface TaSegment {
  id: number;
  name: string;
  age: string;
  geo: string;
  pain: string;
  income: string;
  channel: string;
  size: string;
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
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
        <button key={item.path} onClick={() => navigate(item.path)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-colors whitespace-nowrap font-medium ${
            active === item.path ? "text-primary bg-accent" : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Icon name={item.icon as "Activity"} size={13} />
          {item.label}
        </button>
      ))}
    </nav>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function PlaceholderSection({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
        <Icon name={icon as "Activity"} size={22} className="text-muted-foreground" />
      </div>
      <div>
        <div className="font-semibold text-foreground">{title}</div>
        <div className="text-xs text-muted-foreground mt-1 max-w-xs">{desc}</div>
      </div>
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-xs text-muted-foreground">
        <Icon name="Clock" size={11} /> Скоро
      </span>
    </div>
  );
}

function LoadingText() {
  return <div className="text-xs text-muted-foreground py-10 text-center">Загрузка...</div>;
}

// ─── Tabs config ──────────────────────────────────────────────────────────────
const RESEARCH_TABS = [
  { id: "swot", label: "SWOT-анализ", icon: "Grid2X2" },
  { id: "pest", label: "PEST-анализ", icon: "Globe" },
  { id: "smart", label: "SMART-цели", icon: "Target" },
  { id: "ta", label: "Анализ ЦА", icon: "UserCircle" },
  { id: "brief", label: "Брифование", icon: "ClipboardList" },
  { id: "competitors", label: "Конкуренты", icon: "Swords" },
] as const;
type RTabId = typeof RESEARCH_TABS[number]["id"];

// ─── SWOT quadrant config ─────────────────────────────────────────────────────
const SWOT_QUADS = [
  { key: "S" as const, label: "Сильные стороны", color: "border-green-200 bg-green-50", head: "bg-green-100 text-green-800", icon: "ThumbsUp" },
  { key: "W" as const, label: "Слабые стороны", color: "border-red-200 bg-red-50", head: "bg-red-100 text-red-800", icon: "ThumbsDown" },
  { key: "O" as const, label: "Возможности", color: "border-blue-200 bg-blue-50", head: "bg-blue-100 text-blue-800", icon: "Lightbulb" },
  { key: "T" as const, label: "Угрозы", color: "border-yellow-200 bg-yellow-50", head: "bg-yellow-100 text-yellow-800", icon: "AlertTriangle" },
];

// ─── PEST color config ────────────────────────────────────────────────────────
const PEST_COLORS = [
  { bg: "bg-blue-50 border-blue-200", head: "bg-blue-100 text-blue-800" },
  { bg: "bg-green-50 border-green-200", head: "bg-green-100 text-green-800" },
  { bg: "bg-purple-50 border-purple-200", head: "bg-purple-100 text-purple-800" },
  { bg: "bg-orange-50 border-orange-200", head: "bg-orange-100 text-orange-800" },
];

const SMART_STATUS_COLORS: Record<string, string> = {
  "В работе": "bg-blue-100 text-blue-700",
  "Новый": "bg-gray-100 text-gray-600",
  "Планируется": "bg-yellow-100 text-yellow-700",
  "Выполнено": "bg-green-100 text-green-700",
};

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Research() {
  const [activeTab, setActiveTab] = useState<RTabId>("swot");

  // ── SWOT state ────────────────────────────────────────────────────────────
  const [swotItems, setSwotItems] = useState<SwotItem[]>([]);
  const [swotLoading, setSwotLoading] = useState(false);

  // ── PEST state ────────────────────────────────────────────────────────────
  const [pestItems, setPestItems] = useState<PestItem[]>([]);
  const [pestLoading, setPestLoading] = useState(false);

  // ── SMART state ───────────────────────────────────────────────────────────
  const [smartGoals, setSmartGoals] = useState<SmartGoal[]>([]);
  const [smartLoading, setSmartLoading] = useState(false);

  // ── TA state ──────────────────────────────────────────────────────────────
  const [taSegments, setTaSegments] = useState<TaSegment[]>([]);
  const [taLoading, setTaLoading] = useState(false);

  // ── Load data lazily when tab is activated ────────────────────────────────
  useEffect(() => {
    if (activeTab === "swot" && swotItems.length === 0 && !swotLoading) {
      setSwotLoading(true);
      api.get("swot")
        .then((data) => setSwotItems(Array.isArray(data) ? data : []))
        .catch(() => setSwotItems([]))
        .finally(() => setSwotLoading(false));
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "pest" && pestItems.length === 0 && !pestLoading) {
      setPestLoading(true);
      api.get("pest")
        .then((data) => setPestItems(Array.isArray(data) ? data : []))
        .catch(() => setPestItems([]))
        .finally(() => setPestLoading(false));
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "smart" && smartGoals.length === 0 && !smartLoading) {
      setSmartLoading(true);
      api.get("smart")
        .then((data) => setSmartGoals(Array.isArray(data) ? data : []))
        .catch(() => setSmartGoals([]))
        .finally(() => setSmartLoading(false));
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "ta" && taSegments.length === 0 && !taLoading) {
      setTaLoading(true);
      api.get("target-audience")
        .then((data) => setTaSegments(Array.isArray(data) ? data : []))
        .catch(() => setTaSegments([]))
        .finally(() => setTaLoading(false));
    }
  }, [activeTab]);

  // ── SWOT actions ──────────────────────────────────────────────────────────
  const handleAddSwot = async (quadrant: "S" | "W" | "O" | "T") => {
    const content = prompt(`Добавить в «${quadrant}»:`);
    if (!content?.trim()) return;
    const created = await api.post("swot", { quadrant, content: content.trim() });
    if (created && created.id) {
      setSwotItems((prev) => [...prev, created]);
    }
  };

  const handleDeleteSwot = async (id: number) => {
    await api.delete("swot", id);
    setSwotItems((prev) => prev.filter((item) => item.id !== id));
  };

  // ── SMART actions ─────────────────────────────────────────────────────────
  const handleAddSmart = async () => {
    const goal = prompt("Цель (название):");
    if (!goal?.trim()) return;
    const specific = prompt("Specific (конкретность):") ?? "";
    const measurable = prompt("Measurable (измеримость):") ?? "";
    const achievable = prompt("Achievable (достижимость):") ?? "";
    const relevant = prompt("Relevant (актуальность):") ?? "";
    const time_bound = prompt("Time-bound (срок):") ?? "";
    const created = await api.post("smart", {
      goal: goal.trim(),
      specific,
      measurable,
      achievable,
      relevant,
      time_bound,
      status: "Новый",
    });
    if (created && created.id) {
      setSmartGoals((prev) => [...prev, created]);
    }
  };

  const handleDeleteSmart = async (id: number) => {
    await api.delete("smart", id);
    setSmartGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // ── Group helpers ─────────────────────────────────────────────────────────
  const swotByQuadrant = (key: "S" | "W" | "O" | "T") =>
    swotItems.filter((item) => item.quadrant === key);

  const pestByFactor = (): { factor: string; items: PestItem[] }[] => {
    const map = new Map<string, PestItem[]>();
    for (const item of pestItems) {
      if (!map.has(item.factor)) map.set(item.factor, []);
      map.get(item.factor)!.push(item);
    }
    return Array.from(map.entries()).map(([factor, items]) => ({ factor, items }));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded bg-primary flex items-center justify-center flex-shrink-0">
                <Icon name="Activity" size={14} className="text-white" />
              </div>
              <span className="font-semibold text-sm">РнП Маркетинг</span>
              <span className="text-muted-foreground text-xs hidden sm:block">·</span>
              <span className="text-xs text-muted-foreground hidden sm:block">Исследование</span>
            </div>
            <TopNav active="/research" />
          </div>
        </div>
      </header>

      <div className="bg-card border-b border-border">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
          <div className="flex gap-0 overflow-x-auto">
            {RESEARCH_TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon name={tab.icon as "Activity"} size={14} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">

        {/* SWOT */}
        {activeTab === "swot" && (
          <div className="flex flex-col gap-4">
            <h1 className="text-base font-bold text-foreground">SWOT-анализ</h1>
            {swotLoading ? (
              <LoadingText />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SWOT_QUADS.map((q) => (
                  <div key={q.key} className={`border rounded-xl overflow-hidden ${q.color}`}>
                    <div className={`px-4 py-2.5 flex items-center gap-2 ${q.head}`}>
                      <Icon name={q.icon as "Activity"} size={14} />
                      <span className="font-semibold text-sm">{q.key} — {q.label}</span>
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                      {swotByQuadrant(q.key).map((item) => (
                        <div key={item.id} className="flex items-start gap-2 text-sm group">
                          <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-current opacity-50 shrink-0 mt-1.5" />
                          <span className="text-foreground flex-1">{item.content}</span>
                          <button
                            onClick={() => handleDeleteSwot(item.id)}
                            className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-muted-foreground hover:text-red-500 transition-all"
                            title="Удалить"
                          >
                            <Icon name="Trash2" size={12} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => handleAddSwot(q.key)}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-1 transition-colors"
                      >
                        <Icon name="Plus" size={11} /> Добавить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PEST */}
        {activeTab === "pest" && (
          <div className="flex flex-col gap-4">
            <h1 className="text-base font-bold text-foreground">PEST-анализ бренда</h1>
            {pestLoading ? (
              <LoadingText />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pestByFactor().map((group, i) => {
                  const c = PEST_COLORS[i % PEST_COLORS.length];
                  return (
                    <div key={group.factor} className={`border rounded-xl overflow-hidden ${c.bg}`}>
                      <div className={`px-4 py-2.5 font-semibold text-sm ${c.head}`}>{group.factor}</div>
                      <div className="p-4 flex flex-col gap-2">
                        {group.items.map((item) => (
                          <div key={item.id} className="flex items-start gap-2 text-sm">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-current opacity-40 shrink-0" />
                            <span className="text-foreground">{item.content}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SMART */}
        {activeTab === "smart" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-base font-bold text-foreground">SMART-цели</h1>
              <button
                onClick={handleAddSmart}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                <Icon name="Plus" size={13} /> Добавить цель
              </button>
            </div>
            {smartLoading ? (
              <LoadingText />
            ) : (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs min-w-[850px]">
                    <thead className="bg-muted/40">
                      <tr className="border-b border-border">
                        {["Цель", "Specific", "Measurable", "Achievable", "Relevant", "Time", "Статус", ""].map((h) => (
                          <th key={h} className="text-left px-3 py-3 font-medium text-muted-foreground">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {smartGoals.map((g) => (
                        <tr key={g.id} className="border-b border-border/30 last:border-0 hover:bg-muted/20 group">
                          <td className="px-3 py-3 font-semibold text-foreground">{g.goal}</td>
                          <td className="px-3 py-3 text-foreground">{g.specific}</td>
                          <td className="px-3 py-3 font-mono text-foreground">{g.measurable}</td>
                          <td className="px-3 py-3 text-foreground">{g.achievable}</td>
                          <td className="px-3 py-3 text-foreground">{g.relevant}</td>
                          <td className="px-3 py-3 font-mono text-foreground">{g.time_bound}</td>
                          <td className="px-3 py-3">
                            <span className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium ${SMART_STATUS_COLORS[g.status] ?? "bg-muted text-muted-foreground"}`}>
                              {g.status}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <button
                              onClick={() => handleDeleteSmart(g.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all"
                              title="Удалить цель"
                            >
                              <Icon name="Trash2" size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ЦА */}
        {activeTab === "ta" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-base font-bold text-foreground">Анализ целевой аудитории</h1>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                <Icon name="Plus" size={13} /> Добавить сегмент
              </button>
            </div>
            {taLoading ? (
              <LoadingText />
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {taSegments.map((seg) => (
                  <div key={seg.id} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon name="User" size={15} className="text-primary" />
                      </div>
                      <span className="font-semibold text-sm text-foreground">{seg.name}</span>
                    </div>
                    <div className="flex flex-col gap-1.5 text-xs">
                      {[
                        { label: "Возраст", value: seg.age },
                        { label: "Гео", value: seg.geo },
                        { label: "Доход", value: seg.income },
                        { label: "Каналы", value: seg.channel },
                      ].map((f) => (
                        <div key={f.label} className="flex items-start justify-between gap-2">
                          <span className="text-muted-foreground">{f.label}:</span>
                          <span className="text-foreground font-medium text-right">{f.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-red-50 border border-red-100 rounded-lg p-2.5">
                      <div className="text-xs font-medium text-red-700 mb-0.5">Боль:</div>
                      <div className="text-xs text-red-600">{seg.pain}</div>
                    </div>
                    <div className="flex items-center justify-between border-t border-border/40 pt-2">
                      <span className="text-xs text-muted-foreground">Объём сегмента</span>
                      <span className="text-xs font-semibold text-foreground">{seg.size}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "brief" && <PlaceholderSection icon="ClipboardList" title="Брифование" desc="Шаблоны брифов для клиентов и проектов" />}
        {activeTab === "competitors" && <PlaceholderSection icon="Swords" title="Анализ конкурентов" desc="Конкурентный анализ, матрица типов конкурентов, ключевые решения" />}
      </main>

      <footer className="border-t border-border mt-8 py-4">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>РнП Маркетинг · Исследование · 2025</span>
          <span>Данные не сохраняются автоматически</span>
        </div>
      </footer>
    </div>
  );
}

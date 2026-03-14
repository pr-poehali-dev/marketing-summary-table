import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { api } from "@/api";

// ─── Types ────────────────────────────────────────────────────────────────────
interface MediaplanItem {
  id: number;
  week: string;
  channel: string;
  format: string;
  theme: string;
  responsible: string;
  budget: number;
  reach: number;
  status: string;
}

interface ContentMatrixItem {
  id: number;
  type: string;
  formats: string; // comma-separated string from API
  goal: string;
  frequency: string;
  examples: string;
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
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Опубликовано": "bg-green-100 text-green-700",
    "В работе": "bg-blue-100 text-blue-700",
    "Планируется": "bg-yellow-100 text-yellow-700",
    "Отменено": "bg-red-100 text-red-600",
  };
  return (
    <span className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium ${map[status] ?? "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

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
const CONTENT_TABS = [
  { id: "mediaplan", label: "Медиаплан", icon: "CalendarDays" },
  { id: "matrix", label: "Матрица контента", icon: "Grid3X3" },
  { id: "shoots", label: "Съёмки и производство", icon: "Clapperboard" },
] as const;
type CTabId = typeof CONTENT_TABS[number]["id"];

// ─── Card color palettes ──────────────────────────────────────────────────────
const MATRIX_COLORS = [
  { border: "border-blue-200 bg-blue-50", head: "bg-blue-100 text-blue-800" },
  { border: "border-purple-200 bg-purple-50", head: "bg-purple-100 text-purple-800" },
  { border: "border-green-200 bg-green-50", head: "bg-green-100 text-green-800" },
  { border: "border-orange-200 bg-orange-50", head: "bg-orange-100 text-orange-800" },
  { border: "border-yellow-200 bg-yellow-50", head: "bg-yellow-100 text-yellow-800" },
];

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Content() {
  const [activeTab, setActiveTab] = useState<CTabId>("mediaplan");

  // ── Mediaplan state ───────────────────────────────────────────────────────
  const [mediaplan, setMediaplan] = useState<MediaplanItem[]>([]);
  const [mediaplanLoading, setMediaplanLoading] = useState(false);

  // ── Content matrix state ──────────────────────────────────────────────────
  const [contentMatrix, setContentMatrix] = useState<ContentMatrixItem[]>([]);
  const [matrixLoading, setMatrixLoading] = useState(false);

  // ── Lazy load by tab ──────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab === "mediaplan" && mediaplan.length === 0 && !mediaplanLoading) {
      setMediaplanLoading(true);
      api.get("mediaplan")
        .then((data) => setMediaplan(Array.isArray(data) ? data : []))
        .catch(() => setMediaplan([]))
        .finally(() => setMediaplanLoading(false));
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "matrix" && contentMatrix.length === 0 && !matrixLoading) {
      setMatrixLoading(true);
      api.get("content-matrix")
        .then((data) => setContentMatrix(Array.isArray(data) ? data : []))
        .catch(() => setContentMatrix([]))
        .finally(() => setMatrixLoading(false));
    }
  }, [activeTab]);

  // ── Mediaplan actions ─────────────────────────────────────────────────────
  const handleAddMediaplan = async () => {
    const week = prompt("Неделя (например, Нед 1):");
    if (!week?.trim()) return;
    const channel = prompt("Канал (например, Instagram Reels):") ?? "";
    const theme = prompt("Тема публикации:") ?? "";
    const responsible = prompt("Ответственный:") ?? "";
    const created = await api.post("mediaplan", {
      week: week.trim(),
      channel: channel.trim(),
      theme: theme.trim(),
      responsible: responsible.trim(),
      format: "",
      budget: 0,
      reach: 0,
      status: "Планируется",
    });
    if (created && created.id) {
      setMediaplan((prev) => [...prev, created]);
    }
  };

  const handleDeleteMediaplan = async (id: number) => {
    await api.delete("mediaplan", id);
    setMediaplan((prev) => prev.filter((m) => m.id !== id));
  };

  // ── Derived summary ───────────────────────────────────────────────────────
  const totalBudget = mediaplan.reduce((s, m) => s + (m.budget || 0), 0);
  const totalReach = mediaplan.reduce((s, m) => s + (m.reach || 0), 0);
  const publishedCount = mediaplan.filter((m) => m.status === "Опубликовано").length;

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
              <span className="text-xs text-muted-foreground hidden sm:block">Контент</span>
            </div>
            <TopNav active="/content" />
          </div>
        </div>
      </header>

      <div className="bg-card border-b border-border">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
          <div className="flex gap-0 overflow-x-auto">
            {CONTENT_TABS.map((tab) => (
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

        {/* Медиаплан */}
        {activeTab === "mediaplan" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-base font-bold text-foreground">Медиаплан</h1>
                <p className="text-xs text-muted-foreground mt-0.5">Расписание публикаций по каналам и форматам</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddMediaplan}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  <Icon name="Plus" size={13} /> Добавить
                </button>
              </div>
            </div>

            {mediaplanLoading ? (
              <LoadingText />
            ) : (
              <>
                {/* Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Всего материалов", value: String(mediaplan.length) },
                    { label: "Опубликовано", value: String(publishedCount) },
                    { label: "Бюджет на контент", value: `${totalBudget.toLocaleString("ru-RU")} ₽` },
                    { label: "Охват (факт)", value: totalReach.toLocaleString("ru-RU") },
                  ].map((kpi) => (
                    <div key={kpi.label} className="bg-card border border-border rounded-xl p-3">
                      <div className="text-xs text-muted-foreground mb-1">{kpi.label}</div>
                      <div className="font-mono text-lg font-bold text-foreground">{kpi.value}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs min-w-[900px]">
                      <thead className="bg-muted/40">
                        <tr className="border-b border-border">
                          {["Неделя", "Канал", "Формат", "Тема", "Ответственный", "Бюджет", "Охват", "Статус", ""].map((h) => (
                            <th key={h} className="text-left px-3 py-3 font-medium text-muted-foreground">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {mediaplan.map((m) => (
                          <tr key={m.id} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors group">
                            <td className="px-3 py-3 font-medium text-foreground">{m.week}</td>
                            <td className="px-3 py-3 text-foreground">{m.channel}</td>
                            <td className="px-3 py-3 text-muted-foreground">{m.format}</td>
                            <td className="px-3 py-3 text-foreground">{m.theme}</td>
                            <td className="px-3 py-3 text-muted-foreground">{m.responsible}</td>
                            <td className="px-3 py-3 font-mono text-foreground">
                              {(m.budget || 0) > 0 ? `${(m.budget).toLocaleString("ru-RU")} ₽` : "—"}
                            </td>
                            <td className="px-3 py-3 font-mono text-foreground">
                              {(m.reach || 0) > 0 ? (m.reach).toLocaleString("ru-RU") : "—"}
                            </td>
                            <td className="px-3 py-3"><StatusBadge status={m.status} /></td>
                            <td className="px-3 py-3">
                              <button
                                onClick={() => handleDeleteMediaplan(m.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all"
                                title="Удалить"
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
              </>
            )}
          </div>
        )}

        {/* Матрица контента */}
        {activeTab === "matrix" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-base font-bold text-foreground">Матрица контента</h1>
                <p className="text-xs text-muted-foreground mt-0.5">Типы, форматы и цели контента</p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                <Icon name="Plus" size={13} /> Добавить тип
              </button>
            </div>

            {matrixLoading ? (
              <LoadingText />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {contentMatrix.map((c, i) => {
                  const palette = MATRIX_COLORS[i % MATRIX_COLORS.length];
                  const formatTags = c.formats
                    ? c.formats.split(",").map((f) => f.trim()).filter(Boolean)
                    : [];
                  return (
                    <div key={c.id} className={`border rounded-xl overflow-hidden ${palette.border}`}>
                      <div className={`px-4 py-2.5 flex items-center justify-between ${palette.head}`}>
                        <span className="font-semibold text-sm">{c.type}</span>
                        <span className="text-xs opacity-70">{c.frequency}</span>
                      </div>
                      <div className="p-4 flex flex-col gap-3">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Форматы</div>
                          <div className="flex flex-wrap gap-1">
                            {formatTags.map((f) => (
                              <span key={f} className="px-2 py-0.5 bg-white/70 border border-current/20 rounded text-xs text-foreground">{f}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-0.5">Цель</div>
                          <div className="text-sm font-medium text-foreground">{c.goal}</div>
                        </div>
                        <div className="border-t border-current/10 pt-2">
                          <div className="text-xs text-muted-foreground mb-0.5">Пример</div>
                          <div className="text-xs text-foreground italic">{c.examples}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "shoots" && (
          <PlaceholderSection
            icon="Clapperboard"
            title="Съёмки и производство"
            desc="Бюджеты и планирование производства видеоконтента, фотосессий и материалов"
          />
        )}
      </main>

      <footer className="border-t border-border mt-8 py-4">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>РнП Маркетинг · Контент · 2025</span>
          <span>Данные не сохраняются автоматически</span>
        </div>
      </footer>
    </div>
  );
}

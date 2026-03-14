import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { api } from "@/api";

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

// ─── Types ────────────────────────────────────────────────────────────────────
interface Client {
  id: number;
  name: string;
  segment: string;
  status: string;
  project: string;
  budget: number;
  leads: number;
  ltv: number;
  manager: string;
}

interface RfmSegment {
  id?: number;
  segment: string;
  clients_count: number;
  revenue: number;
  color: string;
  desc: string;
}

interface CjmStage {
  id?: number;
  stage: string;
  touchpoint: string;
  emotion: string;
  action: string;
  problem: string;
  solution: string;
  metric: string;
}

// ─── RFM color fallback map ────────────────────────────────────────────────────
const RFM_COLOR_MAP: Record<string, string> = {
  "Чемпионы": "bg-green-100 text-green-700",
  "Лояльные": "bg-blue-100 text-blue-700",
  "Потенциальные": "bg-yellow-100 text-yellow-700",
  "Под угрозой": "bg-orange-100 text-orange-700",
  "Потерянные": "bg-red-100 text-red-700",
};

const ANALYTICS_TABS = [
  { id: "clients", label: "Клиенты и проекты", icon: "Users" },
  { id: "rfm", label: "RFM-анализ", icon: "BarChart3" },
  { id: "cjm", label: "CJM", icon: "GitBranch" },
] as const;
type ATabId = typeof ANALYTICS_TABS[number]["id"];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Активный": "bg-green-100 text-green-700",
    "Завершён": "bg-gray-100 text-gray-600",
    "Новый": "bg-blue-100 text-blue-700",
    "Пауза": "bg-yellow-100 text-yellow-700",
  };
  return <span className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium ${map[status] ?? "bg-muted text-muted-foreground"}`}>{status}</span>;
}

// ─── Inline Add Client Form ────────────────────────────────────────────────────
interface AddClientFormProps {
  onAdd: (client: Omit<Client, "id">) => void;
  onCancel: () => void;
}

function AddClientForm({ onAdd, onCancel }: AddClientFormProps) {
  const [form, setForm] = useState({
    name: "",
    segment: "B2B",
    status: "Новый",
    project: "",
    budget: "",
    leads: "",
    ltv: "",
    manager: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onAdd({
      name: form.name.trim(),
      segment: form.segment,
      status: form.status,
      project: form.project.trim(),
      budget: Number(form.budget) || 0,
      leads: Number(form.leads) || 0,
      ltv: Number(form.ltv) || 0,
      manager: form.manager.trim(),
    });
  };

  const field = (key: keyof typeof form, placeholder: string, type = "text") => (
    <input
      type={type}
      placeholder={placeholder}
      value={form[key]}
      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
      className="px-2 py-1.5 border border-border rounded text-xs bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary/50 w-full"
    />
  );

  return (
    <tr className="bg-primary/5 border-b border-primary/20">
      <td className="px-2 py-2">{field("name", "Название *")}</td>
      <td className="px-2 py-2">
        <select
          value={form.segment}
          onChange={(e) => setForm((f) => ({ ...f, segment: e.target.value }))}
          className="px-2 py-1.5 border border-border rounded text-xs bg-background text-foreground outline-none focus:ring-1 focus:ring-primary/50 w-full"
        >
          <option>B2B</option>
          <option>B2C</option>
        </select>
      </td>
      <td className="px-2 py-2">{field("project", "Проект")}</td>
      <td className="px-2 py-2">
        <select
          value={form.status}
          onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
          className="px-2 py-1.5 border border-border rounded text-xs bg-background text-foreground outline-none focus:ring-1 focus:ring-primary/50 w-full"
        >
          <option>Новый</option>
          <option>Активный</option>
          <option>Пауза</option>
          <option>Завершён</option>
        </select>
      </td>
      <td className="px-2 py-2">{field("budget", "Бюджет", "number")}</td>
      <td className="px-2 py-2">{field("leads", "Лиды", "number")}</td>
      <td className="px-2 py-2">{field("ltv", "LTV", "number")}</td>
      <td className="px-2 py-2">{field("manager", "Менеджер")}</td>
      <td className="px-2 py-2">
        <div className="flex gap-1">
          <button
            onClick={handleSubmit}
            className="px-2 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90 transition-colors"
          >
            Сохранить
          </button>
          <button
            onClick={onCancel}
            className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded hover:bg-muted/70 transition-colors"
          >
            Отмена
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function Analytics() {
  const [activeTab, setActiveTab] = useState<ATabId>("clients");

  // ── Clients state ──────────────────────────────────────────────────────────
  const [clients, setClients] = useState<Client[]>([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // ── RFM state ──────────────────────────────────────────────────────────────
  const [rfmData, setRfmData] = useState<RfmSegment[]>([]);
  const [rfmLoading, setRfmLoading] = useState(false);

  // ── CJM state ──────────────────────────────────────────────────────────────
  const [cjmStages, setCjmStages] = useState<CjmStage[]>([]);
  const [cjmLoading, setCjmLoading] = useState(false);

  // ── Load data when tab changes ─────────────────────────────────────────────
  useEffect(() => {
    if (activeTab === "clients" && clients.length === 0) {
      setClientsLoading(true);
      api.get("clients")
        .then((data) => setClients(Array.isArray(data) ? data : []))
        .catch(() => setClients([]))
        .finally(() => setClientsLoading(false));
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "rfm" && rfmData.length === 0) {
      setRfmLoading(true);
      api.get("rfm")
        .then((data) => setRfmData(Array.isArray(data) ? data : []))
        .catch(() => setRfmData([]))
        .finally(() => setRfmLoading(false));
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "cjm" && cjmStages.length === 0) {
      setCjmLoading(true);
      api.get("cjm")
        .then((data) => setCjmStages(Array.isArray(data) ? data : []))
        .catch(() => setCjmStages([]))
        .finally(() => setCjmLoading(false));
    }
  }, [activeTab]);

  // ── Client actions ─────────────────────────────────────────────────────────
  const handleAddClient = async (body: Omit<Client, "id">) => {
    const created = await api.post("clients", body);
    setClients((prev) => [...prev, created]);
    setShowAddForm(false);
  };

  const handleDeleteClient = async (id: number) => {
    await api.delete("clients", id);
    setClients((prev) => prev.filter((c) => c.id !== id));
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
              <span className="text-xs text-muted-foreground hidden sm:block">Аналитика</span>
            </div>
            <TopNav active="/analytics" />
          </div>
        </div>
      </header>

      <div className="bg-card border-b border-border">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
          <div className="flex gap-0 overflow-x-auto">
            {ANALYTICS_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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

        {/* Clients */}
        {activeTab === "clients" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-base font-bold text-foreground">Клиенты и проекты</h1>
                <p className="text-xs text-muted-foreground mt-0.5">Сводная таблица по всем клиентам</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-md bg-background">
                  <Icon name="Search" size={12} className="text-muted-foreground" />
                  <input placeholder="Поиск клиента..." className="text-xs outline-none bg-transparent w-36 text-foreground placeholder:text-muted-foreground" />
                </div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  <Icon name="Plus" size={13} />
                  Добавить
                </button>
              </div>
            </div>

            {clientsLoading ? (
              <div className="text-xs text-muted-foreground py-8 text-center">Загрузка...</div>
            ) : (
              <>
                {/* Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Всего клиентов", value: String(clients.length), icon: "Users" },
                    { label: "Активных", value: String(clients.filter(c => c.status === "Активный").length), icon: "CheckCircle" },
                    { label: "Общий бюджет", value: `${(clients.reduce((s, c) => s + (c.budget || 0), 0) / 1000).toFixed(0)} тыс ₽`, icon: "Wallet" },
                    { label: "Совокупный LTV", value: `${(clients.reduce((s, c) => s + (c.ltv || 0), 0) / 1000000).toFixed(1)} млн ₽`, icon: "TrendingUp" },
                  ].map((kpi) => (
                    <div key={kpi.label} className="bg-card border border-border rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                        <Icon name={kpi.icon as "Activity"} size={11} />
                        {kpi.label}
                      </div>
                      <div className="font-mono text-lg font-bold text-foreground">{kpi.value}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-muted/40">
                        <tr className="border-b border-border">
                          <th className="text-left px-4 py-3 font-medium text-muted-foreground">Клиент</th>
                          <th className="text-left px-4 py-3 font-medium text-muted-foreground">Сегмент</th>
                          <th className="text-left px-4 py-3 font-medium text-muted-foreground">Проект</th>
                          <th className="text-left px-4 py-3 font-medium text-muted-foreground">Статус</th>
                          <th className="text-right px-4 py-3 font-medium text-muted-foreground">Бюджет</th>
                          <th className="text-right px-4 py-3 font-medium text-muted-foreground">Лиды</th>
                          <th className="text-right px-4 py-3 font-medium text-muted-foreground">LTV</th>
                          <th className="text-left px-4 py-3 font-medium text-muted-foreground">Менеджер</th>
                          <th className="px-4 py-3" />
                        </tr>
                      </thead>
                      <tbody>
                        {showAddForm && (
                          <AddClientForm
                            onAdd={handleAddClient}
                            onCancel={() => setShowAddForm(false)}
                          />
                        )}
                        {clients.map((c) => (
                          <tr key={c.id} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                            <td className="px-4 py-3 font-medium text-foreground">{c.name}</td>
                            <td className="px-4 py-3 text-muted-foreground">{c.segment}</td>
                            <td className="px-4 py-3 text-foreground">{c.project}</td>
                            <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                            <td className="px-4 py-3 text-right font-mono text-foreground">{(c.budget || 0).toLocaleString("ru-RU")} ₽</td>
                            <td className="px-4 py-3 text-right font-mono text-foreground">{c.leads}</td>
                            <td className="px-4 py-3 text-right font-mono font-semibold text-foreground">{(c.ltv || 0).toLocaleString("ru-RU")} ₽</td>
                            <td className="px-4 py-3 text-muted-foreground">{c.manager}</td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleDeleteClient(c.id)}
                                className="p-1 rounded text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                                title="Удалить клиента"
                              >
                                <Icon name="Trash2" size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-muted/40">
                        <tr className="border-t border-border">
                          <td colSpan={4} className="px-4 py-2.5 font-semibold text-xs text-muted-foreground">Итого</td>
                          <td className="px-4 py-2.5 text-right font-mono font-bold text-foreground">
                            {clients.reduce((s, c) => s + (c.budget || 0), 0).toLocaleString("ru-RU")} ₽
                          </td>
                          <td className="px-4 py-2.5 text-right font-mono font-bold text-foreground">
                            {clients.reduce((s, c) => s + (c.leads || 0), 0)}
                          </td>
                          <td className="px-4 py-2.5 text-right font-mono font-bold text-foreground">
                            {clients.reduce((s, c) => s + (c.ltv || 0), 0).toLocaleString("ru-RU")} ₽
                          </td>
                          <td />
                          <td />
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* RFM */}
        {activeTab === "rfm" && (
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-base font-bold text-foreground">RFM-анализ</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Сегментация клиентов по Recency · Frequency · Monetary</p>
            </div>

            {rfmLoading ? (
              <div className="text-xs text-muted-foreground py-8 text-center">Загрузка...</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {rfmData.map((seg) => {
                    const colorClass = seg.color || RFM_COLOR_MAP[seg.segment] || "bg-muted text-muted-foreground";
                    return (
                      <div key={seg.segment} className="bg-card border border-border rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className={`inline-flex px-2 py-1 rounded-md text-xs font-semibold ${colorClass}`}>{seg.segment}</span>
                          <span className="font-mono text-sm font-bold text-foreground">{seg.clients_count} клиентов</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">{seg.desc}</p>
                        <div className="flex items-center justify-between border-t border-border/40 pt-2">
                          <span className="text-xs text-muted-foreground">Выручка</span>
                          <span className="font-mono text-sm font-bold text-foreground">{(seg.revenue || 0).toLocaleString("ru-RU")} ₽</span>
                        </div>
                      </div>
                    );
                  })}
                  <div className="bg-card border border-border rounded-xl p-4 flex flex-col justify-center items-center gap-2 text-center">
                    <Icon name="Plus" size={20} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Добавить сегмент</span>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-border/60 flex items-center gap-2">
                    <Icon name="BarChart3" size={14} className="text-primary" />
                    <span className="font-semibold text-sm text-foreground">Детализация по сегментам</span>
                  </div>
                  <table className="w-full text-xs">
                    <thead className="bg-muted/40">
                      <tr className="border-b border-border">
                        <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Сегмент</th>
                        <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Клиентов</th>
                        <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Выручка</th>
                        <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Доля</th>
                        <th className="px-4 py-2.5" />
                      </tr>
                    </thead>
                    <tbody>
                      {rfmData.map((seg) => {
                        const totalRevenue = rfmData.reduce((s, r) => s + (r.revenue || 0), 0);
                        const pct = totalRevenue > 0 ? Math.round(((seg.revenue || 0) / totalRevenue) * 100) : 0;
                        const colorClass = seg.color || RFM_COLOR_MAP[seg.segment] || "bg-muted text-muted-foreground";
                        return (
                          <tr key={seg.segment} className="border-b border-border/30 last:border-0 hover:bg-muted/20">
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}>{seg.segment}</span>
                            </td>
                            <td className="px-4 py-3 text-right font-mono text-foreground">{seg.clients_count}</td>
                            <td className="px-4 py-3 text-right font-mono font-semibold text-foreground">{(seg.revenue || 0).toLocaleString("ru-RU")} ₽</td>
                            <td className="px-4 py-3 text-right font-mono text-foreground">{pct}%</td>
                            <td className="px-4 py-3">
                              <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden ml-auto">
                                <div className="h-full rounded-full bg-primary/50" style={{ width: `${pct}%` }} />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* CJM */}
        {activeTab === "cjm" && (
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-base font-bold text-foreground">Customer Journey Map</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Путь клиента от осведомлённости до удержания</p>
            </div>

            {cjmLoading ? (
              <div className="text-xs text-muted-foreground py-8 text-center">Загрузка...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[900px]">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border">
                      {["Этап", "Точка касания", "Эмоция", "Действие", "Проблема", "Решение", "Метрика"].map((h) => (
                        <th key={h} className="text-left px-3 py-3 font-medium text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cjmStages.map((row, i) => {
                      const stageColors = ["bg-blue-50", "bg-purple-50", "bg-yellow-50", "bg-green-50", "bg-teal-50"];
                      return (
                        <tr key={row.id ?? i} className={`border-b border-border/30 last:border-0 ${stageColors[i % stageColors.length]}`}>
                          <td className="px-3 py-3 font-semibold text-foreground">{row.stage}</td>
                          <td className="px-3 py-3 text-foreground">{row.touchpoint}</td>
                          <td className="px-3 py-3 text-foreground">{row.emotion}</td>
                          <td className="px-3 py-3 text-foreground">{row.action}</td>
                          <td className="px-3 py-3 text-red-500">{row.problem}</td>
                          <td className="px-3 py-3 text-green-600">{row.solution}</td>
                          <td className="px-3 py-3 font-mono font-semibold text-foreground">{row.metric}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-8 py-4">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>РнП Маркетинг · Аналитика · 2025</span>
          <span>Данные не сохраняются автоматически</span>
        </div>
      </footer>
    </div>
  );
}

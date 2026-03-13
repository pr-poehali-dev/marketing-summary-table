import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

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

// ─── Mock данные ─────────────────────────────────────────────────────────────
const CLIENTS = [
  { id: 1, name: "ООО Альфа", segment: "B2B", status: "Активный", project: "Запуск Q1", budget: 350000, leads: 28, ltv: 980000, manager: "Иванова А." },
  { id: 2, name: "ИП Петров", segment: "B2C", status: "Активный", project: "SMM Тариф", budget: 45000, leads: 74, ltv: 135000, manager: "Сидоров К." },
  { id: 3, name: "ООО Бета", segment: "B2B", status: "Завершён", project: "Ребрендинг", budget: 180000, leads: 12, ltv: 540000, manager: "Иванова А." },
  { id: 4, name: "ООО Гамма", segment: "B2B", status: "Новый", project: "Диагностика", budget: 90000, leads: 6, ltv: 270000, manager: "Козлов М." },
  { id: 5, name: "ИП Смирнова", segment: "B2C", status: "Активный", project: "Reels запуск", budget: 62000, leads: 41, ltv: 186000, manager: "Сидоров К." },
  { id: 6, name: "ООО Дельта", segment: "B2B", status: "Пауза", project: "Стратегия", budget: 120000, leads: 9, ltv: 360000, manager: "Козлов М." },
];

const RFM_DATA = [
  { segment: "Чемпионы", clients: 3, revenue: 1200000, color: "bg-green-100 text-green-700", desc: "Покупают часто, недавно и на крупные суммы" },
  { segment: "Лояльные", clients: 8, revenue: 840000, color: "bg-blue-100 text-blue-700", desc: "Регулярные клиенты с хорошей ценностью" },
  { segment: "Потенциальные", clients: 12, revenue: 520000, color: "bg-yellow-100 text-yellow-700", desc: "Недавние покупки, средняя частота" },
  { segment: "Под угрозой", clients: 5, revenue: 310000, color: "bg-orange-100 text-orange-700", desc: "Давно не покупали, ранее были активны" },
  { segment: "Потерянные", clients: 4, revenue: 90000, color: "bg-red-100 text-red-700", desc: "Давно нет активности" },
];

const CJM_STAGES = [
  { stage: "Осведомлённость", touchpoint: "Instagram / Reels", emotion: "Интерес", action: "Видит контент", problem: "Не знает о бренде", solution: "Посев через блогеров", metric: "Охват 64 500" },
  { stage: "Рассмотрение", touchpoint: "Сайт / Telegram", emotion: "Любопытство", action: "Читает, изучает", problem: "Не понимает ценность", solution: "Кейсы и отзывы", metric: "Визиты 3 870" },
  { stage: "Принятие решения", touchpoint: "Консультация", emotion: "Сомнение", action: "Задаёт вопросы", problem: "Страхи и возражения", solution: "Скрипт продаж", metric: "Лиды 209" },
  { stage: "Покупка", touchpoint: "CRM / Договор", emotion: "Доверие", action: "Оплачивает", problem: "Сложный процесс", solution: "Упрощение оплаты", metric: "Продажи 41" },
  { stage: "Удержание", touchpoint: "Email / TG-бот", emotion: "Удовлетворение", action: "Повторный контакт", problem: "Забывает о нас", solution: "Follow-up цепочка", metric: "LTV 4 500 ₽" },
];

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

export default function Analytics() {
  const [activeTab, setActiveTab] = useState<ATabId>("clients");

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
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                  <Icon name="Plus" size={13} />
                  Добавить
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Всего клиентов", value: String(CLIENTS.length), icon: "Users" },
                { label: "Активных", value: String(CLIENTS.filter(c => c.status === "Активный").length), icon: "CheckCircle" },
                { label: "Общий бюджет", value: `${(CLIENTS.reduce((s, c) => s + c.budget, 0) / 1000).toFixed(0)} тыс ₽`, icon: "Wallet" },
                { label: "Совокупный LTV", value: `${(CLIENTS.reduce((s, c) => s + c.ltv, 0) / 1000000).toFixed(1)} млн ₽`, icon: "TrendingUp" },
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
                    </tr>
                  </thead>
                  <tbody>
                    {CLIENTS.map((c) => (
                      <tr key={c.id} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 font-medium text-foreground">{c.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{c.segment}</td>
                        <td className="px-4 py-3 text-foreground">{c.project}</td>
                        <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                        <td className="px-4 py-3 text-right font-mono text-foreground">{c.budget.toLocaleString("ru-RU")} ₽</td>
                        <td className="px-4 py-3 text-right font-mono text-foreground">{c.leads}</td>
                        <td className="px-4 py-3 text-right font-mono font-semibold text-foreground">{c.ltv.toLocaleString("ru-RU")} ₽</td>
                        <td className="px-4 py-3 text-muted-foreground">{c.manager}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-muted/40">
                    <tr className="border-t border-border">
                      <td colSpan={4} className="px-4 py-2.5 font-semibold text-xs text-muted-foreground">Итого</td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold text-foreground">
                        {CLIENTS.reduce((s, c) => s + c.budget, 0).toLocaleString("ru-RU")} ₽
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold text-foreground">
                        {CLIENTS.reduce((s, c) => s + c.leads, 0)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold text-foreground">
                        {CLIENTS.reduce((s, c) => s + c.ltv, 0).toLocaleString("ru-RU")} ₽
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* RFM */}
        {activeTab === "rfm" && (
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-base font-bold text-foreground">RFM-анализ</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Сегментация клиентов по Recency · Frequency · Monetary</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {RFM_DATA.map((seg) => (
                <div key={seg.segment} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex px-2 py-1 rounded-md text-xs font-semibold ${seg.color}`}>{seg.segment}</span>
                    <span className="font-mono text-sm font-bold text-foreground">{seg.clients} клиентов</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{seg.desc}</p>
                  <div className="flex items-center justify-between border-t border-border/40 pt-2">
                    <span className="text-xs text-muted-foreground">Выручка</span>
                    <span className="font-mono text-sm font-bold text-foreground">{seg.revenue.toLocaleString("ru-RU")} ₽</span>
                  </div>
                </div>
              ))}
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
                  {RFM_DATA.map((seg) => {
                    const total = RFM_DATA.reduce((s, r) => s + seg.revenue, 0);
                    const pct = Math.round((seg.revenue / RFM_DATA.reduce((s, r) => s + r.revenue, 0)) * 100);
                    return (
                      <tr key={seg.segment} className="border-b border-border/30 last:border-0 hover:bg-muted/20">
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${seg.color}`}>{seg.segment}</span>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-foreground">{seg.clients}</td>
                        <td className="px-4 py-3 text-right font-mono font-semibold text-foreground">{seg.revenue.toLocaleString("ru-RU")} ₽</td>
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
          </div>
        )}

        {/* CJM */}
        {activeTab === "cjm" && (
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-base font-bold text-foreground">Customer Journey Map</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Путь клиента от осведомлённости до удержания</p>
            </div>
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
                  {CJM_STAGES.map((row, i) => {
                    const stageColors = ["bg-blue-50", "bg-purple-50", "bg-yellow-50", "bg-green-50", "bg-teal-50"];
                    return (
                      <tr key={i} className={`border-b border-border/30 last:border-0 ${stageColors[i]}`}>
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

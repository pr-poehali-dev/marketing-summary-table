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

const SWOT = {
  S: ["Сильная экспертиза команды", "Уникальная методология РНП", "Лояльная база клиентов", "Высокий NPS среди существующих клиентов"],
  W: ["Ограниченный маркетинговый бюджет", "Нет автоматизации воронки", "Зависимость от ключевых людей", "Слабое SEO-присутствие"],
  O: ["Рост спроса на performance-маркетинг", "Выход в новые ниши (EdTech, HealthTech)", "Партнёрства с блогерами", "Автоматизация через AI-инструменты"],
  T: ["Усиление конкурентов", "Нестабильность рекламных платформ", "Рост CPL в нише", "Копирование методологии"],
};

const PEST = [
  { factor: "Политические", items: ["Регуляция рекламного рынка", "Ограничения зарубежных платформ", "Законодательство о персональных данных"] },
  { factor: "Экономические", items: ["Инфляция снижает бюджеты клиентов", "Курс валют влияет на стоимость ПО", "Рост платёжеспособного спроса в B2B"] },
  { factor: "Социальные", items: ["Рост потребления видеоконтента", "Доверие к инфлюенсерам", "Цифровизация малого бизнеса"] },
  { factor: "Технологические", items: ["AI-генерация контента", "Алгоритмические изменения Instagram/TG", "Аналитические платформы нового поколения"] },
];

const SMART_GOALS = [
  { goal: "Увеличить охват на 30%", specific: "Запустить 4 коллаборации с блогерами", measurable: "+30% охват", achievable: "Да", relevant: "Рост узнаваемости", time: "Q2 2025", status: "В работе" },
  { goal: "Снизить CPL до 1 200 ₽", specific: "Оптимизировать воронку Instagram", measurable: "CPL ≤ 1 200 ₽", achievable: "Да", relevant: "Рост маржи", time: "Апрель 2025", status: "Новый" },
  { goal: "LTV/CAC ≥ 3", specific: "Внедрить Follow-up цепочку", measurable: "LTV/CAC ≥ 3", achievable: "Реалистично", relevant: "Юнит-экономика", time: "Q2 2025", status: "Планируется" },
];

const TA_SEGMENTS = [
  { name: "Собственники малого бизнеса", age: "30–45", geo: "Москва / СПб", pain: "Не понимают, работает ли маркетинг", income: "300–800 тыс/мес", channel: "Instagram, TG", size: "Высокий" },
  { name: "Маркетологи компаний", age: "25–38", geo: "Крупные города РФ", pain: "Нет инструмента для отчётности", income: "80–200 тыс/мес", channel: "LinkedIn, TG", size: "Средний" },
  { name: "Операционные директора", age: "35–50", geo: "Москва", pain: "Потеря денег на неэффективном маркетинге", income: "200–500 тыс/мес", channel: "Email, рекомендации", size: "Средний" },
];

const RESEARCH_TABS = [
  { id: "swot", label: "SWOT-анализ", icon: "Grid2X2" },
  { id: "pest", label: "PEST-анализ", icon: "Globe" },
  { id: "smart", label: "SMART-цели", icon: "Target" },
  { id: "ta", label: "Анализ ЦА", icon: "UserCircle" },
  { id: "brief", label: "Брифование", icon: "ClipboardList" },
  { id: "competitors", label: "Конкуренты", icon: "Swords" },
] as const;
type RTabId = typeof RESEARCH_TABS[number]["id"];

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

export default function Research() {
  const [activeTab, setActiveTab] = useState<RTabId>("swot");

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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([
                { key: "S", label: "Сильные стороны", color: "border-green-200 bg-green-50", head: "bg-green-100 text-green-800", icon: "ThumbsUp" },
                { key: "W", label: "Слабые стороны", color: "border-red-200 bg-red-50", head: "bg-red-100 text-red-800", icon: "ThumbsDown" },
                { key: "O", label: "Возможности", color: "border-blue-200 bg-blue-50", head: "bg-blue-100 text-blue-800", icon: "Lightbulb" },
                { key: "T", label: "Угрозы", color: "border-yellow-200 bg-yellow-50", head: "bg-yellow-100 text-yellow-800", icon: "AlertTriangle" },
              ] as const).map((q) => (
                <div key={q.key} className={`border rounded-xl overflow-hidden ${q.color}`}>
                  <div className={`px-4 py-2.5 flex items-center gap-2 ${q.head}`}>
                    <Icon name={q.icon as "Activity"} size={14} />
                    <span className="font-semibold text-sm">{q.key} — {q.label}</span>
                  </div>
                  <div className="p-4 flex flex-col gap-2">
                    {SWOT[q.key].map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-current opacity-50 shrink-0" />
                        <span className="text-foreground">{item}</span>
                      </div>
                    ))}
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-1 transition-colors">
                      <Icon name="Plus" size={11} /> Добавить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PEST */}
        {activeTab === "pest" && (
          <div className="flex flex-col gap-4">
            <h1 className="text-base font-bold text-foreground">PEST-анализ бренда</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PEST.map((p, i) => {
                const colors = ["bg-blue-50 border-blue-200", "bg-green-50 border-green-200", "bg-purple-50 border-purple-200", "bg-orange-50 border-orange-200"];
                const heads = ["bg-blue-100 text-blue-800", "bg-green-100 text-green-800", "bg-purple-100 text-purple-800", "bg-orange-100 text-orange-800"];
                return (
                  <div key={p.factor} className={`border rounded-xl overflow-hidden ${colors[i]}`}>
                    <div className={`px-4 py-2.5 font-semibold text-sm ${heads[i]}`}>{p.factor}</div>
                    <div className="p-4 flex flex-col gap-2">
                      {p.items.map((item, j) => (
                        <div key={j} className="flex items-start gap-2 text-sm">
                          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-current opacity-40 shrink-0" />
                          <span className="text-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SMART */}
        {activeTab === "smart" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-base font-bold text-foreground">SMART-цели</h1>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                <Icon name="Plus" size={13} /> Добавить цель
              </button>
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[800px]">
                  <thead className="bg-muted/40">
                    <tr className="border-b border-border">
                      {["Цель", "Specific", "Measurable", "Achievable", "Relevant", "Time", "Статус"].map((h) => (
                        <th key={h} className="text-left px-3 py-3 font-medium text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SMART_GOALS.map((g, i) => {
                      const statusColors: Record<string, string> = {
                        "В работе": "bg-blue-100 text-blue-700",
                        "Новый": "bg-gray-100 text-gray-600",
                        "Планируется": "bg-yellow-100 text-yellow-700",
                        "Выполнено": "bg-green-100 text-green-700",
                      };
                      return (
                        <tr key={i} className="border-b border-border/30 last:border-0 hover:bg-muted/20">
                          <td className="px-3 py-3 font-semibold text-foreground">{g.goal}</td>
                          <td className="px-3 py-3 text-foreground">{g.specific}</td>
                          <td className="px-3 py-3 font-mono text-foreground">{g.measurable}</td>
                          <td className="px-3 py-3 text-foreground">{g.achievable}</td>
                          <td className="px-3 py-3 text-foreground">{g.relevant}</td>
                          <td className="px-3 py-3 font-mono text-foreground">{g.time}</td>
                          <td className="px-3 py-3">
                            <span className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium ${statusColors[g.status] ?? "bg-muted text-muted-foreground"}`}>{g.status}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
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
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              {TA_SEGMENTS.map((seg, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
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

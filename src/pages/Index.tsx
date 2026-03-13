import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { TabKPI } from "@/components/marketing/TabKPI";
import { TabReport } from "@/components/marketing/TabCampaigns";
import { TabPulse } from "@/components/marketing/TabPulse";
import { TabFunnels } from "@/components/marketing/TabFunnels";

const TABS = [
  { id: "pulse", label: "РНП", icon: "Activity", desc: "Рука на Пульсе" },
  { id: "funnels", label: "Воронки", icon: "GitBranch", desc: "Оцифровка пути" },
  { id: "kpi", label: "Метрики", icon: "BarChart2", desc: "KPI и показатели" },
  { id: "report", label: "Отчёт", icon: "FileText", desc: "Итоги периода" },
] as const;

type TabId = typeof TABS[number]["id"];

export default function Index() {
  const [activeTab, setActiveTab] = useState<TabId>("pulse");
  const [title, setTitle] = useState("РНП Маркетинг");
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
                <Icon name="Activity" size={14} className="text-white" />
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
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-primary font-medium rounded-md bg-accent transition-colors">
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
          <div className="flex gap-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                <Icon name={tab.icon} size={14} />
                {tab.label}
                {activeTab === tab.id && (
                  <span className="text-xs font-normal text-primary/60 hidden sm:inline">{tab.desc}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === "pulse" && <TabPulse />}
        {activeTab === "funnels" && <TabFunnels />}
        {activeTab === "kpi" && <TabKPI />}
        {activeTab === "report" && <TabReport />}
      </main>

      <footer className="border-t border-border mt-8 py-4">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>{title} · {period}</span>
          <span>Данные не сохраняются автоматически</span>
        </div>
      </footer>
    </div>
  );
}
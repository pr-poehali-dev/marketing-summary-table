import { useState } from "react";
import Icon from "@/components/ui/icon";

// ─── TYPES ────────────────────────────────────────────────────────────────────

type WeekData = { plan: string; fact: string };
type RowData = {
  id: string;
  label: string;
  unit: string;
  monthPlan: string;
  monthFact: string;
  weeks: WeekData[]; // 4 weeks
  isHeader?: boolean;
  isConversion?: boolean;
};

// ─── INITIAL DATA ─────────────────────────────────────────────────────────────

function makeWeeks(): WeekData[] {
  return [
    { plan: "", fact: "" },
    { plan: "", fact: "" },
    { plan: "", fact: "" },
    { plan: "", fact: "" },
  ];
}

const SECTIONS: { title: string; rows: Omit<RowData, "weeks">[] }[] = [
  {
    title: "Маркетинг общий",
    rows: [
      { id: "budget", label: "Рекламный бюджет", unit: "₽", monthPlan: "", monthFact: "", isConversion: false },
      { id: "reach", label: "Количество охватов", unit: "чел.", monthPlan: "", monthFact: "" },
      { id: "cv_sub", label: "CV конверсия в подписку", unit: "%", monthPlan: "", monthFact: "", isConversion: true },
      { id: "subs", label: "Количество подписчиков", unit: "шт.", monthPlan: "", monthFact: "" },
      { id: "cps", label: "Цена подписчика", unit: "₽", monthPlan: "", monthFact: "" },
      { id: "shows", label: "Количество показов посадочной", unit: "шт.", monthPlan: "", monthFact: "" },
      { id: "cv_click", label: "CV конверсия в клик", unit: "%", monthPlan: "", monthFact: "", isConversion: true },
      { id: "clicks", label: "Количество кликов", unit: "шт.", monthPlan: "", monthFact: "" },
      { id: "cv_lead", label: "CV конверсия в лид", unit: "%", monthPlan: "", monthFact: "", isConversion: true },
      { id: "leads", label: "Кол-во лидов", unit: "шт.", monthPlan: "", monthFact: "" },
      { id: "cv_qual", label: "CV конверсия в квал", unit: "%", monthPlan: "", monthFact: "", isConversion: true },
      { id: "ql", label: "Кол-во КВАЛ лидов", unit: "шт.", monthPlan: "", monthFact: "" },
      { id: "cv_sale", label: "CV конверсия в продажу", unit: "%", monthPlan: "", monthFact: "", isConversion: true },
      { id: "sales", label: "Количество продаж", unit: "шт.", monthPlan: "", monthFact: "" },
      { id: "revenue", label: "Оборот с рекламы", unit: "₽", monthPlan: "", monthFact: "" },
      { id: "avg_check", label: "Средний чек", unit: "₽", monthPlan: "", monthFact: "" },
      { id: "cpc", label: "Цена клика", unit: "₽", monthPlan: "", monthFact: "" },
      { id: "cpl", label: "Цена лида", unit: "₽", monthPlan: "", monthFact: "" },
      { id: "cpql", label: "Цена квал лида", unit: "₽", monthPlan: "", monthFact: "" },
      { id: "pay_pct", label: "Процент в оплату", unit: "%", monthPlan: "", monthFact: "", isConversion: true },
      { id: "romi", label: "ROMI", unit: "%", monthPlan: "", monthFact: "" },
      { id: "roi", label: "ROI", unit: "%", monthPlan: "", monthFact: "" },
    ],
  },
  {
    title: "Telegram — Посевы — Воронка",
    rows: [
      { id: "tg_budget", label: "Рекламный бюджет", unit: "₽", monthPlan: "", monthFact: "" },
      { id: "tg_cpm", label: "CPM", unit: "₽", monthPlan: "", monthFact: "" },
      { id: "tg_reach", label: "Количество охватов", unit: "чел.", monthPlan: "", monthFact: "" },
      { id: "tg_cv_click", label: "CV конверсия в клик", unit: "%", monthPlan: "", monthFact: "", isConversion: true },
      { id: "tg_cv_lead", label: "CV конверсия в лид", unit: "%", monthPlan: "", monthFact: "", isConversion: true },
      { id: "tg_cv_qual", label: "CV конверсия в квал", unit: "%", monthPlan: "", monthFact: "", isConversion: true },
      { id: "tg_cv_sale", label: "CV конверсия в продажу", unit: "%", monthPlan: "", monthFact: "", isConversion: true },
      { id: "tg_clicks", label: "Количество кликов", unit: "шт.", monthPlan: "", monthFact: "" },
      { id: "tg_leads", label: "Количество лидов", unit: "шт.", monthPlan: "", monthFact: "" },
      { id: "tg_qual", label: "Количество в квал", unit: "шт.", monthPlan: "", monthFact: "" },
      { id: "tg_sales", label: "Количество в продажу", unit: "шт.", monthPlan: "", monthFact: "" },
      { id: "tg_avg", label: "Средний чек", unit: "₽", monthPlan: "", monthFact: "" },
      { id: "tg_sum", label: "Сумма в продажу", unit: "₽", monthPlan: "", monthFact: "" },
      { id: "tg_cpc", label: "Цена клика", unit: "₽", monthPlan: "", monthFact: "" },
      { id: "tg_cpl", label: "Цена лида", unit: "₽", monthPlan: "", monthFact: "" },
      { id: "tg_cpq", label: "Цена квала", unit: "₽", monthPlan: "", monthFact: "" },
      { id: "tg_cps2", label: "Цена в продажу", unit: "₽", monthPlan: "", monthFact: "" },
      { id: "tg_drr", label: "ДРР", unit: "%", monthPlan: "", monthFact: "" },
      { id: "tg_cv_sub", label: "Конверсия в подписку", unit: "%", monthPlan: "", monthFact: "", isConversion: true },
      { id: "tg_subs", label: "Количество в подписку", unit: "шт.", monthPlan: "", monthFact: "" },
    ],
  },
  {
    title: "Telegram Ads",
    rows: [
      { id: "ta_budget", label: "Рекламный бюджет", unit: "₽", monthPlan: "", monthFact: "" },
      { id: "ta_reach", label: "Количество охватов", unit: "чел.", monthPlan: "", monthFact: "" },
      { id: "ta_cv_sub", label: "CV конверсия в подписку", unit: "%", monthPlan: "", monthFact: "", isConversion: true },
      { id: "ta_subs", label: "Количество подписчиков", unit: "шт.", monthPlan: "", monthFact: "" },
      { id: "ta_cps", label: "Цена подписчика", unit: "₽", monthPlan: "", monthFact: "" },
      { id: "ta_pct_reach", label: "Процент охватов от подписчика", unit: "%", monthPlan: "", monthFact: "" },
      { id: "ta_new", label: "Новые охваты", unit: "чел.", monthPlan: "", monthFact: "" },
      { id: "ta_apps", label: "Заявки в АП", unit: "шт.", monthPlan: "", monthFact: "" },
      { id: "ta_reach_pct", label: "Процент доходимости до закрытого канала", unit: "%", monthPlan: "", monthFact: "" },
      { id: "ta_do", label: "Количество доходимости", unit: "шт.", monthPlan: "", monthFact: "" },
      { id: "ta_ap_pct", label: "Процент в АП от подписчиков", unit: "%", monthPlan: "", monthFact: "" },
    ],
  },
  {
    title: "YouTube",
    rows: [
      { id: "yt_budget", label: "Рекламный бюджет", unit: "₽", monthPlan: "", monthFact: "" },
      { id: "yt_views", label: "Просмотры", unit: "шт.", monthPlan: "", monthFact: "" },
      { id: "yt_reach", label: "Охват", unit: "чел.", monthPlan: "", monthFact: "" },
      { id: "yt_cv_click", label: "CV конверсия в клик", unit: "%", monthPlan: "", monthFact: "", isConversion: true },
      { id: "yt_clicks", label: "Клики", unit: "шт.", monthPlan: "", monthFact: "" },
      { id: "yt_cv_lead", label: "CV конверсия в лид", unit: "%", monthPlan: "", monthFact: "", isConversion: true },
      { id: "yt_leads", label: "Лиды", unit: "шт.", monthPlan: "", monthFact: "" },
      { id: "yt_cpl", label: "Цена лида", unit: "₽", monthPlan: "", monthFact: "" },
    ],
  },
  {
    title: "Яндекс.Директ",
    rows: [
      { id: "yd_budget", label: "Рекламный бюджет", unit: "₽", monthPlan: "", monthFact: "" },
      { id: "yd_shows", label: "Показы", unit: "шт.", monthPlan: "", monthFact: "" },
      { id: "yd_clicks", label: "Клики", unit: "шт.", monthPlan: "", monthFact: "" },
      { id: "yd_ctr", label: "CTR", unit: "%", monthPlan: "", monthFact: "", isConversion: true },
      { id: "yd_cpc", label: "Цена клика", unit: "₽", monthPlan: "", monthFact: "" },
      { id: "yd_cv_lead", label: "CV конверсия в лид", unit: "%", monthPlan: "", monthFact: "", isConversion: true },
      { id: "yd_leads", label: "Лиды", unit: "шт.", monthPlan: "", monthFact: "" },
      { id: "yd_cpl", label: "Цена лида", unit: "₽", monthPlan: "", monthFact: "" },
    ],
  },
  {
    title: "Контент / SEO / Органика",
    rows: [
      { id: "seo_traffic", label: "Органический трафик", unit: "чел.", monthPlan: "", monthFact: "" },
      { id: "seo_pos", label: "Позиции в поиске (топ-10)", unit: "шт.", monthPlan: "", monthFact: "" },
      { id: "seo_leads", label: "Лиды из органики", unit: "шт.", monthPlan: "", monthFact: "" },
      { id: "seo_cpl", label: "Цена лида", unit: "₽", monthPlan: "", monthFact: "" },
      { id: "seo_pub", label: "Публикаций контента", unit: "шт.", monthPlan: "", monthFact: "" },
    ],
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function pct(plan: string, fact: string): { val: number | null; color: string; label: string } {
  const p = parseFloat(plan.replace(/\s/g, "").replace(",", "."));
  const f = parseFloat(fact.replace(/\s/g, "").replace(",", "."));
  if (isNaN(p) || isNaN(f) || p === 0) return { val: null, color: "text-muted-foreground", label: "—" };
  const v = Math.round((f / p) * 100);
  const color = v >= 100 ? "text-emerald-600 font-semibold" : v >= 70 ? "text-amber-600" : "text-red-500";
  return { val: v, color, label: `${v}%` };
}

function NumCell({
  value, onChange, placeholder = "", isConversion = false,
}: { value: string; onChange: (v: string) => void; placeholder?: string; isConversion?: boolean }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-transparent border-0 outline-none text-xs font-mono px-1.5 py-1 text-right focus:bg-accent/60 rounded transition-colors placeholder:text-muted-foreground/30 ${isConversion ? "text-blue-700 dark:text-blue-400" : ""}`}
    />
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────

type Collapsed = Record<string, boolean>;

const WEEK_LABELS = ["Нед 1", "Нед 2", "Нед 3", "Нед 4"];

type PulseRow = RowData;
type SectionState = { title: string; rows: PulseRow[] };

function initState(): SectionState[] {
  return SECTIONS.map((s) => ({
    title: s.title,
    rows: s.rows.map((r) => ({ ...r, weeks: makeWeeks() })),
  }));
}

export function TabPulse() {
  const [month, setMonth] = useState("Март 2025");
  const [sections, setSections] = useState<SectionState[]>(initState);
  const [collapsed, setCollapsed] = useState<Collapsed>({});
  const [showWeeks, setShowWeeks] = useState(true);
  const [activeWeek, setActiveWeek] = useState(0); // which week is "current"

  const toggleSection = (title: string) =>
    setCollapsed((c) => ({ ...c, [title]: !c[title] }));

  const updateRow = (
    sIdx: number, rIdx: number,
    field: "monthPlan" | "monthFact" | "weekPlan" | "weekFact",
    weekIdx: number,
    val: string,
  ) => {
    setSections((ss) =>
      ss.map((s, si) =>
        si !== sIdx ? s : {
          ...s,
          rows: s.rows.map((r, ri) => {
            if (ri !== rIdx) return r;
            if (field === "monthPlan") return { ...r, monthPlan: val };
            if (field === "monthFact") return { ...r, monthFact: val };
            const weeks = r.weeks.map((w, wi) =>
              wi !== weekIdx ? w :
                field === "weekPlan" ? { ...w, plan: val } : { ...w, fact: val }
            );
            return { ...r, weeks };
          }),
        }
      )
    );
  };

  const weekCount = showWeeks ? 4 : 0;
  const totalCols = 4 + weekCount * 3; // row# + metric + monthPlan+Fact+% + weeks*(plan+fact+%)

  return (
    <div className="animate-fade-in">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base font-semibold">Рука на Пульсе</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Общий маркетинг и каналы — план / факт / % выполнения</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            className="border border-border rounded px-2 py-1.5 text-sm font-medium w-36 focus:outline-none focus:ring-1 focus:ring-primary bg-card"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            placeholder="Месяц год"
          />
          <button
            onClick={() => setShowWeeks((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border transition-colors ${showWeeks ? "bg-primary text-white border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground"}`}
          >
            <Icon name="CalendarDays" size={13} />
            Недели
          </button>
          {showWeeks && (
            <div className="flex items-center gap-1">
              {WEEK_LABELS.map((l, i) => (
                <button
                  key={i}
                  onClick={() => setActiveWeek(i)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${activeWeek === i ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="text-xs border-collapse" style={{ minWidth: showWeeks ? 1100 : 600 }}>
          {/* THEAD */}
          <thead>
            {/* Month header */}
            <tr className="bg-[#1a3557] text-white">
              <th className="w-7 px-2 py-2 border-b border-white/10" rowSpan={2} />
              <th className="text-left px-3 py-2 border-b border-white/10 font-semibold text-sm" rowSpan={2}>
                Ключевые метрики
              </th>
              <th className="px-3 py-2 text-center font-semibold border-b border-white/10 border-l border-l-white/20" colSpan={3}>
                {month}
              </th>
              {showWeeks && WEEK_LABELS.map((l, i) => (
                <th
                  key={i}
                  colSpan={3}
                  className={`px-3 py-2 text-center font-medium border-b border-white/10 border-l border-l-white/20 ${i === activeWeek ? "bg-[#2a4d77]" : "opacity-70"}`}
                >
                  {l}
                </th>
              ))}
            </tr>
            <tr className="bg-[#1a3557] text-white/80">
              <th className="w-24 px-2 py-1.5 text-center font-medium border-b border-white/10 border-l border-l-white/20">План</th>
              <th className="w-24 px-2 py-1.5 text-center font-medium border-b border-white/10">Факт</th>
              <th className="w-14 px-2 py-1.5 text-center font-medium border-b border-white/10">%</th>
              {showWeeks && WEEK_LABELS.map((_, i) => (
                <>
                  <th key={`${i}p`} className={`w-20 px-2 py-1.5 text-center font-medium border-b border-white/10 border-l border-l-white/20 ${i === activeWeek ? "" : "opacity-70"}`}>План</th>
                  <th key={`${i}f`} className={`w-20 px-2 py-1.5 text-center font-medium border-b border-white/10 ${i === activeWeek ? "" : "opacity-70"}`}>Факт</th>
                  <th key={`${i}pct`} className={`w-12 px-2 py-1.5 text-center font-medium border-b border-white/10 ${i === activeWeek ? "" : "opacity-70"}`}>%</th>
                </>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {sections.map((section, sIdx) => {
              const isCollapsed = collapsed[section.title];
              return (
                <>
                  {/* Section header row */}
                  <tr
                    key={`header-${sIdx}`}
                    className="bg-[#2c3e50] text-white cursor-pointer hover:bg-[#34495e] transition-colors"
                    onClick={() => toggleSection(section.title)}
                  >
                    <td className="px-2 py-1.5 text-center">
                      <Icon
                        name={isCollapsed ? "ChevronRight" : "ChevronDown"}
                        size={12}
                        className="text-white/70 inline"
                      />
                    </td>
                    <td
                      className="px-3 py-1.5 font-semibold text-sm"
                      colSpan={totalCols}
                    >
                      {section.title}
                    </td>
                  </tr>

                  {/* Data rows */}
                  {!isCollapsed && section.rows.map((row, rIdx) => {
                    const mPct = pct(row.monthPlan, row.monthFact);
                    const isEven = rIdx % 2 === 0;
                    return (
                      <tr
                        key={`${sIdx}-${rIdx}`}
                        className={`${isEven ? "bg-background" : "bg-muted/20"} hover:bg-accent/40 transition-colors`}
                      >
                        <td className="px-2 py-0.5 text-center text-muted-foreground/40 border-b border-border/40">
                          {rIdx + 1}
                        </td>
                        <td className={`px-3 py-0.5 border-b border-border/40 whitespace-nowrap ${row.isConversion ? "text-blue-700 dark:text-blue-400 font-medium" : ""}`}>
                          {row.label}
                        </td>
                        {/* Month plan */}
                        <td className="border-b border-border/40 border-l border-l-border/40">
                          <NumCell
                            value={row.monthPlan}
                            onChange={(v) => updateRow(sIdx, rIdx, "monthPlan", 0, v)}
                            isConversion={row.isConversion}
                          />
                        </td>
                        {/* Month fact */}
                        <td className="border-b border-border/40">
                          <NumCell
                            value={row.monthFact}
                            onChange={(v) => updateRow(sIdx, rIdx, "monthFact", 0, v)}
                            isConversion={row.isConversion}
                          />
                        </td>
                        {/* Month % */}
                        <td className="border-b border-border/40 text-center px-1">
                          {mPct.val !== null ? (
                            <span className={`text-xs font-mono ${mPct.color}`}>{mPct.label}</span>
                          ) : (
                            <span className="text-muted-foreground/30 text-xs">—</span>
                          )}
                        </td>
                        {/* Weeks */}
                        {showWeeks && row.weeks.map((w, wi) => {
                          const wPct = pct(w.plan, w.fact);
                          const isActive = wi === activeWeek;
                          return (
                            <>
                              <td key={`${wi}p`} className={`border-b border-border/40 border-l border-l-border/40 ${isActive ? "bg-primary/5" : "opacity-60"}`}>
                                <NumCell
                                  value={w.plan}
                                  onChange={(v) => updateRow(sIdx, rIdx, "weekPlan", wi, v)}
                                  isConversion={row.isConversion}
                                />
                              </td>
                              <td key={`${wi}f`} className={`border-b border-border/40 ${isActive ? "bg-primary/5" : "opacity-60"}`}>
                                <NumCell
                                  value={w.fact}
                                  onChange={(v) => updateRow(sIdx, rIdx, "weekFact", wi, v)}
                                  isConversion={row.isConversion}
                                />
                              </td>
                              <td key={`${wi}pct`} className={`border-b border-border/40 text-center px-1 ${isActive ? "bg-primary/5" : "opacity-60"}`}>
                                {wPct.val !== null ? (
                                  <span className={`text-xs font-mono ${wPct.color}`}>{wPct.label}</span>
                                ) : (
                                  <span className="text-muted-foreground/30 text-xs">—</span>
                                )}
                              </td>
                            </>
                          );
                        })}
                      </tr>
                    );
                  })}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Синим выделены конверсионные метрики. % считается автоматически из план / факт.
      </p>
    </div>
  );
}

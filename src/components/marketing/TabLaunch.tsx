import { useState } from "react";
import Icon from "@/components/ui/icon";

// ─── TYPES ────────────────────────────────────────────────────────────────────

type PlanRow = { id: string; date: string; stage: string; plan: string };
type RegRow = { id: string; source: string; plan: string; fact: string };
type DecompStep = { id: string; label: string; value: string; isConversion?: boolean; isResult?: boolean };
type TrafficRow = { id: string; dates: string; budget: string; audience: string; price: string; subsCount: string; payback: string };

type Launch = {
  id: string;
  name: string;
  goalRevenue: string;
  // план запуска
  planRows: PlanRow[];
  // декомпозиция регистраций
  regRows: RegRow[];
  regTotal: string;
  // декомпозиция воронки
  funnelSteps: DecompStep[];
  // декомпозиция трафика
  trafficRows: TrafficRow[];
};

// ─── TEMPLATES ────────────────────────────────────────────────────────────────

const DEFAULT_FUNNEL: Omit<DecompStep, "id">[] = [
  { label: "Кол-во подписчиков / база", value: "" },
  { label: "Средние охваты", value: "" },
  { label: "Регистраций", value: "" },
  { label: "CV рег → охват", value: "", isConversion: true },
  { label: "Доходимость (%)", value: "", isConversion: true },
  { label: "Были на вебинаре", value: "" },
  { label: "Пик", value: "" },
  { label: "Нажали на баннер", value: "" },
  { label: "CV из пика → заявка", value: "", isConversion: true },
  { label: "CV из участника → заявка", value: "", isConversion: true },
  { label: "Отставили заявку (чел)", value: "" },
  { label: "Сумма заказов", value: "" },
  { label: "Оплат", value: "" },
  { label: "CV заявка → оплата", value: "", isConversion: true },
  { label: "Средний чек", value: "" },
  { label: "Сумма оплат", value: "", isResult: true },
  { label: "Предоплат шт", value: "" },
  { label: "Сумма предоплат", value: "" },
  { label: "Вложено в трафик", value: "" },
  { label: "Окупаемость воронки", value: "", isResult: true },
  { label: "Итоговая сумма", value: "", isResult: true },
];

function makeId() {
  return `_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

function makeLaunch(name: string): Launch {
  return {
    id: makeId(),
    name,
    goalRevenue: "",
    planRows: [
      { id: makeId(), date: "", stage: "Автомарафон + база + канал тг + платная реклама 9 марта реги", plan: "Получить анкеты" },
      { id: makeId(), date: "", stage: "Закрытая продажа по анкете предзаписи", plan: "" },
      { id: makeId(), date: "", stage: "Большое мероприятие марафон", plan: "" },
      { id: makeId(), date: "", stage: "Дожим", plan: "" },
    ],
    regRows: [
      { id: makeId(), source: "Инст сторис", plan: "5000", fact: "" },
      { id: makeId(), source: "Телеграм канал", plan: "5000", fact: "" },
      { id: makeId(), source: "Телеграм бот", plan: "1000", fact: "" },
      { id: makeId(), source: "ВК блог + база", plan: "500", fact: "" },
      { id: makeId(), source: "Спам тг", plan: "1000", fact: "" },
      { id: makeId(), source: "Вотс ап спам по базе", plan: "1000", fact: "" },
      { id: makeId(), source: "СМС", plan: "500", fact: "" },
      { id: makeId(), source: "Покупка блогеры", plan: "4000", fact: "" },
    ],
    regTotal: "18000",
    funnelSteps: DEFAULT_FUNNEL.map((s) => ({ ...s, id: makeId() })),
    trafficRows: [
      { id: makeId(), dates: "14-16 марта", budget: "3 000 000", audience: "25000", price: "120", subsCount: "100000", payback: "10 000 000" },
      { id: makeId(), dates: "до 10 апреля", budget: "4 000 000", audience: "33333", price: "120", subsCount: "110000", payback: "" },
    ],
  };
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function sumReg(rows: RegRow[]): number {
  return rows.reduce((s, r) => s + (parseFloat(r.plan.replace(/\s/g, "").replace(",", ".")) || 0), 0);
}

function sumRegFact(rows: RegRow[]): number {
  return rows.reduce((s, r) => s + (parseFloat(r.fact.replace(/\s/g, "").replace(",", ".")) || 0), 0);
}

// ─── CELLS ────────────────────────────────────────────────────────────────────

function In({ value, onChange, placeholder = "", className = "", align = "left" as "left" | "right" | "center" }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-transparent border-0 outline-none text-xs px-1.5 py-[3px] focus:bg-accent/50 rounded transition-colors placeholder:text-muted-foreground/20 text-${align} ${className}`}
    />
  );
}

function PlanIn({ value, onChange, placeholder = "0" }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-blue-50/70 dark:bg-blue-950/20 border-0 outline-none text-xs font-mono px-1.5 py-[3px] text-right focus:bg-blue-100 dark:focus:bg-blue-900/30 rounded placeholder:text-blue-300/50 text-blue-900 dark:text-blue-200"
    />
  );
}

function FactIn({ value, onChange, placeholder = "0" }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white dark:bg-background border-0 outline-none text-xs font-mono px-1.5 py-[3px] text-right focus:bg-accent/60 rounded placeholder:text-muted-foreground/25"
    />
  );
}

function TH({ ch, cls = "" }: { ch: React.ReactNode; cls?: string }) {
  return <th className={`px-2.5 py-1.5 text-left text-[10px] font-semibold whitespace-nowrap ${cls}`}>{ch}</th>;
}

function TD({ ch, cls = "" }: { ch: React.ReactNode; cls?: string }) {
  return <td className={`border-b border-border/30 px-0.5 py-0.5 ${cls}`}>{ch}</td>;
}

// ─── LAUNCH CARD ─────────────────────────────────────────────────────────────

function LaunchCard({ launch, onUpdate, onRemove }: {
  launch: Launch;
  onUpdate: (l: Launch) => void;
  onRemove: () => void;
}) {
  const [section, setSection] = useState<"plan" | "regs" | "funnel" | "traffic">("plan");
  const [collapsed, setCollapsed] = useState(false);

  const u = <T extends keyof Launch>(key: T, val: Launch[T]) => onUpdate({ ...launch, [key]: val });

  // Plan rows
  const updatePlan = (id: string, field: keyof PlanRow, val: string) =>
    u("planRows", launch.planRows.map((r) => r.id === id ? { ...r, [field]: val } : r));
  const addPlan = () => u("planRows", [...launch.planRows, { id: makeId(), date: "", stage: "", plan: "" }]);
  const removePlan = (id: string) => u("planRows", launch.planRows.filter((r) => r.id !== id));

  // Reg rows
  const updateReg = (id: string, field: keyof RegRow, val: string) =>
    u("regRows", launch.regRows.map((r) => r.id === id ? { ...r, [field]: val } : r));
  const addReg = () => u("regRows", [...launch.regRows, { id: makeId(), source: "", plan: "", fact: "" }]);
  const removeReg = (id: string) => u("regRows", launch.regRows.filter((r) => r.id !== id));

  // Funnel
  const updateFunnel = (id: string, val: string) =>
    u("funnelSteps", launch.funnelSteps.map((s) => s.id === id ? { ...s, value: val } : s));
  const addFunnelStep = () =>
    u("funnelSteps", [...launch.funnelSteps, { id: makeId(), label: "Новый шаг", value: "", isConversion: false }]);
  const removeFunnelStep = (id: string) =>
    u("funnelSteps", launch.funnelSteps.filter((s) => s.id !== id));
  const updateFunnelLabel = (id: string, label: string) =>
    u("funnelSteps", launch.funnelSteps.map((s) => s.id === id ? { ...s, label } : s));

  // Traffic
  const updateTraffic = (id: string, field: keyof TrafficRow, val: string) =>
    u("trafficRows", launch.trafficRows.map((r) => r.id === id ? { ...r, [field]: val } : r));
  const addTraffic = () =>
    u("trafficRows", [...launch.trafficRows, { id: makeId(), dates: "", budget: "", audience: "", price: "", subsCount: "", payback: "" }]);
  const removeTraffic = (id: string) =>
    u("trafficRows", launch.trafficRows.filter((r) => r.id !== id));

  const planTotal = sumReg(launch.regRows);
  const factTotal = sumRegFact(launch.regRows);

  const SECTIONS = [
    { key: "plan", label: "План запуска", icon: "CalendarCheck" },
    { key: "regs", label: "Декомп. регистраций", icon: "Users" },
    { key: "funnel", label: "Декомп. воронки", icon: "GitBranch" },
    { key: "traffic", label: "Декомп. трафика", icon: "TrendingUp" },
  ] as const;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm mb-6">
      {/* Header */}
      <div className="bg-[#1a3557] text-white px-4 py-2.5 flex items-center gap-3">
        <button onClick={() => setCollapsed((v) => !v)}>
          <Icon name={collapsed ? "ChevronRight" : "ChevronDown"} size={13} className="text-white/60" />
        </button>
        <input
          value={launch.name}
          onChange={(e) => u("name", e.target.value)}
          className="flex-1 bg-transparent border-0 outline-none font-semibold text-sm placeholder:text-white/40 focus:bg-white/10 rounded px-1"
          placeholder="Название запуска"
        />
        <div className="flex items-center gap-1.5 text-xs text-white/50">
          <span>Цель:</span>
          <input
            value={launch.goalRevenue}
            onChange={(e) => u("goalRevenue", e.target.value)}
            placeholder="0 ₽"
            className="bg-transparent border-0 outline-none text-white/80 font-mono w-28 focus:bg-white/10 rounded px-1 text-right text-xs"
          />
        </div>
        <button onClick={onRemove} className="text-white/30 hover:text-red-300 transition-colors">
          <Icon name="Trash2" size={14} />
        </button>
      </div>

      {!collapsed && (
        <>
          {/* Sub-tabs */}
          <div className="flex border-b border-border bg-muted/20 overflow-x-auto">
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                onClick={() => setSection(s.key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-all ${section === s.key ? "border-primary text-primary bg-background" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              >
                <Icon name={s.icon} size={12} />
                {s.label}
              </button>
            ))}
          </div>

          {/* ── ПЛАН ЗАПУСКА ── */}
          {section === "plan" && (
            <div className="p-4">
              <p className="text-xs text-muted-foreground mb-3">Этапы запуска: даты, что делаем, план результата</p>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-muted/40">
                      <TH ch="#" cls="w-8 text-muted-foreground" />
                      <TH ch="Дата" cls="w-32 text-muted-foreground" />
                      <TH ch="Этап воронки / что делаем" cls="min-w-64 text-muted-foreground" />
                      <TH ch="План / цель" cls="min-w-40 text-blue-600 dark:text-blue-400" />
                      <TH ch="" cls="w-8" />
                    </tr>
                  </thead>
                  <tbody>
                    {launch.planRows.map((row, i) => (
                      <tr key={row.id} className={`group/r ${i % 2 === 0 ? "bg-background" : "bg-muted/10"} hover:bg-accent/20`}>
                        <TD ch={<span className="text-muted-foreground/30 px-2">{i + 1}</span>} />
                        <TD ch={<In value={row.date} onChange={(v) => updatePlan(row.id, "date", v)} placeholder="дд.мм — дд.мм" />} />
                        <TD ch={<In value={row.stage} onChange={(v) => updatePlan(row.id, "stage", v)} placeholder="Описание этапа…" />} />
                        <TD ch={<PlanIn value={row.plan} onChange={(v) => updatePlan(row.id, "plan", v)} placeholder="план…" />} />
                        <TD ch={
                          <button onClick={() => removePlan(row.id)} className="opacity-0 group-hover/r:opacity-40 hover:!opacity-100 transition-opacity text-red-400 px-1">
                            <Icon name="X" size={10} />
                          </button>
                        } />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={addPlan} className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors">
                <Icon name="Plus" size={11} /> добавить этап
              </button>
            </div>
          )}

          {/* ── ДЕКОМПОЗИЦИЯ РЕГИСТРАЦИЙ ── */}
          {section === "regs" && (
            <div className="p-4">
              <p className="text-xs text-muted-foreground mb-3">Откуда придут регистрации — источник, план, факт</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-muted/40">
                        <TH ch="Откуда?" cls="min-w-40 text-muted-foreground" />
                        <TH ch={<span className="text-blue-600 dark:text-blue-400">Сколько? (план)</span>} cls="w-32" />
                        <TH ch="Факт?" cls="w-32 text-muted-foreground" />
                        <TH ch="" cls="w-8" />
                      </tr>
                    </thead>
                    <tbody>
                      {launch.regRows.map((row, i) => (
                        <tr key={row.id} className={`group/r ${i % 2 === 0 ? "bg-background" : "bg-muted/10"} hover:bg-accent/20`}>
                          <TD ch={<In value={row.source} onChange={(v) => updateReg(row.id, "source", v)} placeholder="Источник…" />} />
                          <TD ch={<PlanIn value={row.plan} onChange={(v) => updateReg(row.id, "plan", v)} />} />
                          <TD ch={<FactIn value={row.fact} onChange={(v) => updateReg(row.id, "fact", v)} />} />
                          <TD ch={
                            <button onClick={() => removeReg(row.id)} className="opacity-0 group-hover/r:opacity-40 hover:!opacity-100 transition-opacity text-red-400 px-1">
                              <Icon name="X" size={10} />
                            </button>
                          } />
                        </tr>
                      ))}
                      <tr className="bg-muted/30 font-semibold">
                        <td className="px-2 py-1.5 text-xs">Итого</td>
                        <td className="px-2 py-1.5 text-right text-xs font-mono text-blue-700 dark:text-blue-300">{planTotal > 0 ? planTotal.toLocaleString("ru") : "—"}</td>
                        <td className="px-2 py-1.5 text-right text-xs font-mono">{factTotal > 0 ? factTotal.toLocaleString("ru") : "—"}</td>
                        <td />
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="rounded-lg border border-border p-4 bg-muted/10">
                  <p className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">Целевые регистрации</p>
                  <input
                    value={launch.regTotal}
                    onChange={(e) => u("regTotal", e.target.value)}
                    placeholder="0"
                    className="text-3xl font-bold bg-transparent border-0 outline-none w-full text-primary focus:bg-accent/30 rounded px-1"
                  />
                  <p className="text-xs text-muted-foreground mt-2">Введите общий план — или он посчитается из строк выше ({planTotal > 0 ? planTotal.toLocaleString("ru") : "0"})</p>
                  <button onClick={addReg} className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors">
                    <Icon name="Plus" size={11} /> добавить источник
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── ДЕКОМПОЗИЦИЯ ВОРОНКИ ── */}
          {section === "funnel" && (
            <div className="p-4">
              <p className="text-xs text-muted-foreground mb-3">
                Путь клиента: ключевые показатели воронки от регистрации до оплаты
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-w-3xl">
                {launch.funnelSteps.map((step, i) => {
                  const isResult = step.isResult;
                  const isConv = step.isConversion;
                  return (
                    <div
                      key={step.id}
                      className={`group/fs rounded-lg border px-3 py-2 flex items-center gap-2 ${
                        isResult
                          ? "border-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/20"
                          : isConv
                          ? "border-violet-200 bg-violet-50/40 dark:bg-violet-950/10"
                          : "border-border bg-background"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <input
                          value={step.label}
                          onChange={(e) => updateFunnelLabel(step.id, e.target.value)}
                          className="bg-transparent border-0 outline-none text-[10px] text-muted-foreground w-full focus:bg-accent/30 rounded px-0.5 mb-0.5"
                        />
                        <input
                          value={step.value}
                          onChange={(e) => updateFunnel(step.id, e.target.value)}
                          placeholder={isConv ? "%" : "0"}
                          className={`bg-transparent border-0 outline-none text-sm font-bold w-full focus:bg-accent/30 rounded px-0.5 ${isResult ? "text-emerald-700 dark:text-emerald-400" : isConv ? "text-violet-700 dark:text-violet-400" : ""}`}
                        />
                      </div>
                      <button
                        onClick={() => removeFunnelStep(step.id)}
                        className="opacity-0 group-hover/fs:opacity-40 hover:!opacity-100 transition-opacity text-red-400 shrink-0"
                      >
                        <Icon name="X" size={10} />
                      </button>
                    </div>
                  );
                })}
                <button
                  onClick={addFunnelStep}
                  className="rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1"
                >
                  <Icon name="Plus" size={12} /> шаг
                </button>
              </div>
            </div>
          )}

          {/* ── ДЕКОМПОЗИЦИЯ ТРАФИКА ── */}
          {section === "traffic" && (
            <div className="p-4">
              <p className="text-xs text-muted-foreground mb-3">Разбивка трафика по периодам и каналам — бюджет, аудитория, подписчики, окупаемость</p>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-xs border-collapse" style={{ minWidth: 700 }}>
                  <thead>
                    <tr className="bg-[#1a3557] text-white">
                      <TH ch="Даты" cls="min-w-28 text-white/80" />
                      <TH ch={<span className="text-blue-200">Бюджет</span>} cls="w-32" />
                      <TH ch="Аудитория" cls="w-28 text-white/80" />
                      <TH ch="ЦП (цена)" cls="w-24 text-white/80" />
                      <TH ch="Подписчиков общ." cls="w-32 text-white/80" />
                      <TH ch="Окупаемость план" cls="w-36 text-emerald-300" />
                      <TH ch="" cls="w-8" />
                    </tr>
                  </thead>
                  <tbody>
                    {launch.trafficRows.map((row, i) => (
                      <tr key={row.id} className={`group/r ${i % 2 === 0 ? "bg-background" : "bg-muted/10"} hover:bg-accent/20`}>
                        <TD ch={<In value={row.dates} onChange={(v) => updateTraffic(row.id, "dates", v)} placeholder="дд — дд мес." />} />
                        <TD ch={<PlanIn value={row.budget} onChange={(v) => updateTraffic(row.id, "budget", v)} />} />
                        <TD ch={<FactIn value={row.audience} onChange={(v) => updateTraffic(row.id, "audience", v)} />} />
                        <TD ch={<FactIn value={row.price} onChange={(v) => updateTraffic(row.id, "price", v)} />} />
                        <TD ch={<FactIn value={row.subsCount} onChange={(v) => updateTraffic(row.id, "subsCount", v)} />} />
                        <TD ch={
                          <input
                            value={row.payback}
                            onChange={(e) => updateTraffic(row.id, "payback", e.target.value)}
                            placeholder="0"
                            className="w-full bg-emerald-50/60 dark:bg-emerald-950/20 border-0 outline-none font-mono px-1.5 py-[3px] text-right focus:bg-emerald-100 rounded text-xs text-emerald-800 dark:text-emerald-300"
                          />
                        } />
                        <TD ch={
                          <button onClick={() => removeTraffic(row.id)} className="opacity-0 group-hover/r:opacity-40 hover:!opacity-100 transition-opacity text-red-400 px-1">
                            <Icon name="X" size={10} />
                          </button>
                        } />
                      </tr>
                    ))}
                    {/* total row */}
                    {launch.trafficRows.length > 0 && (() => {
                      const totalBudget = launch.trafficRows.reduce((s, r) =>
                        s + (parseFloat(r.budget.replace(/\s/g, "").replace(",", ".")) || 0), 0);
                      return (
                        <tr className="bg-muted/30 font-semibold">
                          <td className="px-2 py-1.5 text-xs">Итого</td>
                          <td className="px-2 py-1.5 text-right text-xs font-mono text-blue-700 dark:text-blue-300">
                            {totalBudget > 0 ? totalBudget.toLocaleString("ru") + " ₽" : "—"}
                          </td>
                          <td colSpan={5} />
                        </tr>
                      );
                    })()}
                  </tbody>
                </table>
              </div>
              <button onClick={addTraffic} className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors">
                <Icon name="Plus" size={11} /> добавить период
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export function TabLaunch() {
  const [launches, setLaunches] = useState<Launch[]>([
    makeLaunch("Запуск Март–Апрель 2025"),
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");

  const updateLaunch = (id: string, l: Launch) =>
    setLaunches((ls) => ls.map((ll) => ll.id === id ? l : ll));
  const removeLaunch = (id: string) =>
    setLaunches((ls) => ls.filter((l) => l.id !== id));
  const createLaunch = () => {
    if (!newName.trim()) return;
    setLaunches((ls) => [...ls, makeLaunch(newName.trim())]);
    setNewName("");
    setShowAdd(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold">Планирование запуска</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Декомпозиция: план этапов, источники регистраций, воронка, трафик
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-50 dark:bg-blue-950/30 border border-blue-200/80" />Ввод плана</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-white dark:bg-background border border-border" />Ввод факта</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-violet-50 dark:bg-violet-950/20 border border-violet-200" />Конверсия (CV)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300" />Итоговый результат</span>
      </div>

      {launches.map((l) => (
        <LaunchCard
          key={l.id}
          launch={l}
          onUpdate={(updated) => updateLaunch(l.id, updated)}
          onRemove={() => removeLaunch(l.id)}
        />
      ))}

      <div className="mt-2">
        {showAdd ? (
          <div className="border border-border rounded-lg p-4 bg-card shadow-sm max-w-md">
            <p className="text-sm font-semibold mb-3">Новый запуск</p>
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createLaunch()}
              placeholder="Запуск Май 2025"
              className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary mb-3"
            />
            <div className="flex gap-2">
              <button onClick={createLaunch} disabled={!newName.trim()} className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-40 transition-colors">
                Создать
              </button>
              <button onClick={() => { setShowAdd(false); setNewName(""); }} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors">
            <Icon name="Plus" size={14} /> Добавить запуск
          </button>
        )}
      </div>
    </div>
  );
}

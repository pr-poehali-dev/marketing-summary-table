import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Launch, makeLaunch } from "@/components/launch/LaunchTypes";
import { LaunchCard } from "@/components/launch/LaunchCard";

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

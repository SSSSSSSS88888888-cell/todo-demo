import { useState, useMemo, useRef } from 'react';
import { useGetTasksQuery, useGetSubjectsQuery, Task, Subject } from '../../generated/graphql';
import { format, differenceInDays, addDays, startOfDay, min, max } from 'date-fns';
import { ja } from 'date-fns/locale';
import { PRIORITY_COLORS, PRIORITY_LABELS, STATUS_LABELS } from '../../lib/constants';

export default function GanttChart() {
  const { data: tasksData, loading: tasksLoading } = useGetTasksQuery();
  const { data: subjectsData, loading: subjectsLoading } = useGetSubjectsQuery();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [hoveredTask, setHoveredTask] = useState<Task | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const scrollRef = useRef<HTMLDivElement>(null);

  const tasks = tasksData?.tasks || [];
  const subjects = subjectsData?.subjects || [];

  const filteredTasks = selectedSubjectId
    ? tasks.filter((t) => t.subjectId === selectedSubjectId)
    : tasks;

  const { timelineStart, totalDays, dateHeaders } = useMemo(() => {
    if (filteredTasks.length === 0) {
      const today = startOfDay(new Date());
      return {
        timelineStart: today,
        totalDays: 30,
        dateHeaders: Array.from({ length: 30 }, (_, i) => addDays(today, i)),
      };
    }

    const dates = filteredTasks.flatMap((t) => [new Date(t.startDate), new Date(t.dueDate)]);
    const minDate = startOfDay(min(dates));
    const maxDate = startOfDay(max(dates));
    const padding = 3;
    const start = addDays(minDate, -padding);
    const end = addDays(maxDate, padding);
    const days = differenceInDays(end, start) + 1;
    const headers = Array.from({ length: days }, (_, i) => addDays(start, i));

    return { timelineStart: start, totalDays: days, dateHeaders: headers };
  }, [filteredTasks]);

  const groupedTasks = useMemo(() => {
    const groups: {
      subject: Pick<Subject, 'id' | 'name' | 'color'>;
      units: { name: string; tasks: Task[] }[];
    }[] = [];

    const subjectOrder = subjects.reduce((acc, s, i) => ({ ...acc, [s.id]: i }), {} as Record<string, number>);

    const subjectMap = new Map<string, Map<string, Task[]>>();
    for (const task of filteredTasks) {
      if (!subjectMap.has(task.subjectId)) subjectMap.set(task.subjectId, new Map());
      const unitMap = subjectMap.get(task.subjectId)!;
      const unitName = task.unit?.name || '(単元なし)';
      if (!unitMap.has(unitName)) unitMap.set(unitName, []);
      unitMap.get(unitName)!.push(task);
    }

    const sortedSubjectIds = Array.from(subjectMap.keys()).sort(
      (a, b) => (subjectOrder[a] ?? 99) - (subjectOrder[b] ?? 99),
    );

    for (const sid of sortedSubjectIds) {
      const unitMap = subjectMap.get(sid)!;
      const subj = filteredTasks.find((t) => t.subjectId === sid)?.subject;
      if (!subj) continue;

      const units = Array.from(unitMap.entries()).map(([name, tasks]) => ({
        name,
        tasks: tasks.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()),
      }));

      groups.push({ subject: subj, units });
    }

    return groups;
  }, [filteredTasks, subjects]);

  if (tasksLoading || subjectsLoading) {
    return <div className="card animate-pulse h-64" />;
  }

  const cellWidth = 40;
  const labelWidth = 180;
  const today = startOfDay(new Date());
  const todayOffset = differenceInDays(today, timelineStart);

  const taskCount = filteredTasks.length;
  const doneCount = filteredTasks.filter((t) => t.status === 'DONE').length;

  const handleTaskHover = (task: Task, e: React.MouseEvent) => {
    setHoveredTask(task);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 8 });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="section-title text-base">ガントチャート</h2>
          {taskCount > 0 && (
            <p className="text-[11px] text-gray-400 mt-0.5 tabular-nums">
              {doneCount}/{taskCount} タスク完了
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 bg-white transition-all duration-150"
          >
            <option value="">全教科</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <button
            onClick={() => {
              if (scrollRef.current) {
                const todayPos = todayOffset * cellWidth - scrollRef.current.clientWidth / 2 + cellWidth / 2;
                scrollRef.current.scrollTo({ left: Math.max(0, todayPos), behavior: 'smooth' });
              }
            }}
            className="text-[11px] px-2.5 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap"
          >
            今日へ移動
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400">
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-gray-900" />
          <span>今日</span>
        </div>
        {subjects.filter(s => !selectedSubjectId || s.id === selectedSubjectId).map((s) => (
          <div key={s.id} className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded" style={{ backgroundColor: s.color }} />
            <span>{s.name}</span>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-sm text-gray-400">タスクがありません</p>
          <p className="text-[11px] text-gray-400 mt-1">タスクを作成するとガントチャートが表示されます</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200/60 overflow-hidden">
          <div className="flex">
            {/* Fixed left labels */}
            <div className="flex-shrink-0 border-r border-gray-200 bg-gray-50/50" style={{ width: labelWidth }}>
              <div className="h-10 px-3 flex items-center border-b border-gray-200">
                <span className="text-xs font-medium text-gray-500">教科 / 単元</span>
              </div>

              {groupedTasks.map((group) => (
                <div key={group.subject.id}>
                  <div className="h-8 px-3 flex items-center gap-1.5 bg-gray-100/40 border-b border-gray-100">
                    <div className="w-2 h-2 rounded" style={{ backgroundColor: group.subject.color }} />
                    <span className="text-xs font-semibold text-gray-700">{group.subject.name}</span>
                  </div>
                  {group.units.map((unit) => (
                    <div
                      key={unit.name}
                      className="border-b border-gray-50 px-3 pl-7 flex items-center"
                      style={{ height: Math.max(unit.tasks.length * 28 + 6, 34) }}
                    >
                      <span className="text-[11px] text-gray-500 truncate">{unit.name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Scrollable timeline */}
            <div ref={scrollRef} className="flex-1 overflow-x-auto gantt-scroll">
              <div style={{ minWidth: totalDays * cellWidth + 'px' }}>
                {/* Date headers */}
                <div className="h-10 flex border-b border-gray-200 sticky top-0 bg-white z-10">
                  {dateHeaders.map((date, i) => {
                    const isToday = differenceInDays(date, today) === 0;
                    const isSunday = date.getDay() === 0;
                    const isSaturday = date.getDay() === 6;
                    return (
                      <div
                        key={i}
                        className={`text-center text-[9px] leading-tight flex flex-col items-center justify-center border-r ${
                          isToday
                            ? 'bg-gray-100 font-bold text-gray-900 border-r-gray-200'
                            : 'border-r-gray-50'
                        } ${isSunday ? 'text-red-400' : isSaturday ? 'text-blue-400' : 'text-gray-400'}`}
                        style={{ width: cellWidth }}
                      >
                        <div>{format(date, 'M/d')}</div>
                        <div>{format(date, 'E', { locale: ja })}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Body */}
                {groupedTasks.map((group) => (
                  <div key={group.subject.id}>
                    <div className="h-8 flex border-b border-gray-100 bg-gray-50/30">
                      {dateHeaders.map((_, i) => (
                        <div key={i} className="border-r border-gray-50" style={{ width: cellWidth }} />
                      ))}
                    </div>

                    {group.units.map((unit) => (
                      <div
                        key={unit.name}
                        className="relative border-b border-gray-50"
                        style={{ height: Math.max(unit.tasks.length * 28 + 6, 34) }}
                      >
                        <div className="absolute inset-0 flex">
                          {dateHeaders.map((date, i) => {
                            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                            return (
                              <div
                                key={i}
                                className={`border-r ${isWeekend ? 'bg-gray-50/40 border-r-gray-100' : 'border-r-gray-50'}`}
                                style={{ width: cellWidth }}
                              />
                            );
                          })}
                        </div>

                        {todayOffset >= 0 && todayOffset < totalDays && (
                          <div
                            className="absolute top-0 bottom-0 w-px bg-gray-900 z-20 opacity-30"
                            style={{ left: todayOffset * cellWidth + cellWidth / 2 }}
                          />
                        )}

                        {unit.tasks.map((task, ti) => {
                          const start = differenceInDays(
                            startOfDay(new Date(task.startDate)),
                            timelineStart,
                          );
                          const duration =
                            differenceInDays(
                              startOfDay(new Date(task.dueDate)),
                              startOfDay(new Date(task.startDate)),
                            ) + 1;
                          const isDone = task.status === 'DONE';
                          const isOverdue = new Date(task.dueDate) < new Date() && !isDone;

                          return (
                            <div
                              key={task.id}
                              className={`absolute rounded text-[9px] text-white px-1.5 truncate flex items-center cursor-pointer transition-opacity z-10 ${
                                isDone ? 'opacity-40' : 'hover:opacity-90'
                              }`}
                              style={{
                                left: start * cellWidth + 1,
                                width: Math.max(duration * cellWidth - 3, cellWidth - 3),
                                top: ti * 28 + 3,
                                height: 24,
                                backgroundColor: isOverdue ? '#EF4444' : group.subject.color,
                              }}
                              onMouseEnter={(e) => handleTaskHover(task, e)}
                              onMouseLeave={() => setHoveredTask(null)}
                            >
                              {isDone && (
                                <svg className="w-2.5 h-2.5 mr-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                              <span className="truncate font-medium">{task.title}</span>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tooltip */}
          {hoveredTask && (
            <div
              className="fixed z-50 bg-gray-900 text-white rounded-lg px-3 py-2 text-[11px] pointer-events-none"
              style={{
                left: Math.min(tooltipPos.x, window.innerWidth - 220),
                top: tooltipPos.y,
                transform: 'translate(-50%, -100%)',
                maxWidth: 220,
              }}
            >
              <div className="font-medium mb-1">{hoveredTask.title}</div>
              <div className="text-gray-400 space-y-0.5">
                <div>{hoveredTask.subject.name}{hoveredTask.unit ? ' / ' + hoveredTask.unit.name : ''}</div>
                <div className="tabular-nums">
                  {format(new Date(hoveredTask.startDate), 'M/d', { locale: ja })} - {format(new Date(hoveredTask.dueDate), 'M/d', { locale: ja })}
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: PRIORITY_COLORS[hoveredTask.priority] }}>
                    {PRIORITY_LABELS[hoveredTask.priority]}
                  </span>
                  <span>{STATUS_LABELS[hoveredTask.status]}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

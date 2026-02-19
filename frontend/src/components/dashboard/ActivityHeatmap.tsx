import { useMemo } from 'react';
import { useGetTasksQuery, TaskStatus } from '../../generated/graphql';
import { format, subDays, startOfDay, eachDayOfInterval, getDay } from 'date-fns';
import { ja } from 'date-fns/locale';

const CELL = 12;
const GAP = 2;
const WEEKS = 52;
const COLORS = ['#f3f4f6', '#d1d5db', '#9ca3af', '#6b7280', '#374151'];

function getColor(count: number) {
  if (count === 0) return COLORS[0];
  if (count === 1) return COLORS[1];
  if (count === 2) return COLORS[2];
  if (count === 3) return COLORS[3];
  return COLORS[4];
}

export default function ActivityHeatmap() {
  const { data, loading } = useGetTasksQuery();

  const { weeks, months } = useMemo(() => {
    const tasks = data?.tasks || [];
    const doneTasks = tasks.filter((t) => t.status === TaskStatus.DONE && t.completedAt);

    const countMap = new Map<string, number>();
    for (const task of doneTasks) {
      const day = format(startOfDay(new Date(task.completedAt!)), 'yyyy-MM-dd');
      countMap.set(day, (countMap.get(day) || 0) + 1);
    }

    const today = startOfDay(new Date());
    const startDate = subDays(today, WEEKS * 7);
    const allDays = eachDayOfInterval({ start: startDate, end: today });

    const weeksArr: { date: Date; count: number }[][] = [];
    let currentWeek: { date: Date; count: number }[] = [];

    for (const day of allDays) {
      const dow = getDay(day);
      const mondayIndex = dow === 0 ? 6 : dow - 1;
      if (mondayIndex === 0 && currentWeek.length > 0) {
        weeksArr.push(currentWeek);
        currentWeek = [];
      }
      const key = format(day, 'yyyy-MM-dd');
      currentWeek.push({ date: day, count: countMap.get(key) || 0 });
    }
    if (currentWeek.length > 0) weeksArr.push(currentWeek);

    const monthLabels: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    weeksArr.forEach((week, wi) => {
      for (const day of week) {
        const m = day.date.getMonth();
        if (m !== lastMonth) {
          monthLabels.push({ label: format(day.date, 'MMM', { locale: ja }), weekIndex: wi });
          lastMonth = m;
          break;
        }
      }
    });

    return { weeks: weeksArr, months: monthLabels };
  }, [data]);

  if (loading) return <div className="card animate-pulse h-32" />;

  const dayLabels = ['月', '', '水', '', '金', '', ''];
  const chartWidth = weeks.length * (CELL + GAP) + 28;

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center justify-between mb-3">
        <p className="section-title">アクティビティ</p>
        <p className="section-subtitle">過去1年間</p>
      </div>

      <div className="overflow-x-auto gantt-scroll">
        <svg width={chartWidth} height={110}>
          {months.map((m, i) => (
            <text key={i} x={28 + m.weekIndex * (CELL + GAP)} y={9} className="text-[9px] fill-gray-400">
              {m.label}
            </text>
          ))}
          {dayLabels.map((label, i) => (
            <text key={i} x={0} y={20 + i * (CELL + GAP) + CELL / 2 + 3} className="text-[9px] fill-gray-400">
              {label}
            </text>
          ))}
          {weeks.map((week, wi) =>
            week.map((day) => {
              const dow = getDay(day.date);
              const rowIndex = dow === 0 ? 6 : dow - 1;
              return (
                <rect
                  key={format(day.date, 'yyyy-MM-dd')}
                  x={28 + wi * (CELL + GAP)}
                  y={16 + rowIndex * (CELL + GAP)}
                  width={CELL}
                  height={CELL}
                  rx={2}
                  fill={getColor(day.count)}
                >
                  <title>{format(day.date, 'yyyy/M/d (E)', { locale: ja })}: {day.count}件</title>
                </rect>
              );
            }),
          )}
        </svg>
      </div>

      <div className="flex items-center justify-end gap-1 mt-2">
        <span className="text-[9px] text-gray-400">少</span>
        {COLORS.map((color, i) => (
          <div key={i} className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
        ))}
        <span className="text-[9px] text-gray-400">多</span>
      </div>
    </div>
  );
}

import { useGetTasksQuery, TaskStatus } from '../../generated/graphql';

const LEVELS = [
  { level: 1, threshold: 0 },
  { level: 2, threshold: 10 },
  { level: 3, threshold: 25 },
  { level: 4, threshold: 50 },
  { level: 5, threshold: 100 },
  { level: 6, threshold: 200 },
  { level: 7, threshold: 350 },
  { level: 8, threshold: 500 },
  { level: 9, threshold: 750 },
  { level: 10, threshold: 1000 },
];

function getLevel(completedCount: number) {
  let currentLevel = LEVELS[0];
  for (const l of LEVELS) {
    if (completedCount >= l.threshold) {
      currentLevel = l;
    } else {
      break;
    }
  }
  const nextLevel = LEVELS.find((l) => l.level === currentLevel.level + 1);
  const remaining = nextLevel ? nextLevel.threshold - completedCount : 0;
  const progress = nextLevel
    ? ((completedCount - currentLevel.threshold) / (nextLevel.threshold - currentLevel.threshold)) * 100
    : 100;

  return { level: currentLevel.level, progress: Math.min(progress, 100), remaining, hasNext: !!nextLevel };
}

export default function LevelProgress() {
  const { data, loading } = useGetTasksQuery();

  if (loading) return null;

  const completedCount = (data?.tasks || []).filter((t) => t.status === TaskStatus.DONE).length;
  const { level, progress, remaining, hasNext } = getLevel(completedCount);
  const pct = progress + '%';

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-900">Lv.{level}</span>
        {hasNext && (
          <span className="text-[11px] text-gray-400">あと{remaining}タスクで Lv.{level + 1}</span>
        )}
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full bg-gray-900 animate-progress transition-all duration-500"
          style={{ width: pct }}
        />
      </div>
    </div>
  );
}

import { useGetMyStreakQuery } from '../../generated/graphql';

export default function StreakCard() {
  const { data, loading } = useGetMyStreakQuery();

  if (loading) return <div className="card animate-pulse h-20" />;

  const streak = data?.myStreak;
  const current = streak?.currentStreak || 0;
  const longest = streak?.longestStreak || 0;

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <p className="section-title">連続達成</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-gray-900 tabular-nums">{current}</span>
            <span className="text-xs text-gray-400">日</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-gray-400">最長記録</p>
          <p className="text-sm font-semibold text-gray-600 tabular-nums">{longest}日</p>
        </div>
      </div>
    </div>
  );
}

import { useGetTasksQuery, TaskStatus } from '../../generated/graphql';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export default function RecentCompletedTasks() {
  const { data, loading } = useGetTasksQuery();

  if (loading) return <div className="card animate-pulse h-32" />;

  const recentDone = (data?.tasks || [])
    .filter((t) => t.status === TaskStatus.DONE && t.completedAt)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
    .slice(0, 5);

  return (
    <div className="card animate-slide-up">
      <p className="section-title mb-3">最近の完了</p>
      {recentDone.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-4">まだ完了タスクはありません</p>
      ) : (
        <div className="space-y-2">
          {recentDone.map((task) => (
            <div key={task.id} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: task.subject.color }} />
              <span className="text-xs text-gray-600 truncate flex-1">{task.title}</span>
              <span className="text-[10px] text-gray-400 flex-shrink-0 tabular-nums">
                {format(new Date(task.completedAt!), 'M/d', { locale: ja })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

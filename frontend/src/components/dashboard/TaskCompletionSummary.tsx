import { useGetTasksQuery, TaskStatus } from '../../generated/graphql';
import { subDays, isAfter, startOfDay } from 'date-fns';

export default function TaskCompletionSummary() {
  const { data, loading } = useGetTasksQuery();

  if (loading) {
    return <div className="card animate-pulse h-32" />;
  }

  const tasks = data?.tasks || [];
  const doneTasks = tasks.filter((t) => t.status === TaskStatus.DONE && t.completedAt);

  const now = new Date();
  const threeMoAgo = subDays(now, 90);
  const oneMoAgo = subDays(now, 30);
  const yesterday = startOfDay(subDays(now, 1));

  const stats = [
    { label: '3ヶ月', value: doneTasks.filter((t) => isAfter(new Date(t.completedAt!), threeMoAgo)).length },
    { label: '1ヶ月', value: doneTasks.filter((t) => isAfter(new Date(t.completedAt!), oneMoAgo)).length },
    { label: '昨日', value: doneTasks.filter((t) => isAfter(new Date(t.completedAt!), yesterday)).length },
  ];

  return (
    <div className="card animate-slide-up">
      <p className="section-title mb-4">タスク完了数</p>
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="text-center py-2">
            <div className="text-3xl font-bold text-gray-900 tabular-nums">{s.value}</div>
            <div className="text-[11px] text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

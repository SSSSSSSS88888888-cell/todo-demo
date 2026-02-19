import { useGetTasksQuery, TaskStatus } from '../../generated/graphql';

export default function SubjectProgress() {
  const { data, loading } = useGetTasksQuery();

  if (loading) return <div className="card animate-pulse h-32" />;

  const tasks = data?.tasks || [];
  const subjectMap = new Map<string, { name: string; color: string; done: number; total: number }>();

  for (const task of tasks) {
    const key = task.subject.id;
    if (!subjectMap.has(key)) {
      subjectMap.set(key, { name: task.subject.name, color: task.subject.color, done: 0, total: 0 });
    }
    const entry = subjectMap.get(key)!;
    entry.total++;
    if (task.status === TaskStatus.DONE) entry.done++;
  }

  const subjects = Array.from(subjectMap.values());

  return (
    <div className="card animate-slide-up">
      <p className="section-title mb-3">教科別進捗</p>
      {subjects.length === 0 ? (
        <p className="text-xs text-gray-400 py-4 text-center">タスクがありません</p>
      ) : (
        <div className="space-y-3">
          {subjects.map((s) => {
            const pct = s.total > 0 ? Math.round((s.done / s.total) * 100) : 0;
            return (
              <div key={s.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-xs text-gray-700">{s.name}</span>
                  </div>
                  <span className="text-[11px] text-gray-400 tabular-nums">{s.done}/{s.total} ({pct}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full animate-progress"
                    style={{ width: pct + '%', backgroundColor: s.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

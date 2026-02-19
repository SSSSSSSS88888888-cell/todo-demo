import { useGetTodayTasksQuery, useUpdateTaskMutation, TaskStatus } from '../../generated/graphql';
import { PRIORITY_LABELS, PRIORITY_COLORS } from '../../lib/constants';

export default function TodayTasks() {
  const { data, loading, refetch } = useGetTodayTasksQuery();
  const [updateTask] = useUpdateTaskMutation();

  const handleStatus = async (id: string, status: TaskStatus) => {
    await updateTask({ variables: { id, input: { status } } });
    refetch();
  };

  if (loading) return <div className="card animate-pulse h-40" />;

  const tasks = data?.todayTasks || [];
  const doneCount = tasks.filter((t) => t.status === 'DONE').length;

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center justify-between mb-3">
        <p className="section-title">今日のタスク</p>
        {tasks.length > 0 && (
          <span className="text-[11px] text-gray-400 tabular-nums">{doneCount}/{tasks.length}</span>
        )}
      </div>

      {tasks.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-6">今日のタスクはありません</p>
      ) : (
        <div className="space-y-1.5 stagger">
          {tasks.map((task) => {
            const isDone = task.status === 'DONE';
            return (
              <div
                key={task.id}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                  isDone ? 'bg-gray-50' : 'hover:bg-gray-50'
                }`}
              >
                {/* Color dot */}
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: task.subject.color, opacity: isDone ? 0.3 : 1 }}
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <span className={`text-sm truncate block ${isDone ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {task.title}
                  </span>
                  <span className="text-[11px] text-gray-400">{task.subject.name}</span>
                </div>

                {/* Priority */}
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0"
                  style={{
                    color: PRIORITY_COLORS[task.priority],
                    backgroundColor: PRIORITY_COLORS[task.priority] + '12',
                  }}
                >
                  {PRIORITY_LABELS[task.priority]}
                </span>

                {/* Actions */}
                <div className="flex gap-1 flex-shrink-0">
                  {task.status === 'TODO' && (
                    <button
                      onClick={() => handleStatus(task.id, TaskStatus.IN_PROGRESS)}
                      className="text-[11px] px-2 py-1 text-gray-500 hover:bg-gray-200 rounded transition-colors"
                    >
                      開始
                    </button>
                  )}
                  {!isDone && (
                    <button
                      onClick={() => handleStatus(task.id, TaskStatus.DONE)}
                      className="text-[11px] px-2 py-1 text-gray-500 hover:bg-gray-200 rounded transition-colors"
                    >
                      完了
                    </button>
                  )}
                  {isDone && (
                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

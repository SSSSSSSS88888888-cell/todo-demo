import { useState } from 'react';
import {
  useGetTasksQuery,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
  useGetSubjectsQuery,
  TaskStatus,
  type TaskFilterInput,
} from '../../generated/graphql';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import TaskFilter from './TaskFilter';

export default function TaskList() {
  const [showForm, setShowForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [filter, setFilter] = useState<TaskFilterInput>({});

  const { data, loading, refetch } = useGetTasksQuery({
    variables: { filter: Object.keys(filter).length > 0 ? filter : undefined },
  });
  const { data: subjectsData } = useGetSubjectsQuery();
  const [deleteTask] = useDeleteTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  const handleDelete = async (id: string) => {
    if (!confirm('このタスクを削除しますか？')) return;
    await deleteTask({ variables: { id } });
    refetch();
  };

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    await updateTask({ variables: { id, input: { status } } });
    refetch();
  };

  const tasks = data?.tasks || [];
  const subjects = subjectsData?.subjects || [];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="section-title text-base">タスク管理</h2>
          {tasks.length > 0 && (
            <p className="text-[11px] text-gray-400 mt-0.5 tabular-nums">{tasks.length}件のタスク</p>
          )}
        </div>
        <button
          onClick={() => { setEditingTaskId(null); setShowForm(true); }}
          className="btn-primary text-xs gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新しいタスク
        </button>
      </div>

      <TaskFilter filter={filter} onFilterChange={setFilter} subjects={subjects} />

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200/60 animate-pulse h-20" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-sm text-gray-400">タスクがありません</p>
          <p className="text-[11px] text-gray-400 mt-1">新しいタスクを作成して学習を始めましょう</p>
        </div>
      ) : (
        <div className="space-y-2 stagger">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={() => handleDelete(task.id)}
              onStatusChange={(status) => handleStatusChange(task.id, status)}
              onEdit={() => { setEditingTaskId(task.id); setShowForm(true); }}
            />
          ))}
        </div>
      )}

      {showForm && (
        <TaskForm
          taskId={editingTaskId}
          subjects={subjects}
          onClose={() => { setShowForm(false); setEditingTaskId(null); }}
          onSaved={() => { setShowForm(false); setEditingTaskId(null); refetch(); }}
        />
      )}
    </div>
  );
}

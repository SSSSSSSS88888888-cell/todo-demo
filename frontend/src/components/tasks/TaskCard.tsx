import { Task, TaskStatus } from '../../generated/graphql';
import { PRIORITY_LABELS, PRIORITY_COLORS, STATUS_LABELS } from '../../lib/constants';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
  onDelete: () => void;
  onStatusChange: (status: TaskStatus) => void;
  onEdit: () => void;
}

export default function TaskCard({ task, onDelete, onStatusChange, onEdit }: TaskCardProps) {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== TaskStatus.DONE;
  const isDone = task.status === TaskStatus.DONE;

  return (
    <div
      className={`bg-white rounded-xl border px-4 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3 transition-colors ${
        isOverdue ? 'border-red-200' : 'border-gray-200/60'
      }`}
    >
      {/* Subject color indicator */}
      <div
        className="w-1 sm:h-12 h-1 rounded-full flex-shrink-0 self-stretch"
        style={{ backgroundColor: task.subject.color, opacity: isDone ? 0.3 : 1 }}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm font-medium ${isDone ? 'line-through text-gray-400' : 'text-gray-800'}`}>
            {task.title}
          </span>
          <span
            className="text-[10px] px-1.5 py-0.5 rounded font-medium"
            style={{
              color: PRIORITY_COLORS[task.priority],
              backgroundColor: PRIORITY_COLORS[task.priority] + '12',
            }}
          >
            {PRIORITY_LABELS[task.priority]}
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
            isDone
              ? 'bg-gray-100 text-gray-500'
              : task.status === TaskStatus.IN_PROGRESS
              ? 'bg-gray-900/5 text-gray-700'
              : 'bg-gray-100 text-gray-500'
          }`}>
            {STATUS_LABELS[task.status]}
          </span>
          {isOverdue && (
            <span className="text-[10px] text-red-600 font-medium">期限超過</span>
          )}
        </div>

        <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400">
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: task.subject.color }} />
            {task.subject.name}{task.unit ? ' / ' + task.unit.name : ''}
          </span>
          <span className="tabular-nums">
            {format(new Date(task.startDate), 'M/d', { locale: ja })}
            {' - '}
            {format(new Date(task.dueDate), 'M/d', { locale: ja })}
          </span>
        </div>

        {task.description && (
          <p className="text-[11px] text-gray-400 mt-1 truncate">{task.description}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {task.status === TaskStatus.TODO && (
          <button
            onClick={() => onStatusChange(TaskStatus.IN_PROGRESS)}
            className="text-[11px] px-2.5 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            開始
          </button>
        )}
        {task.status === TaskStatus.IN_PROGRESS && (
          <button
            onClick={() => onStatusChange(TaskStatus.DONE)}
            className="text-[11px] px-2.5 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            完了
          </button>
        )}
        {isDone && (
          <button
            onClick={() => onStatusChange(TaskStatus.TODO)}
            className="text-[11px] px-2.5 py-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
          >
            戻す
          </button>
        )}
        <button
          onClick={onEdit}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="編集"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="削除"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

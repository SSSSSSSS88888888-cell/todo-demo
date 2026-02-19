import { Subject, Priority, TaskStatus, TaskFilterInput } from '../../generated/graphql';
import { PRIORITY_LABELS, STATUS_LABELS } from '../../lib/constants';

interface TaskFilterProps {
  filter: TaskFilterInput;
  onFilterChange: (filter: TaskFilterInput) => void;
  subjects: Subject[];
}

const selectClass =
  'border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 bg-white transition-all duration-150';

export default function TaskFilter({ filter, onFilterChange, subjects }: TaskFilterProps) {
  const hasFilter = filter.subjectId || filter.priority || filter.status;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={filter.subjectId || ''}
        onChange={(e) => onFilterChange({ ...filter, subjectId: e.target.value || undefined })}
        className={selectClass}
      >
        <option value="">全教科</option>
        {subjects.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>

      <select
        value={filter.priority || ''}
        onChange={(e) => onFilterChange({ ...filter, priority: (e.target.value as Priority) || undefined })}
        className={selectClass}
      >
        <option value="">全優先度</option>
        {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>

      <select
        value={filter.status || ''}
        onChange={(e) => onFilterChange({ ...filter, status: (e.target.value as TaskStatus) || undefined })}
        className={selectClass}
      >
        <option value="">全ステータス</option>
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>

      {hasFilter && (
        <button
          onClick={() => onFilterChange({})}
          className="text-[11px] text-gray-500 hover:text-gray-700 px-2 py-1.5 transition-colors"
        >
          クリア
        </button>
      )}
    </div>
  );
}

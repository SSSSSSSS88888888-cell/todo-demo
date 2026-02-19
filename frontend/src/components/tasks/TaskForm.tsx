import { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  Subject,
  Priority,
  GET_TASKS,
} from '../../generated/graphql';
import { format } from 'date-fns';

interface TaskFormProps {
  taskId: string | null;
  subjects: Subject[];
  onClose: () => void;
  onSaved: () => void;
}

export default function TaskForm({ taskId, subjects, onClose, onSaved }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [subjectId, setSubjectId] = useState('');
  const [unitId, setUnitId] = useState('');
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [dueDate, setDueDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(false);

  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [fetchTask] = useLazyQuery(GET_TASKS);

  const selectedSubject = subjects.find((s) => s.id === subjectId);
  const units = selectedSubject?.units || [];

  useEffect(() => {
    if (subjects.length > 0 && !subjectId) {
      setSubjectId(subjects[0].id);
    }
  }, [subjects, subjectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (taskId) {
        await updateTask({
          variables: {
            id: taskId,
            input: {
              title,
              description: description || undefined,
              priority,
              subjectId,
              unitId: unitId || undefined,
              startDate: new Date(startDate).toISOString(),
              dueDate: new Date(dueDate).toISOString(),
            },
          },
        });
      } else {
        await createTask({
          variables: {
            input: {
              title,
              description: description || undefined,
              priority,
              subjectId,
              unitId: unitId || undefined,
              startDate: new Date(startDate).toISOString(),
              dueDate: new Date(dueDate).toISOString(),
            },
          },
        });
      }
      onSaved();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4 animate-overlay">
      <div className="bg-white rounded-xl border border-gray-200/60 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-modal">
        <div className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="section-title text-base">
              {taskId ? 'タスクを編集' : '新しいタスク'}
            </h3>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="閉じる"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">タイトル</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                placeholder="例: 分数の計算ドリル"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">説明（任意）</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field resize-none"
                rows={2}
                placeholder="タスクの詳細..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">教科</label>
                <select
                  value={subjectId}
                  onChange={(e) => { setSubjectId(e.target.value); setUnitId(''); }}
                  className="input-field"
                  required
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">単元（任意）</label>
                <select
                  value={unitId}
                  onChange={(e) => setUnitId(e.target.value)}
                  className="input-field"
                >
                  <option value="">選択なし</option>
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">優先度</label>
              <div className="flex gap-2">
                {[
                  { value: Priority.HIGH, label: '高' },
                  { value: Priority.MEDIUM, label: '中' },
                  { value: Priority.LOW, label: '低' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPriority(opt.value)}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors ${
                      priority === opt.value
                        ? 'bg-gray-900 border-gray-900 text-white'
                        : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">開始日</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">期限</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <button type="submit" disabled={loading} className="btn-primary flex-1 py-2">
                {loading ? '保存中...' : taskId ? '更新する' : 'タスクを作成'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

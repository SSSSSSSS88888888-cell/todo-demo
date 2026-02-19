import { useState } from 'react';
import {
  useCreateTemplateMutation,
  useGetSubjectsQuery,
  Priority,
} from '../../generated/graphql';
import { PRIORITY_LABELS } from '../../lib/constants';

interface TemplateItemForm {
  title: string;
  subjectName: string;
  unitName: string;
  priority: Priority;
  dayOffset: number;
  durationDays: number;
}

interface TemplateFormProps {
  onClose: () => void;
  onSaved: () => void;
}

export default function TemplateForm({ onClose, onSaved }: TemplateFormProps) {
  const { data: subjectsData } = useGetSubjectsQuery();
  const [createTemplate] = useCreateTemplateMutation();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<TemplateItemForm[]>([
    { title: '', subjectName: '算数', unitName: '', priority: Priority.MEDIUM, dayOffset: 0, durationDays: 1 },
  ]);
  const [loading, setLoading] = useState(false);

  const subjects = subjectsData?.subjects || [];

  const addItem = () => {
    setItems([
      ...items,
      { title: '', subjectName: '算数', unitName: '', priority: Priority.MEDIUM, dayOffset: items.length, durationDays: 1 },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof TemplateItemForm, value: any) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    setItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTemplate({
        variables: {
          input: {
            name,
            description: description || undefined,
            items: items.map((item) => ({
              title: item.title,
              subjectName: item.subjectName,
              unitName: item.unitName || undefined,
              priority: item.priority,
              dayOffset: item.dayOffset,
              durationDays: item.durationDays,
            })),
          },
        },
      });
      onSaved();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4 animate-overlay">
      <div className="bg-white rounded-xl border border-gray-200/60 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-modal">
        <div className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="section-title text-base">新しいテンプレート</h3>
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
              <label className="block text-xs font-medium text-gray-700 mb-1">テンプレート名</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="例: 1週間の基礎固め"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">説明（任意）</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field"
                placeholder="テンプレートの説明"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-700">タスク項目</label>
                <button
                  type="button"
                  onClick={addItem}
                  className="text-[11px] text-gray-600 hover:text-gray-800 font-medium flex items-center gap-1 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  項目を追加
                </button>
              </div>

              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="border border-gray-200/60 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-medium text-gray-400">項目 {index + 1}</span>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-[10px] text-red-500 hover:text-red-700 transition-colors"
                        >
                          削除
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateItem(index, 'title', e.target.value)}
                      className="input-field text-xs"
                      placeholder="タスク名"
                      required
                    />

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <select
                        value={item.subjectName}
                        onChange={(e) => { updateItem(index, 'subjectName', e.target.value); updateItem(index, 'unitName', ''); }}
                        className="input-field text-xs"
                      >
                        {subjects.map((s) => (
                          <option key={s.id} value={s.name}>{s.name}</option>
                        ))}
                      </select>

                      <select
                        value={item.unitName}
                        onChange={(e) => updateItem(index, 'unitName', e.target.value)}
                        className="input-field text-xs"
                      >
                        <option value="">単元なし</option>
                        {subjects
                          .find((s) => s.name === item.subjectName)
                          ?.units.map((u) => (
                            <option key={u.id} value={u.name}>{u.name}</option>
                          ))}
                      </select>

                      <select
                        value={item.priority}
                        onChange={(e) => updateItem(index, 'priority', e.target.value)}
                        className="input-field text-xs"
                      >
                        {Object.entries(PRIORITY_LABELS).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>

                      <div className="flex gap-1">
                        <input
                          type="number"
                          value={item.dayOffset}
                          onChange={(e) => updateItem(index, 'dayOffset', parseInt(e.target.value) || 0)}
                          className="input-field text-xs w-16"
                          min={0}
                          title="開始日からの日数"
                          placeholder="Day"
                        />
                        <input
                          type="number"
                          value={item.durationDays}
                          onChange={(e) => updateItem(index, 'durationDays', parseInt(e.target.value) || 1)}
                          className="input-field text-xs w-16"
                          min={1}
                          title="所要日数"
                          placeholder="日数"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <button type="submit" disabled={loading} className="btn-primary flex-1 py-2">
                {loading ? '作成中...' : 'テンプレートを作成'}
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

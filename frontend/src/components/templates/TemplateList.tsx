import { useState } from 'react';
import {
  useGetTemplatesQuery,
  useDeleteTemplateMutation,
  useApplyTemplateMutation,
} from '../../generated/graphql';
import TemplateForm from './TemplateForm';
import TemplateApplyDialog from './TemplateApplyDialog';

export default function TemplateList() {
  const { data, loading, refetch } = useGetTemplatesQuery();
  const [deleteTemplate] = useDeleteTemplateMutation();
  const [applyTemplate] = useApplyTemplateMutation();
  const [showForm, setShowForm] = useState(false);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const templates = data?.templates || [];

  const handleDelete = async (id: string) => {
    if (!confirm('このテンプレートを削除しますか？')) return;
    await deleteTemplate({ variables: { id } });
    refetch();
  };

  const handleApply = async (templateId: string, startDate: string) => {
    await applyTemplate({
      variables: {
        input: { templateId, startDate: new Date(startDate).toISOString() },
      },
    });
    setApplyingId(null);
    alert('テンプレートを適用しました！タスク一覧で確認してください。');
  };

  if (loading) return <div className="card animate-pulse h-64" />;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="section-title text-base">テンプレート</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">
            学習計画のテンプレートを作成して、まとめてタスクを登録できます
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary text-xs gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新しいテンプレート
        </button>
      </div>

      {templates.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-sm text-gray-400">テンプレートがありません</p>
          <p className="text-[11px] text-gray-400 mt-1">学習計画テンプレートを作成してください</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 stagger">
          {templates.map((template) => (
            <div key={template.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">{template.name}</h3>
                  {template.description && (
                    <p className="text-[11px] text-gray-400 mt-0.5">{template.description}</p>
                  )}
                </div>
                <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded tabular-nums">
                  {template.items.length}項目
                </span>
              </div>

              <div className="space-y-1 mb-3 max-h-32 overflow-y-auto custom-scrollbar">
                {template.items.map((item) => (
                  <div key={item.id} className="text-[11px] flex items-center gap-1 text-gray-500 px-2 py-1 rounded bg-gray-50">
                    <span className="font-medium text-gray-600">{item.subjectName}</span>
                    {item.unitName && <span className="text-gray-400">/ {item.unitName}</span>}
                    <span className="text-gray-300">-</span>
                    <span className="truncate">{item.title}</span>
                    <span className="text-gray-400 ml-auto flex-shrink-0 tabular-nums">
                      Day {item.dayOffset}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => setApplyingId(template.id)}
                  className="btn-primary text-xs flex-1 py-1.5"
                >
                  適用する
                </button>
                <button
                  onClick={() => handleDelete(template.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="削除"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <TemplateForm
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); refetch(); }}
        />
      )}

      {applyingId && (
        <TemplateApplyDialog
          templateId={applyingId}
          onClose={() => setApplyingId(null)}
          onApply={handleApply}
        />
      )}
    </div>
  );
}

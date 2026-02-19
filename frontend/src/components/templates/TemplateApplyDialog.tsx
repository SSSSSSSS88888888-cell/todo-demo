import { useState } from 'react';
import { format } from 'date-fns';

interface Props {
  templateId: string;
  onClose: () => void;
  onApply: (templateId: string, startDate: string) => void;
}

export default function TemplateApplyDialog({ templateId, onClose, onApply }: Props) {
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    setLoading(true);
    try {
      await onApply(templateId, startDate);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4 animate-overlay">
      <div className="bg-white rounded-xl border border-gray-200/60 w-full max-w-sm p-5 animate-modal">
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title text-base">テンプレートを適用</h3>
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
        <p className="text-[11px] text-gray-400 mb-4">
          開始日を選択してください。テンプレートのタスクがこの日を基準に作成されます。
        </p>

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-1">開始日</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleApply}
            disabled={loading}
            className="btn-primary flex-1 py-2"
          >
            {loading ? '適用中...' : '適用する'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}

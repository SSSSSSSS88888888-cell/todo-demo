import { useNotification } from '../../hooks/useNotification';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export default function NotificationSettings() {
  const { enabled, permission, requestPermission, disable, upcomingDeadlines } =
    useNotification();

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="section-title text-base">通知設定</h2>

      <div className="card">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">ブラウザ通知</h3>
            <p className="text-[11px] text-gray-400">締切が近いタスクをお知らせします</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-gray-50">
            <div>
              <p className="text-xs font-medium text-gray-700">通知の許可状態</p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {permission === 'granted'
                  ? '許可済み'
                  : permission === 'denied'
                  ? 'ブロックされています'
                  : '未設定'}
              </p>
            </div>
            {permission === 'granted' ? (
              <div className="flex items-center gap-1 text-gray-600">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[11px] font-medium">有効</span>
              </div>
            ) : (
              <button onClick={requestPermission} className="btn-primary text-[11px] py-1 px-2.5">
                通知を許可
              </button>
            )}
          </div>

          {permission === 'granted' && (
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-gray-50">
              <div>
                <p className="text-xs font-medium text-gray-700">締切リマインダー</p>
                <p className="text-[11px] text-gray-400 mt-0.5">締切2時間前に通知</p>
              </div>
              <button
                onClick={enabled ? disable : requestPermission}
                className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
                  enabled ? 'bg-gray-900' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                    enabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">今後24時間以内の締切</h3>
            <p className="text-[11px] text-gray-400 tabular-nums">{upcomingDeadlines.length}件のタスク</p>
          </div>
        </div>

        {upcomingDeadlines.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-6">24時間以内に締切のタスクはありません</p>
        ) : (
          <div className="space-y-1.5">
            {upcomingDeadlines.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: task.subject.color }}
                  />
                  <span className="text-xs text-gray-700 truncate">{task.title}</span>
                  <span className="text-[10px] text-gray-400 flex-shrink-0">{task.subject.name}</span>
                </div>
                <span className="text-[10px] text-gray-500 font-medium tabular-nums flex-shrink-0 ml-2">
                  {format(new Date(task.dueDate), 'M/d HH:mm', { locale: ja })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

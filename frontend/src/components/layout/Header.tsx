import { useAuth } from '../../contexts/AuthContext';

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 -ml-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="メニューを開く"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 mr-1">
          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <span className="text-sm text-gray-600 hidden sm:block">{user?.name}</span>
        </div>
        <button
          onClick={logout}
          className="text-xs text-gray-400 hover:text-gray-600 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          ログアウト
        </button>
      </div>
    </header>
  );
}

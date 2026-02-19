import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginForm() {
  const { login, signup } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignup) {
        await signup(email, password, name);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="animate-fade-in w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-sm font-bold">受</span>
          </div>
          <h1 className="text-lg font-semibold text-gray-900">中学受験 Todo</h1>
          <p className="text-sm text-gray-500 mt-1">学習計画を管理しよう</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div className="animate-slide-up">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">お名前</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  placeholder="保護者の名前"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="example@mail.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">パスワード</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="6文字以上"
                required
                minLength={6}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 disabled:opacity-50"
            >
              {loading ? '処理中...' : isSignup ? 'アカウント作成' : 'ログイン'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <button
              onClick={() => { setIsSignup(!isSignup); setError(''); }}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              {isSignup ? 'ログインはこちら' : '新規登録はこちら'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

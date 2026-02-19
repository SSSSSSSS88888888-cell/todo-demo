import React, { Suspense } from 'react';
import { useAuth } from '../../contexts/AuthContext';

// Dynamic imports - if a file is missing or broken, only that widget fails
const TaskCompletionSummary = React.lazy(() => import('./TaskCompletionSummary'));
const LevelProgress = React.lazy(() => import('./LevelProgress'));
const ActivityHeatmap = React.lazy(() => import('./ActivityHeatmap'));
const RecentCompletedTasks = React.lazy(() => import('./RecentCompletedTasks'));
const StreakCard = React.lazy(() => import('./StreakCard'));
const TodayTasks = React.lazy(() => import('./TodayTasks'));
const SubjectProgress = React.lazy(() => import('./SubjectProgress'));

function WidgetError({ name, error }: { name: string; error: Error }) {
  return (
    <div className="bg-white rounded-xl border border-red-200 p-4">
      <p className="text-xs font-medium text-red-600 mb-1">{name} の読み込みエラー</p>
      <p className="text-[11px] text-red-400">{error.message}</p>
    </div>
  );
}

interface EBState { hasError: boolean; error: Error | null }

class WidgetBoundary extends React.Component<
  { children: React.ReactNode; name: string },
  EBState
> {
  state: EBState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): EBState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`[Dashboard] ${this.props.name} error:`, error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return <WidgetError name={this.props.name} error={this.state.error!} />;
    }
    return this.props.children;
  }
}

function Widget({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <WidgetBoundary name={name}>
      <Suspense fallback={<div className="bg-white rounded-xl border border-gray-200/60 p-5 animate-pulse h-24" />}>
        {children}
      </Suspense>
    </WidgetBoundary>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'おはようございます' : hour < 18 ? 'こんにちは' : 'お疲れさまです';

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Greeting - always visible */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          {greeting}、{user?.name || 'ユーザー'}さん
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">今日も学習を頑張りましょう</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Widget name="タスク完了数">
          <TaskCompletionSummary />
        </Widget>
        <div className="space-y-4">
          <Widget name="レベル進捗">
            <LevelProgress />
          </Widget>
          <Widget name="連続達成">
            <StreakCard />
          </Widget>
        </div>
      </div>

      {/* Activity */}
      <Widget name="アクティビティ">
        <ActivityHeatmap />
      </Widget>

      {/* Tasks & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Widget name="今日のタスク">
            <TodayTasks />
          </Widget>
        </div>
        <div className="space-y-4">
          <Widget name="教科別進捗">
            <SubjectProgress />
          </Widget>
          <Widget name="最近の完了">
            <RecentCompletedTasks />
          </Widget>
        </div>
      </div>
    </div>
  );
}

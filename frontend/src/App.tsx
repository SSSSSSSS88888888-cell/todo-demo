import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import LoginForm from './components/auth/LoginForm';
import Dashboard from './components/dashboard/Dashboard';
import TaskList from './components/tasks/TaskList';
import GanttChart from './components/gantt/GanttChart';
import TemplateList from './components/templates/TemplateList';
import NotificationSettings from './components/notifications/NotificationSettings';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">読み込み中...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-lg">読み込み中...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <LoginForm />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="tasks" element={<TaskList />} />
        <Route path="gantt" element={<GanttChart />} />
        <Route path="templates" element={<TemplateList />} />
        <Route path="notifications" element={<NotificationSettings />} />
      </Route>
    </Routes>
  );
}

import { useEffect, useRef, useCallback, useState } from 'react';
import { useGetUpcomingDeadlinesQuery } from '../generated/graphql';

export function useNotification() {
  const [enabled, setEnabled] = useState(() => {
    return localStorage.getItem('notificationsEnabled') === 'true';
  });
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied',
  );
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const { data, refetch } = useGetUpcomingDeadlinesQuery({
    variables: { withinHours: 24 },
    skip: !enabled,
    pollInterval: enabled ? 5 * 60 * 1000 : 0, // 5分ごと
  });

  const requestPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') return;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      setEnabled(true);
      localStorage.setItem('notificationsEnabled', 'true');
    }
  }, []);

  const disable = useCallback(() => {
    setEnabled(false);
    localStorage.setItem('notificationsEnabled', 'false');
  }, []);

  const sendNotification = useCallback((title: string, body: string) => {
    if (permission === 'granted' && enabled) {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
      });
    }
  }, [permission, enabled]);

  // 締切間近のタスクを通知
  useEffect(() => {
    if (!enabled || !data?.upcomingDeadlines) return;

    const notifiedKey = 'lastNotifiedTasks';
    const notified = JSON.parse(localStorage.getItem(notifiedKey) || '[]');
    const now = new Date();

    for (const task of data.upcomingDeadlines) {
      const due = new Date(task.dueDate);
      const hoursLeft = (due.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hoursLeft <= 2 && !notified.includes(task.id)) {
        sendNotification(
          '締切間近！',
          `「${task.title}」の締切まであと${Math.round(hoursLeft)}時間です`,
        );
        notified.push(task.id);
        localStorage.setItem(notifiedKey, JSON.stringify(notified.slice(-50)));
      }
    }
  }, [data, enabled, sendNotification]);

  return {
    enabled,
    permission,
    requestPermission,
    disable,
    upcomingDeadlines: data?.upcomingDeadlines || [],
    refetch,
  };
}

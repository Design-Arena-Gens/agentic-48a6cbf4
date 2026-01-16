import { Task } from './types';

// Request notification permission from the browser
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    alert('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

// Schedule a notification for a task
// Note: Browser notifications require the tab to be open. For true background reminders,
// a service worker would be needed, but that requires HTTPS and more complex setup.
export function scheduleNotification(task: Task): number | null {
  if (!task.dueDate || Notification.permission !== 'granted') {
    return null;
  }

  const dueTime = new Date(task.dueDate).getTime();
  const now = Date.now();
  const delay = dueTime - now;

  if (delay <= 0) {
    // Already past due, show immediately
    showNotification(task);
    return null;
  }

  // Schedule notification using setTimeout (max ~24 days)
  const timeoutId = window.setTimeout(() => {
    showNotification(task);
  }, delay);

  return timeoutId;
}

// Display a browser notification for a task
function showNotification(task: Task): void {
  if (Notification.permission !== 'granted') return;

  new Notification('Task Reminder', {
    body: task.title,
    icon: '/vite.svg',
    tag: task.id,
    requireInteraction: true,
  });
}

// Cancel a scheduled notification
export function cancelNotification(timeoutId: number): void {
  clearTimeout(timeoutId);
}

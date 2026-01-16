import { useEffect, useState } from 'react';
import { Task, FilterStatus } from './types';
import { taskStorage } from './storage';
import { parseNaturalLanguage } from './nlParser';
import { requestNotificationPermission, scheduleNotification } from './notifications';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import QuickAdd from './components/QuickAdd';
import FilterBar from './components/FilterBar';
import ImportExport from './components/ImportExport';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const loadTasks = async () => {
    try {
      const loadedTasks = await taskStorage.getAllTasks();
      setTasks(loadedTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const handleQuickAdd = async (input: string) => {
    const parsed = parseNaturalLanguage(input);
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: parsed.title,
      notes: '',
      dueDate: parsed.dueDate ? parsed.dueDate.toISOString() : null,
      done: false,
      priority: parsed.priority,
      createdAt: new Date().toISOString(),
    };

    try {
      await taskStorage.saveTask(newTask);
      setTasks([...tasks, newTask]);

      // Schedule notification if due date exists
      if (newTask.dueDate && Notification.permission === 'granted') {
        scheduleNotification(newTask);
      }
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const handleSaveTask = async (task: Task) => {
    try {
      await taskStorage.saveTask(task);

      if (editingTask) {
        setTasks(tasks.map(t => t.id === task.id ? task : t));
      } else {
        setTasks([...tasks, task]);
      }

      // Schedule notification if due date exists
      if (task.dueDate && Notification.permission === 'granted') {
        scheduleNotification(task);
      }

      setEditingTask(null);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await taskStorage.deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleToggleDone = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updatedTask = { ...task, done: !task.done };
    try {
      await taskStorage.saveTask(updatedTask);
      setTasks(tasks.map(t => t.id === id ? updatedTask : t));
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleRequestNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationPermission(granted ? 'granted' : 'denied');
  };

  const handleImport = async (importedTasks: Task[]) => {
    try {
      await taskStorage.clearAll();
      for (const task of importedTasks) {
        await taskStorage.saveTask(task);
      }
      setTasks(importedTasks);
    } catch (error) {
      console.error('Failed to import tasks:', error);
      alert('Import failed. Please check the JSON format.');
    }
  };

  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
    // Status filter
    if (filterStatus === 'active' && task.done) return false;
    if (filterStatus === 'completed' && !task.done) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return task.title.toLowerCase().includes(query) ||
             task.notes.toLowerCase().includes(query);
    }

    return true;
  });

  // Sort by due date, then priority
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Undone tasks first
    if (a.done !== b.done) return a.done ? 1 : -1;

    // Then by due date
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;

    // Then by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Task & Reminder AI</h1>
          <p className="text-gray-600">Your personal task assistant</p>
        </header>

        {notificationPermission !== 'granted' && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 mb-2">
              Enable notifications to receive task reminders
            </p>
            <button
              onClick={handleRequestNotifications}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Enable Notifications
            </button>
          </div>
        )}

        <QuickAdd onAdd={handleQuickAdd} />

        <div className="mb-6">
          <button
            onClick={() => {
              setEditingTask(null);
              setShowForm(!showForm);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            {showForm ? 'Cancel' : '+ New Task'}
          </button>
        </div>

        {showForm && (
          <TaskForm
            task={editingTask}
            onSave={handleSaveTask}
            onCancel={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
          />
        )}

        <FilterBar
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <TaskList
          tasks={sortedTasks}
          onToggleDone={handleToggleDone}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />

        <ImportExport tasks={tasks} onImport={handleImport} />
      </div>
    </div>
  );
}

export default App;

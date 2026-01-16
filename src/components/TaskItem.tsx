import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggleDone: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onToggleDone, onEdit, onDelete }: TaskItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return `Today ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }

    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-red-100 text-red-700',
  };

  return (
    <div className={`p-4 bg-white rounded-lg shadow-sm border-l-4 ${
      task.priority === 'high' ? 'border-red-500' :
      task.priority === 'medium' ? 'border-blue-500' :
      'border-gray-300'
    } ${task.done ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={task.done}
          onChange={() => onToggleDone(task.id)}
          className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          aria-label={`Mark "${task.title}" as ${task.done ? 'incomplete' : 'complete'}`}
        />

        <div className="flex-1 min-w-0">
          <h4 className={`font-medium ${task.done ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {task.title}
          </h4>

          {task.notes && (
            <p className="mt-1 text-sm text-gray-600">{task.notes}</p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>

            {task.dueDate && (
              <span className="text-xs text-gray-600">
                📅 {formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            aria-label={`Edit "${task.title}"`}
          >
            Edit
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete "${task.title}"?`)) {
                onDelete(task.id);
              }
            }}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
            aria-label={`Delete "${task.title}"`}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

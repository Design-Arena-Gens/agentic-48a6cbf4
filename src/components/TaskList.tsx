import { Task } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggleDone: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskList({ tasks, onToggleDone, onEdit, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No tasks found. Add one above!</p>
      </div>
    );
  }

  // Group tasks by status for better organization
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdue = tasks.filter(t => !t.done && t.dueDate && new Date(t.dueDate) < today);
  const dueToday = tasks.filter(t => {
    if (!t.dueDate || t.done) return false;
    const due = new Date(t.dueDate);
    due.setHours(0, 0, 0, 0);
    return due.getTime() === today.getTime();
  });
  const upcoming = tasks.filter(t => !t.done && t.dueDate && new Date(t.dueDate) > today);
  const noDueDate = tasks.filter(t => !t.done && !t.dueDate);
  const completed = tasks.filter(t => t.done);

  return (
    <div className="space-y-6">
      {overdue.length > 0 && (
        <TaskSection title="Overdue" color="red" tasks={overdue} onToggleDone={onToggleDone} onEdit={onEdit} onDelete={onDelete} />
      )}

      {dueToday.length > 0 && (
        <TaskSection title="Due Today" color="orange" tasks={dueToday} onToggleDone={onToggleDone} onEdit={onEdit} onDelete={onDelete} />
      )}

      {upcoming.length > 0 && (
        <TaskSection title="Upcoming" color="blue" tasks={upcoming} onToggleDone={onToggleDone} onEdit={onEdit} onDelete={onDelete} />
      )}

      {noDueDate.length > 0 && (
        <TaskSection title="No Due Date" color="gray" tasks={noDueDate} onToggleDone={onToggleDone} onEdit={onEdit} onDelete={onDelete} />
      )}

      {completed.length > 0 && (
        <TaskSection title="Completed" color="green" tasks={completed} onToggleDone={onToggleDone} onEdit={onEdit} onDelete={onDelete} />
      )}
    </div>
  );
}

interface TaskSectionProps {
  title: string;
  color: string;
  tasks: Task[];
  onToggleDone: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

function TaskSection({ title, color, tasks, onToggleDone, onEdit, onDelete }: TaskSectionProps) {
  const colorClasses = {
    red: 'text-red-700 border-red-300',
    orange: 'text-orange-700 border-orange-300',
    blue: 'text-blue-700 border-blue-300',
    gray: 'text-gray-700 border-gray-300',
    green: 'text-green-700 border-green-300',
  };

  return (
    <div>
      <h3 className={`text-sm font-semibold uppercase mb-2 pb-1 border-b-2 ${colorClasses[color as keyof typeof colorClasses]}`}>
        {title} ({tasks.length})
      </h3>
      <div className="space-y-2">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleDone={onToggleDone}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

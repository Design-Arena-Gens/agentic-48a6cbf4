export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  notes: string;
  dueDate: string | null; // ISO string
  done: boolean;
  priority: Priority;
  createdAt: string;
  reminderScheduled?: boolean;
}

export type FilterStatus = 'all' | 'active' | 'completed';
export type SortBy = 'dueDate' | 'priority' | 'createdAt';

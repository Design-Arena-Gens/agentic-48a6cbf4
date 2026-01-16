import { Priority } from './types';

export interface ParsedTask {
  title: string;
  dueDate: Date | null;
  priority: Priority;
}

// Natural language parser for quick-add functionality
// Supports: "remind me tomorrow at 9am buy milk", "high priority fix bug Friday"
export function parseNaturalLanguage(input: string): ParsedTask {
  let title = input;
  let dueDate: Date | null = null;
  let priority: Priority = 'medium';

  // Extract priority keywords
  const priorityMatch = input.match(/\b(low|medium|high)\s+priority\b/i);
  if (priorityMatch) {
    priority = priorityMatch[1].toLowerCase() as Priority;
    title = title.replace(priorityMatch[0], '').trim();
  }

  // Clean up "remind me" prefix
  title = title.replace(/^remind\s+me\s+(to\s+)?/i, '').trim();

  // Parse relative dates and times
  const now = new Date();

  // "tomorrow" -> next day at parsed time or 9am default
  const tomorrowMatch = input.match(/\btomorrow\b/i);
  if (tomorrowMatch) {
    dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + 1);
    title = title.replace(/\btomorrow\b/i, '').trim();
  }

  // "today" -> same day at parsed time or current time
  const todayMatch = input.match(/\btoday\b/i);
  if (todayMatch) {
    dueDate = new Date(now);
    title = title.replace(/\btoday\b/i, '').trim();
  }

  // "in X hours/days/weeks"
  const relativeMatch = input.match(/\bin\s+(\d+)\s+(hour|day|week)s?\b/i);
  if (relativeMatch) {
    const amount = parseInt(relativeMatch[1]);
    const unit = relativeMatch[2].toLowerCase();
    dueDate = new Date(now);

    if (unit === 'hour') dueDate.setHours(dueDate.getHours() + amount);
    else if (unit === 'day') dueDate.setDate(dueDate.getDate() + amount);
    else if (unit === 'week') dueDate.setDate(dueDate.getDate() + amount * 7);

    title = title.replace(relativeMatch[0], '').trim();
  }

  // Weekday names (Monday, Tuesday, etc.)
  const weekdayMatch = input.match(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i);
  if (weekdayMatch) {
    const targetDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      .indexOf(weekdayMatch[1].toLowerCase());

    dueDate = new Date(now);
    const currentDay = dueDate.getDay();
    const daysUntilTarget = (targetDay - currentDay + 7) % 7 || 7; // next occurrence
    dueDate.setDate(dueDate.getDate() + daysUntilTarget);

    title = title.replace(weekdayMatch[0], '').trim();
  }

  // Time parsing: "at 9am", "at 14:30", "9:00"
  const timeMatch = input.match(/\b(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i);
  if (timeMatch && dueDate) {
    let hours = parseInt(timeMatch[1]);
    const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
    const meridiem = timeMatch[3]?.toLowerCase();

    if (meridiem === 'pm' && hours < 12) hours += 12;
    if (meridiem === 'am' && hours === 12) hours = 0;

    dueDate.setHours(hours, minutes, 0, 0);
    title = title.replace(timeMatch[0], '').trim();
  } else if (dueDate && !timeMatch) {
    // Default to 9am if no time specified
    dueDate.setHours(9, 0, 0, 0);
  }

  // Clean up extra whitespace and "at" prepositions
  title = title.replace(/\s+at\s+/gi, ' ').replace(/\s+/g, ' ').trim();

  return {
    title: title || 'New Task',
    dueDate,
    priority
  };
}

# Task & Reminder AI

A minimal, production-ready single-user task and reminder web app built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- **CRUD Operations**: Create, read, update, and delete tasks with title, notes, due date, priority, and completion status
- **Local Persistence**: All data stored locally using IndexedDB (no backend required)
- **Browser Notifications**: Receive reminders at task due dates via the Notification API
- **Natural Language Quick-Add**: Parse phrases like "remind me tomorrow at 9am buy milk" or "high priority fix bug Friday"
- **Search & Filter**: Filter tasks by status (all/active/completed) and search by keywords
- **Import/Export**: Backup and restore tasks via JSON files
- **Responsive Design**: Accessible UI that works on desktop and mobile

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to the URL shown (typically `http://localhost:5173`)

## Build for Production

```bash
npm run build
npm run preview
```

## Browser Notifications

### Setup

1. When you first open the app, you'll see a prompt to enable notifications
2. Click "Enable Notifications" and allow in your browser
3. Notifications will be shown when tasks reach their due date/time

### Important Notes

- **Permission Required**: The app needs notification permission to send reminders
- **Tab Must Be Open**: Browser notifications only work while the browser tab is open (this is a browser limitation)
- **HTTPS Required for Service Workers**: For true background notifications, you'd need HTTPS and a service worker (not included in this minimal version)
- **Notification Persistence**: Scheduled notifications use `setTimeout`, so they reset if you refresh the page

### Testing Notifications

1. Add a task with a due date a few minutes in the future
2. Keep the browser tab open
3. You'll receive a notification when the time arrives

## Natural Language Parsing

The quick-add feature supports these patterns:

- **Relative dates**: "tomorrow", "today", "in 2 hours", "in 3 days"
- **Weekdays**: "Monday", "Friday", "Wednesday"
- **Times**: "at 9am", "at 14:30", "9:00"
- **Priority**: "high priority", "low priority", "medium priority"
- **Combinations**: "remind me tomorrow at 9am buy milk" → Title: "buy milk", Due: tomorrow 9am

Default time is 9:00 AM if no time is specified.

## Data Storage

- Uses **IndexedDB** for persistent client-side storage
- All data stays on your device
- Export JSON backups for safety
- Import to restore from backups

## Project Structure

```
src/
├── components/         # React components
│   ├── FilterBar.tsx   # Search and filter controls
│   ├── ImportExport.tsx# Backup/restore functionality
│   ├── QuickAdd.tsx    # Natural language input
│   ├── TaskForm.tsx    # Create/edit task form
│   ├── TaskItem.tsx    # Individual task display
│   └── TaskList.tsx    # Task list with grouping
├── nlParser.ts         # Natural language parser
├── notifications.ts    # Browser Notification API wrapper
├── storage.ts          # IndexedDB wrapper
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Tailwind CSS imports

```

## Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **IndexedDB** - Client-side database
- **Notification API** - Browser notifications

## Browser Compatibility

- Modern browsers with IndexedDB support (Chrome, Firefox, Safari, Edge)
- Notification API support for reminders
- Recommended: Latest version of Chrome, Firefox, or Edge

## License

MIT

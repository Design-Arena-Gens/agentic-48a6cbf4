import { Task } from '../types';

interface ImportExportProps {
  tasks: Task[];
  onImport: (tasks: Task[]) => void;
}

export default function ImportExport({ tasks, onImport }: ImportExportProps) {
  const handleExport = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasks-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedTasks = JSON.parse(event.target?.result as string) as Task[];

        // Validate the imported data
        if (!Array.isArray(importedTasks)) {
          throw new Error('Invalid format: must be an array');
        }

        // Basic validation of task structure
        const isValid = importedTasks.every(task =>
          task.id && task.title && typeof task.done === 'boolean'
        );

        if (!isValid) {
          throw new Error('Invalid task format');
        }

        if (confirm(`Import ${importedTasks.length} tasks? This will replace all existing tasks.`)) {
          onImport(importedTasks);
        }
      } catch (error) {
        alert(`Import failed: ${error instanceof Error ? error.message : 'Invalid JSON'}`);
      }
    };

    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  return (
    <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
      <h3 className="font-semibold mb-3">Backup & Restore</h3>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          disabled={tasks.length === 0}
        >
          Export Tasks (JSON)
        </button>

        <label className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 cursor-pointer">
          Import Tasks (JSON)
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Export creates a JSON backup. Import will replace all current tasks.
      </p>
    </div>
  );
}

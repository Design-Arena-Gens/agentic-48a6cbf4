import { useState } from 'react';

interface QuickAddProps {
  onAdd: (input: string) => void;
}

export default function QuickAdd({ onAdd }: QuickAddProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAdd(input.trim());
      setInput('');
    }
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Try: "remind me tomorrow at 9am buy milk" or "high priority fix bug Friday"'
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Quick add task"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          Add
        </button>
      </form>
      <p className="mt-2 text-xs text-gray-500">
        Supports: tomorrow, today, in 2 hours, Monday, at 9am, high/medium/low priority
      </p>
    </div>
  );
}

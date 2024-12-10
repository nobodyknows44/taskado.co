'use client'

import { useState } from 'react';
import { X } from 'lucide-react';
import { Task } from '@/types/task';

interface CalendarModalProps {
  date: Date;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
}

export default function CalendarModal({ date, onClose, onSave }: CalendarModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [type, setType] = useState<'main' | 'secondary' | 'additional' | 'mini'>('main');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      priority,
      type,
      status: 'pending',
      tags: [],
      completedPomodoros: 0,
      targetPomodoros: 1
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1f1f1f] rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">
          Add Task for {date.toLocaleDateString()}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 rounded-lg border border-white/10 px-3 py-2 
                focus:outline-none focus:ring-2 focus:ring-[#2D2A6E]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/5 rounded-lg border border-white/10 px-3 py-2 
                focus:outline-none focus:ring-2 focus:ring-[#2D2A6E]"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="w-full bg-white/5 rounded-lg border border-white/10 px-3 py-2 
                  focus:outline-none focus:ring-2 focus:ring-[#2D2A6E]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'main' | 'secondary' | 'additional' | 'mini')}
                className="w-full bg-white/5 rounded-lg border border-white/10 px-3 py-2 
                  focus:outline-none focus:ring-2 focus:ring-[#2D2A6E]"
              >
                <option value="main">Main</option>
                <option value="secondary">Secondary</option>
                <option value="additional">Additional</option>
                <option value="mini">Mini</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#2D2A6E] hover:bg-[#3D3A7E] text-white font-medium 
              py-2 px-4 rounded-lg transition-colors"
          >
            Save Task
          </button>
        </form>
      </div>
    </div>
  );
}
'use client'

import React, { useState, useEffect } from 'react';
import { Task } from '@/types/task';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
  initialData?: {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    type: 'main' | 'secondary' | 'additional' | 'mini';
  };
  taskToEdit?: Task | null;
  selectedDate?: Date;
}

const TaskModal: React.FC<TaskModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData, 
  taskToEdit,
  selectedDate 
}) => {
  const [title, setTitle] = useState(initialData?.title || taskToEdit?.title || '');
  const [description, setDescription] = useState(initialData?.description || taskToEdit?.description || '');
  const [priority, setPriority] = useState<Task['priority']>(initialData?.priority || taskToEdit?.priority || 'medium');
  const [type, setType] = useState<Task['type']>(initialData?.type || taskToEdit?.type || 'main');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setPriority(taskToEdit.priority);
      setType(taskToEdit.type);
    } else if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setPriority(initialData.priority);
      setType(initialData.type);
    }
  }, [taskToEdit, initialData]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-[#1f1f1f] p-6 rounded-lg w-80">
        <h2 className="text-lg font-semibold text-white mb-4">
          {taskToEdit ? 'Edit Task' : 'Add Task'}
        </h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Title"
          className="w-full p-2 mb-2 rounded bg-white/10 text-white"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task Description"
          className="w-full p-2 mb-4 rounded bg-white/10 text-white"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Task['priority'])}
          className="w-full p-2 mb-2 rounded bg-white/10 text-white"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as Task['type'])}
          className="w-full p-2 mb-4 rounded bg-white/10 text-white"
        >
          <option value="main">Main</option>
          <option value="secondary">Secondary</option>
          <option value="additional">Additional</option>
          <option value="mini">Mini</option>
        </select>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-3 py-1.5 bg-gray-600 text-white rounded">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-3 py-1.5 bg-[#2D2A6E] text-white rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal; 
'use client'

import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/types/task';
import { Calendar, Tag, Clock } from 'lucide-react';

export default function TaskHistory() {
  const { tasks, loading, error } = useTasks();
  const [filters, setFilters] = useState({
    type: '',
    priority: '',
    tags: [] as string[],
    startDate: null as Date | null,
    endDate: null as Date | null
  });

  const completedTasks = tasks.filter(task => task.status === 'completed');

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white/90">Task History</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Filter components here */}
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {completedTasks.map(task => (
          <div 
            key={task.id}
            className="bg-white/5 rounded-xl p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-white/90">{task.title}</h3>
                {task.description && (
                  <p className="text-white/60 mt-1">{task.description}</p>
                )}
              </div>
              <span className={`
                px-2 py-1 rounded-lg text-sm
                ${task.priority === 'high' ? 'bg-red-500/20 text-red-500' :
                  task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                  'bg-green-500/20 text-green-500'}
              `}>
                {task.priority}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {task.tags.map(tag => (
                <span 
                  key={tag}
                  className="px-2 py-1 rounded-lg bg-white/10 text-white/60 text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-white/60">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                {formatDate(task.createdAt)}
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                {task.completedPomodoros}/{task.targetPomodoros} pomodoros
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
'use client'

import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/types/task';
import { 
  Calendar, 
  Tag, 
  Clock, 
  Trash2, 
  RefreshCw,
  Filter,
  X,
  ChevronDown,
  ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FilterState {
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  priority: Task['priority'] | 'all';
  type: Task['type'] | 'all';
  tags: string[];
}

export default function HistoryPage() {
  const router = useRouter();
  const { tasks, updateTask, deleteTask, loading } = useTasks();
  const [filters, setFilters] = useState<FilterState>({
    dateRange: { start: null, end: null },
    priority: 'all',
    type: 'all',
    tags: []
  });
  const [showFilters, setShowFilters] = useState(false);

  // Get all completed tasks
  const completedTasks = tasks.filter(task => task.status === 'completed');

  // Get unique tags from all tasks
  const allTags = Array.from(new Set(tasks.flatMap(task => task.tags)));

  // Apply filters
  const filteredTasks = completedTasks.filter(task => {
    const matchesDateRange = 
      (!filters.dateRange.start || task.createdAt >= filters.dateRange.start) &&
      (!filters.dateRange.end || task.createdAt <= filters.dateRange.end);
    
    const matchesPriority = 
      filters.priority === 'all' || task.priority === filters.priority;
    
    const matchesType = 
      filters.type === 'all' || task.type === filters.type;
    
    const matchesTags = 
      filters.tags.length === 0 || 
      filters.tags.some(tag => task.tags.includes(tag));

    return matchesDateRange && matchesPriority && matchesType && matchesTags;
  });

  const handleRestore = async (task: Task) => {
    try {
      await updateTask({
        ...task,
        status: 'pending',
        completedAt: null,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error restoring task:', error);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (window.confirm('Are you sure you want to permanently delete this task?')) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-[#151515] text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg 
                bg-[#2D2A6E] hover:bg-[#2D2A6E]/80 transition-colors mb-4"
            >
              <ArrowLeft size={20} />
              <span>Return to Timer</span>
            </button>
            <h1 className="text-3xl font-bold text-white/90">Task History</h1>
            <p className="text-white/60">Track your progress and review completed tasks</p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2D2A6E] 
              hover:bg-[#2D2A6E]/80 transition-colors"
          >
            <Filter size={20} />
            <span>Filters</span>
            <ChevronDown 
              size={16} 
              className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-[#2D2A6E] rounded-2xl p-6 space-y-6 
            shadow-lg backdrop-blur-lg border border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">
                  Date Range
                </label>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={filters.dateRange.start?.toISOString().split('T')[0] || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      dateRange: {
                        ...prev.dateRange,
                        start: e.target.value ? new Date(e.target.value) : null
                      }
                    }))}
                    className="w-full bg-white/5 rounded-xl px-4 py-2 text-white/90
                      border border-white/10 focus:border-[#f5d820]/30 
                      focus:ring-0 focus:bg-white/10 transition-all"
                  />
                  <input
                    type="date"
                    value={filters.dateRange.end?.toISOString().split('T')[0] || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      dateRange: {
                        ...prev.dateRange,
                        end: e.target.value ? new Date(e.target.value) : null
                      }
                    }))}
                    className="w-full bg-white/5 rounded-xl px-4 py-2 text-white/90
                      border border-white/10 focus:border-[#f5d820]/30 
                      focus:ring-0 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>

              {/* Priority & Type */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    Priority
                  </label>
                  <select
                    value={filters.priority}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      priority: e.target.value as Task['priority'] | 'all'
                    }))}
                    className="w-full bg-white/5 rounded-xl px-4 py-2 text-white/90
                      border border-white/10 focus:border-[#f5d820]/30 
                      focus:ring-0 focus:bg-white/10 transition-all"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    Type
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      type: e.target.value as Task['type'] | 'all'
                    }))}
                    className="w-full bg-white/5 rounded-xl px-4 py-2 text-white/90
                      border border-white/10 focus:border-[#f5d820]/30 
                      focus:ring-0 focus:bg-white/10 transition-all"
                  >
                    <option value="all">All Types</option>
                    <option value="main">Main</option>
                    <option value="secondary">Secondary</option>
                    <option value="additional">Additional</option>
                    <option value="mini">Mini</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">
                  Tags
                </label>
                <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar">
                  {allTags.map(tag => (
                    <label key={tag} className="flex items-center gap-2 p-2 
                      hover:bg-white/5 rounded-lg transition-colors">
                      <input
                        type="checkbox"
                        checked={filters.tags.includes(tag)}
                        onChange={(e) => {
                          setFilters(prev => ({
                            ...prev,
                            tags: e.target.checked
                              ? [...prev.tags, tag]
                              : prev.tags.filter(t => t !== tag)
                          }));
                        }}
                        className="rounded border-white/20 bg-white/5 
                          focus:ring-[#f5d820]/30 text-[#f5d820]"
                      />
                      <span className="text-white/90">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => setFilters({
                dateRange: { start: null, end: null },
                priority: 'all',
                type: 'all',
                tags: []
              })}
              className="text-white/60 hover:text-white/90 text-sm 
                underline-offset-4 hover:underline transition-all"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-12 text-white/60">
              <div className="animate-spin w-8 h-8 border-2 border-white/20 
                border-t-[#f5d820] rounded-full mx-auto mb-4" />
              Loading your task history...
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="col-span-full text-center py-12 text-white/60">
              No completed tasks found
            </div>
          ) : (
            filteredTasks.map(task => (
              <div 
                key={task.id}
                className="bg-white/5 hover:bg-white/8 rounded-xl p-6 space-y-4 
                  transition-all duration-300 border border-white/5"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl font-medium text-white/90">
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-white/60">{task.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRestore(task)}
                      className="p-2 rounded-lg hover:bg-[#2D2A6E] text-white/60 
                        hover:text-white/90 transition-colors group"
                      title="Restore task"
                    >
                      <RefreshCw size={20} className="group-hover:rotate-180 transition-transform" />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-2 rounded-lg hover:bg-[#2D2A6E] text-white/60 
                        hover:text-white/90 transition-colors"
                      title="Delete permanently"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {task.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-3 py-1 rounded-lg bg-white/10 text-white/60 
                        text-sm border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    Completed on {formatDate(task.completedAt || task.updatedAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    {task.completedPomodoros}/{task.targetPomodoros} pomodoros
                  </div>
                  <span className={`
                    px-2 py-1 rounded-lg text-sm
                    ${task.priority === 'high' 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/20' :
                      task.priority === 'medium' 
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20' :
                      'bg-green-500/20 text-green-400 border border-green-500/20'}
                  `}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
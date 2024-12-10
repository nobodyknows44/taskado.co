import React from 'react';
import { Task } from '@/types/task';
import { Pencil, Trash2 } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;  // Changed from number to string
  onToggleComplete: (id: string, completed: boolean) => void;  // Changed from number to string
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
}) => {
  return (
    <div className="group flex items-center justify-between p-3 rounded-lg bg-[#3D3A7E] hover:bg-[#4D4A8E] transition-colors">
      <div className="flex items-center space-x-3 flex-1">
        <input
          type="checkbox"
          checked={task.status === 'completed'}  // Changed from task.completed
          onChange={(e) => onToggleComplete(task.id, e.target.checked)}
          className="w-4 h-4 rounded-sm border-2 border-white/20 bg-transparent 
            checked:bg-green-500 checked:border-green-500 cursor-pointer
            focus:ring-0 focus:ring-offset-0"
        />
        <div className="flex-1">
          <h3 className={`text-sm font-medium text-white/90 ${task.status === 'completed' ? 'line-through text-white/50' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`text-xs text-white/60 ${task.status === 'completed' ? 'line-through text-white/30' : ''}`}>
              {task.description}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(task)}
          className="p-1 hover:bg-[#5D5A9E] rounded text-white/60 hover:text-white transition-colors"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1 hover:bg-[#5D5A9E] rounded text-white/60 hover:text-red-400 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
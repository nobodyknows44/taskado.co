'use client'

import React, { useState } from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import TaskItem from './TaskItem';
import TaskModal from './TaskModal';
import { Task } from '@/types/task';

interface FormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  type: 'main' | 'secondary' | 'additional' | 'mini';
}

interface TodoListProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>, date: Date) => void;
  onEditTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  selectedDate,
  onDateChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    priority: 'medium',
    type: 'main'
  });

  const handleAddTask = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      type: 'main'
    });
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority || 'medium',
      type: task.type || 'main'
    });
    setIsModalOpen(true);
  };

  const handleSave = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (editingTask) {
      onEditTask(editingTask.id, taskData);
    } else {
      onAddTask(taskData, selectedDate);
    }
    setIsModalOpen(false);
  };

  const handleToggleComplete = (id: string, completed: boolean) => {
    onEditTask(id, { 
      status: completed ? 'completed' : 'pending',
      updatedAt: new Date()
    });
  };

  const getTasksForDate = (tasks: Task[]) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      return (
        taskDate.getDate() === selectedDate.getDate() &&
        taskDate.getMonth() === selectedDate.getMonth() &&
        taskDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  };

  const todaysTasks = getTasksForDate(tasks);

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    onDateChange(newDate);
  };

  return (
    <div className="w-full">
      <motion.div 
        className="bg-gradient-to-br from-[#2D2A6E] to-[#2D2A6E]/90 rounded-2xl p-6 shadow-xl border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePreviousDay}
              className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <ChevronLeft size={20} />
            </button>
            
            <motion.h2 
              key={selectedDate.toISOString()}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg font-semibold text-white"
            >
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </motion.h2>
            
            <button
              onClick={handleNextDay}
              className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <button
            onClick={handleAddTask}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg 
              transition-all duration-200 flex items-center gap-2 border border-white/10"
          >
            <span>Add Task</span>
          </button>
        </div>

        <motion.div 
          className="space-y-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {todaysTasks.length > 0 ? (
            todaysTasks.map(task => (
              <motion.div
                key={`${task.id}-${task.updatedAt?.getTime()}`}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 }
                }}
              >
                <TaskItem
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={onDeleteTask}
                  onToggleComplete={handleToggleComplete}
                />
              </motion.div>
            ))
          ) : (
            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="text-white/60 text-center py-8"
            >
              No tasks for this day. Click "Add Task" to create one.
            </motion.p>
          )}
        </motion.div>
      </motion.div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
          setFormData({
            title: '',
            description: '',
            priority: 'medium',
            type: 'main'
          });
        }}
        onSave={handleSave}
        initialData={formData}
        taskToEdit={editingTask}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default TodoList;
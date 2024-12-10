'use client'

import AddTaskModal from './TaskModal'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  X, 
  Calendar as CalendarIcon,
  Clock,
  Filter,
  ArrowLeft,
  Pencil
} from 'lucide-react'
import { format } from 'date-fns'
import { Task } from '@/types'
import { useAuth } from '@/contexts/AuthContext'

interface CalendarProps {
  tasks: Task[]
  onDateSelect: (date: Date) => void
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>, date: Date) => void
  onEditTask: (id: string, updates: Partial<Task>) => void
  onDeleteTask: (id: string) => void
}

interface FormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  type: 'main' | 'secondary' | 'additional' | 'mini';
}

export default function Calendar({ tasks = [], onDateSelect, onAddTask, onEditTask, onDeleteTask }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month')
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    priority: 'medium',
    type: 'main'
  })
  const [selectedViewDate, setSelectedViewDate] = useState<Date | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const { user } = useAuth()

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const weekDays = [
    { id: 'sun', label: 'Sun' },
    { id: 'mon', label: 'Mon' },
    { id: 'tue', label: 'Tue' },
    { id: 'wed', label: 'Wed' },
    { id: 'thu', label: 'Thu' },
    { id: 'fri', label: 'Fri' },
    { id: 'sat', label: 'Sat' }
  ]

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysArray = []

    for (let i = 0; i < firstDay.getDay(); i++) {
      daysArray.push(null)
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      daysArray.push(new Date(year, month, i))
    }

    return daysArray
  }

  const getTasksForDate = (date: Date | null) => {
    if (!date || !Array.isArray(tasks)) return []
    return tasks.filter(task => {
      const taskDate = new Date(task.createdAt)
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      )
    })
  }




  
  const getUpcomingTasks = () => {
    const now = new Date()
    return tasks
      .filter(task => new Date(task.createdAt) >= now)
      .sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
  }

  const viewTasks = selectedViewDate 
    ? getTasksForDate(selectedViewDate) 
    : getUpcomingTasks()

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const days = getDaysInMonth()

  const handleDateClick = (date: Date, isAddTask: boolean) => {
    if (isAddTask) {
      setSelectedDate(date)
      setSelectedViewDate(null)
      setIsModalOpen(true)
    } else {
      setSelectedViewDate(date)
      setSelectedDate(null)
      setIsModalOpen(true)
    }
  }

  const handleTaskClick = (taskId: string) => {
    onEditTask(taskId, { status: 'completed' })
  }

  const handleSaveTaskWrapper = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (!user) {
      throw new Error('User must be logged in to save tasks');
    }

    if (editingTask) {
      onEditTask(editingTask.id, {
        ...taskData,
        updatedAt: new Date()
      });
    } else if (selectedDate) {
      onAddTask({
        ...taskData,
        status: 'pending',
        tags: [],
        completedPomodoros: 0,
        targetPomodoros: 1
      }, selectedDate);
    }

    setIsModalOpen(false);
    setSelectedDate(null);
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      type: 'main'
    });
  };

  const handleTaskItemClick = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description ?? '',
      priority: task.priority,
      type: task.type === 'additional' ? 'main' : task.type
    })
    setSelectedDate(new Date(task.createdAt))
    setSelectedViewDate(null)
    setIsModalOpen(true)
  }

  const handleDeleteTask = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onDeleteTask(taskId)
  }

  return (
    <div className="space-y-6">
      {/* Main Calendar Container */}
      <div className="bg-gradient-to-b from-[#1A1A1A] to-[#151515] rounded-3xl p-6 border border-white/5 shadow-2xl">
        {/* Calendar Header */}
        <motion.div 
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => setViewMode(viewMode === 'month' ? 'year' : 'month')}
            className="text-2xl font-bold bg-gradient-to-r from-white/90 to-white/60 
              bg-clip-text text-transparent hover:from-white hover:to-white/80 transition-all"
          >
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </button>
          
          <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1 backdrop-blur-sm">
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1.5 text-sm text-white/80 hover:bg-white/10 
                rounded-lg transition-colors"
            >
              Today
            </button>
            <div className="w-px h-6 bg-white/10" />
            <button
              onClick={() => {
                const newDate = new Date(currentDate)
                newDate.setMonth(currentDate.getMonth() - 1)
                setCurrentDate(newDate)
              }}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 
                hover:text-white/90 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => {
                const newDate = new Date(currentDate)
                newDate.setMonth(currentDate.getMonth() + 1)
                setCurrentDate(newDate)
              }}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 
                hover:text-white/90 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>

        {/* Calendar Grid */}
<div className="grid gap-0.5">
  {viewMode === 'month' && (
    <div className="grid grid-cols-7 gap-0.5">
      {/* Weekday Headers */}
      {weekDays.map(day => (
        <div
          key={day.id}
          className="text-center text-xs font-medium text-white/40 py-1" // Reduced padding
        >
          {day.label}
        </div>
      ))}

      {/* Calendar Days */}
      {days.map((date, index) => {
        const tasksForDate = date ? getTasksForDate(date) : [];
        const hasEvents = tasksForDate.length > 0;
        const isHovered = date && hoveredDate && 
          date.getDate() === hoveredDate.getDate() &&
          date.getMonth() === hoveredDate.getMonth();

        return (
          <motion.button
            key={date ? date.toISOString() : `empty-${index}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            onClick={(e) => {
              if (date) {
                const isAddTaskClick = !!(e.target as HTMLElement).closest('.add-task-button');
                handleDateClick(date, isAddTaskClick);
              }
            }}
            onMouseEnter={() => date && setHoveredDate(date)}
            onMouseLeave={() => setHoveredDate(null)}
            disabled={!date}
            className={`
              relative h-20 p-1.5 group transition-all duration-200 // Reduced height and padding
              ${date ? 'hover:bg-white/10' : ''}
              ${date && isToday(date) ? 'bg-[#2D2A6E]/30 ring-1 ring-[#2D2A6E]' : ''}
              ${hasEvents ? 'bg-white/5' : ''}
              rounded-lg // Reduced border radius
            `}
          >
            {date && (
              <>
                <div className={`
                  w-full flex items-start justify-between relative text-xs // Reduced text size
                  ${hasEvents ? 'font-medium' : 'text-white/60'}
                `}>
                  <span className="relative z-10">{date.getDate()}</span>
                  
                  {/* Add Task Button - Shows on Hover */}
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="add-task-button absolute -top-1 -right-1 
                        bg-[#2D2A6E] hover:bg-[#3D3A7E] rounded-lg
                        px-2 py-1 flex items-center gap-1.5
                        text-xs font-medium text-white/90 hover:text-white
                        shadow-lg shadow-black/20
                        border border-white/10
                        transition-all duration-200 cursor-pointer
                        transform hover:-translate-y-0.5"
                    >
                      <Plus size={12} className="text-white/80" />
                      <span>Add</span>
                    </motion.div>
                  )}
                </div>

                {/* Task Indicators */}
                {hasEvents && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 
                    flex items-center gap-0.5"> 
                    {tasksForDate.map((task, i) => (
                      <motion.div
                        key={`indicator-${task.id}-${i}`}
                        whileHover={{ scale: 1.5 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTaskItemClick(task, e);
                        }}
                        className={`
                          w-1 h-1 rounded-full cursor-pointer // Reduced indicator size
                          transition-transform shadow-sm
                          ${task.priority === 'high' ? 'bg-red-400' : 
                            task.priority === 'medium' ? 'bg-yellow-400' : 
                            'bg-green-400'}
                        `}
                        title={task.title}
                      />
                    )).slice(0, 3)}
                    {tasksForDate.length > 3 && (
                      <span className="text-[8px] text-white/60 font-medium">
                        +{tasksForDate.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </>
            )}
          </motion.button>
        );
      })}
    </div>
  )}
</div>
      </div>

      {/* Task Modal */}
      <AnimatePresence>
  {isModalOpen && (selectedDate || selectedViewDate) && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#1A1A1A] rounded-2xl p-6 w-full max-w-md relative border border-white/10 shadow-2xl"
      >
        <button
          onClick={() => {
            setIsModalOpen(false)
            setSelectedDate(null)
            setSelectedViewDate(null)
            setEditingTask(null)
            setFormData({
              title: '',
              description: '',
              priority: 'medium',
              type: 'main'
            })
          }}
          className="absolute top-4 right-4 text-white/60 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        {selectedViewDate ? (
  // View Tasks Mode
  <>
    <h2 className="text-xl font-semibold mb-6">
      Tasks for {format(selectedViewDate, 'MMMM d, yyyy')}
    </h2>
    <div className="space-y-3">
      {viewTasks.map((task) => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="group flex items-center justify-between p-4 rounded-xl 
            bg-white/5 hover:bg-white/8 transition-all border border-white/5 
            hover:border-white/10"
        >
          <div className="flex items-center space-x-3">
            <div className={`w-2 h-2 rounded-full ${
              task.priority === 'high' ? 'bg-red-400' : 
              task.priority === 'medium' ? 'bg-yellow-400' : 
              'bg-green-400'
            }`} />
            <div>
              <h3 className="text-sm font-medium text-white/90">{task.title}</h3>
              <p className="text-xs text-white/60">
                {format(new Date(task.createdAt), 'HH:mm')} · {task.type}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleTaskItemClick(task, e);
              }}
              className="p-1 hover:bg-white/10 rounded-full text-white/60 
                hover:text-[#f5d820] transition-colors"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={(e) => handleDeleteTask(task.id, e)}
              className="p-1 hover:bg-white/10 rounded-full text-white/60 
                hover:text-red-400 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  </>
) : (
          // Add/Edit Task Mode
          <>
          <AddTaskModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedDate(null);
              setSelectedViewDate(null);
              setEditingTask(null);
              setFormData({
                title: '',
                description: '',
                priority: 'medium',
                type: 'main'
              });
            }}
            onSave={handleSaveTaskWrapper}
            initialData={formData}
            taskToEdit={editingTask}
            selectedDate={selectedDate || new Date()}
          />
          </>
        )}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </div>
  )
}
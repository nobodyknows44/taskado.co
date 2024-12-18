'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useTasks } from '@/hooks/useTasks'
import { useChat } from '@/hooks/useChat'
import { useNotes } from '@/hooks/useNotes'
import { Task } from '@/types/task'
import { MainLayout } from './Layout/MainLayout'
import { NavBar } from './Navigation/NavBar'
import { TimerSection } from './Timer/TimerSection'
import { ChatPanel } from './Chat/ChatPanel'
import { NotesPanel } from './Notes/NotesPanel'
import LoginModal from './LoginModal'
import Calendar from './Calendar'
import TodoList from './TodoList'

// Animation variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1], // Custom cubic bezier
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    }
  }
}

const childVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    }
  }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function PomodoroPlanner() {
  const { user, logout } = useAuth()
  const { tasks, addTask, updateTask, deleteTask } = useTasks()
  const { messages, isSending, sendMessage } = useChat()
  const { notes, updateNotes } = useNotes()

  const [currentView, setCurrentView] = useState<'calendar' | 'pomodoro'>('pomodoro')
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())

  const handleAccountClick = () => {
    if (user) {
      logout()
    } else {
      setIsLoginModalOpen(true)
    }
  }

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>, date: Date) => {
    return addTask({
      ...taskData,
      createdAt: date,
      updatedAt: new Date(),
      status: taskData.status ?? 'pending',
      tags: taskData.tags ?? [],
      completedPomodoros: taskData.completedPomodoros ?? 0,
      targetPomodoros: taskData.targetPomodoros ?? 1
    });
  };

  const handleEditTask = async (id: string, updates: Partial<Task>) => {
    const existingTask = tasks.find(task => task.id === id);
    if (!existingTask) return;

    return updateTask({
      ...existingTask,
      ...updates,
      id,
      updatedAt: new Date()
    });
  };

  const handleDeleteTask = async (id: string) => {
    return deleteTask(id);
  };

  const handleNotesChange = (newNotes: string) => {
    updateNotes(newNotes);
  };

  return (
    <MainLayout>
      <NavBar
        currentView={currentView}
        onViewChange={setCurrentView}
        user={user}
        onAccountClick={handleAccountClick}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      <AnimatePresence mode="wait">
        {currentView === 'calendar' ? (
          <motion.div
            key="calendar"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="p-6"
          >
            <Calendar
              tasks={tasks}
              onDateSelect={setSelectedDate}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          </motion.div>
        ) : (
          <motion.div
            key="pomodoro"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="px-0 sm:px-4 lg:px-6 py-2 sm:py-4 lg:py-6"
          >
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-4 lg:gap-8 max-w-[100%] mx-auto"
            >
              <motion.div 
                variants={childVariants}
                className="lg:col-span-4"
              >
                <div className="sticky top-[4.5rem]">
                  <TimerSection />
                </div>
              </motion.div>

              <motion.div 
                variants={childVariants}
                className="lg:col-span-8 space-y-2 sm:space-y-4 lg:space-y-8"
              >
                <motion.div variants={childVariants}>
                  <TodoList
                    tasks={tasks}
                    onAddTask={handleAddTask}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTask}
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                  />
                </motion.div>

                <motion.div 
                  variants={childVariants}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 lg:gap-6 relative z-[1]"
                >
                  <motion.div
                    variants={childVariants}
                    className="bg-gradient-to-br from-[#2D2A6E] to-[#2D2A6E]/90 rounded-xl sm:rounded-2xl shadow-xl backdrop-blur-sm border border-white/10 min-h-[200px] sm:min-h-[300px] lg:min-h-[400px]"
                  >
                    <ChatPanel
                      messages={messages}
                      onSendMessage={sendMessage}
                      isSending={isSending}
                    />
                  </motion.div>

                  <motion.div
                    variants={childVariants}
                    className="bg-gradient-to-br from-[#2D2A6E] to-[#2D2A6E]/90 rounded-xl sm:rounded-2xl shadow-xl backdrop-blur-sm border border-white/10 min-h-[200px] sm:min-h-[300px] lg:min-h-[400px]"
                  >
                    <NotesPanel
                      notes={notes}
                      onNotesChange={handleNotesChange}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </MainLayout>
  )
}
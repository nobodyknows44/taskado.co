'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Trash2, Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Edit2, Check, Send, ChevronDown, Eraser, Copy, Calendar as CalendarIcon, LogIn } from 'lucide-react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Calendar from './Calendar'

interface Task {
  id: number
  text: string
  type: 'main' | 'secondary' | 'additional' | 'mini'
  completed: boolean
  completedPomodoros: number
  targetPomodoros: number
}

interface ChatMessage {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

interface AudioTrack {
  id: string
  name: string
  src: string
}

const audioTracks: AudioTrack[] = [
  { id: '1', name: 'Peaceful Piano', src: '/audio/piano_1.mp3' },
  { id: '2', name: 'Relaxing Piano', src: '/audio/piano_2.mp3' },
  { id: '3', name: 'Piano for Study', src: '/audio/piano_3.mp3' },
  // You can remove or comment out the other tracks until you have them
  // { id: '3', name: 'Forest Ambience', src: '/audio/forest-ambience.mp3' },
  // { id: '4', name: 'Ocean Waves', src: '/audio/ocean-waves.mp3' },
  // { id: '5', name: 'Soft Jazz', src: '/audio/soft-jazz.mp3' },
]

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (task: Omit<Task, 'id'>) => void
  type: Task['type']
  editingTask?: Task
}

const TaskModal = ({ isOpen, onClose, onSave, type, editingTask }: TaskModalProps) => {
  const [taskName, setTaskName] = useState(editingTask?.text || '')
  const [completedPomodoros, setCompletedPomodoros] = useState(editingTask?.completedPomodoros || 0)
  const [targetPomodoros, setTargetPomodoros] = useState(editingTask?.targetPomodoros || 1)

  useEffect(() => {
    if (editingTask) {
      setTaskName(editingTask.text)
      setCompletedPomodoros(editingTask.completedPomodoros)
      setTargetPomodoros(editingTask.targetPomodoros)
    }
  }, [editingTask])

  const handleSubmit = () => {
    if (!taskName.trim()) return
    
    onSave({
      text: taskName,
      type,
      completed: false,
      completedPomodoros,
      targetPomodoros
    })
    
    // Reset form
    setTaskName('')
    setCompletedPomodoros(0)
    setTargetPomodoros(1)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#2D2A6E] rounded-2xl shadow-xl border border-white/10 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-white/90">
            New {type.charAt(0).toUpperCase() + type.slice(1)} Task
          </h2>
          <button 
            onClick={onClose}
            className="text-white/60 hover:text-white/90 transition-colors"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Task Name */}
          <div>
            <label className="block text-white/60 text-sm font-medium mb-2">
              Task Name
            </label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full bg-white/5 rounded-xl px-4 py-3 text-white/90 
                placeholder-white/30 border border-white/10 focus:border-[#f5d820]/30 
                focus:ring-0 focus:bg-white/10 transition-all"
              placeholder="Enter task name"
              autoFocus
            />
          </div>

          {/* Pomodoro Controls */}
          <div className="grid grid-cols-2 gap-6">
            {/* Completed Pomodoros */}
            <div>
              <label className="block text-white/60 text-sm font-medium mb-2">
                Completed Pomodoros
              </label>
              <div className="flex items-center bg-white/5 rounded-xl">
                <button
                  onClick={() => setCompletedPomodoros(Math.max(0, completedPomodoros - 1))}
                  className="px-4 py-3 text-white/60 hover:text-white/90 transition-colors"
                >
                  -
                </button>
                <div className="flex-1 text-center text-white/90 font-medium">
                  {completedPomodoros}
                </div>
                <button
                  onClick={() => setCompletedPomodoros(completedPomodoros + 1)}
                  className="px-4 py-3 text-white/60 hover:text-white/90 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Target Pomodoros */}
            <div>
              <label className="block text-white/60 text-sm font-medium mb-2">
                Target Pomodoros
              </label>
              <div className="flex items-center bg-white/5 rounded-xl">
                <button
                  onClick={() => setTargetPomodoros(Math.max(1, targetPomodoros - 1))}
                  className="px-4 py-3 text-white/60 hover:text-white/90 transition-colors"
                >
                  -
                </button>
                <div className="flex-1 text-center text-white/90 font-medium">
                  {targetPomodoros}
                </div>
                <button
                  onClick={() => setTargetPomodoros(targetPomodoros + 1)}
                  className="px-4 py-3 text-white/60 hover:text-white/90 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-white/10 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl bg-white/5 text-white/60 
              hover:bg-white/10 hover:text-white/90 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!taskName.trim()}
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#f5d820] to-[#f5d820] 
              text-[#1E1B4B] font-medium hover:shadow-lg hover:shadow-[#f5d820]/20 
              disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

// Add timer duration constants
const TIMER_DURATIONS = {
  FOCUS: 25 * 60, // 25 minutes in seconds
  SHORT_BREAK: 5 * 60, // 5 minutes
  LONG_BREAK: 15 * 60 // 15 minutes
}

// Add Google AI initialization after interfaces
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || '');

export default function PomodoroPlanner() {
  const [timerMode, setTimerMode] = useState<'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK'>('FOCUS')
  const [time, setTime] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [exercise, setExercise] = useState('')
  const [gratitude, setGratitude] = useState('')
  const [learned, setLearned] = useState('')
  const [notes, setNotes] = useState('')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [aiMessage, setAiMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])

  // Music panel states
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<AudioTrack>(audioTracks[0])

  const audioRef = useRef<HTMLAudioElement>(null)

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  }

  const handleAddTask = (type: Task['type']) => {
    setCurrentTaskType(type)
    setIsTaskModalOpen(true)
  }

  const handleTaskChange = (id: number, text: string) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, text } : task))
  }

  const handleTaskCompletion = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ))
  }

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const resetTimer = useCallback(() => {
    switch (timerMode) {
      case 'FOCUS':
        setTime(25 * 60)
        break
      case 'SHORT_BREAK':
        setTime(5 * 60)
        break
      case 'LONG_BREAK':
        setTime(15 * 60)
        break
    }
  }, [timerMode])

  useEffect(() => {
    resetTimer()
  }, [timerMode, resetTimer])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1)
      }, 1000)
    } else if (time === 0) {
      setIsRunning(false)
    }
    return () => clearInterval(interval)
  }, [isRunning, time])

  useEffect(() => {
    const dateInterval = setInterval(() => {
      setCurrentDate(new Date())
    }, 60000)

    return () => clearInterval(dateInterval)
  }, [])

  // Update handleSendMessage function
  const handleSendMessage = async () => {
    if (!aiMessage.trim() || isSending) return

    setIsSending(true)
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      text: aiMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newUserMessage])
    setAiMessage('')

    try {
      // Use Google AI to generate a response
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(aiMessage);
      const response = result.response;
      const aiResponse = response.text();

      const newAiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, newAiMessage])
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I couldn't process your request. Please try again later.",
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsSending(false)
    }
  }

  // Music panel functions
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value))
  }

  const changeTrack = (direction: 'next' | 'prev') => {
    const currentIndex = audioTracks.findIndex(track => track.id === currentTrack.id)
    let newIndex
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % audioTracks.length
    } else {
      newIndex = (currentIndex - 1 + audioTracks.length) % audioTracks.length
    }
    setCurrentTrack(audioTracks[newIndex])
    
    // Reset playing state
    setIsPlaying(false)
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [currentTaskType, setCurrentTaskType] = useState<Task['type']>('main')

  // Add edit mode state
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)

  // Add edit handler
  const handleEditTask = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    setCurrentTaskType(task.type)
    setEditingTaskId(taskId)
    setIsTaskModalOpen(true)
  }

  // Update handleSaveTask to handle editing
  const handleSaveTask = (taskData: Omit<Task, 'id'>) => {
    if (editingTaskId) {
      setTasks(tasks.map(task => 
        task.id === editingTaskId 
          ? { ...taskData, id: task.id }
          : task
      ))
      setEditingTaskId(null)
    } else {
      setTasks([...tasks, { ...taskData, id: Date.now() }])
    }
  }

  // Update task display to show pomodoro counts and edit button
  const TaskItem = ({ task }: { task: Task }) => {
    return (
      <div className="flex items-center gap-2 sm:gap-4 bg-white/5 rounded-xl p-2 sm:p-4">
        {/* Checkbox */}
        <div className="flex-shrink-0">
          <button
            onClick={() => handleTaskCompletion(task.id)}
            className={`w-4 sm:w-5 h-4 sm:h-5 rounded flex items-center justify-center border ${
              task.completed 
                ? 'bg-[#f5d820] border-[#f5d820]' 
                : 'border-white/20 hover:border-white/30'
            }`}
          >
            {task.completed && <Check size={12} className="text-[#1E1B4B]" />}
          </button>
        </div>

        {/* Task Content */}
        <div className="flex-grow min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className={`text-sm sm:text-lg truncate ${
              task.completed ? 'text-white/30 line-through' : 'text-white/90'
            }`}>
              {task.text}
            </span>

            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-xs sm:text-sm text-white/60">
                {task.completedPomodoros}/{task.targetPomodoros}
              </span>
              <div className="flex gap-2">
                <button onClick={() => handleEditTask(task.id)} className="text-[#f5d820]">
                  <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button onClick={() => handleDeleteTask(task.id)} className="text-[#f5d820]">
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Update timer mode state handler
  const handleTimerModeChange = (newMode: typeof timerMode) => {
    setTimerMode(newMode)
    setTime(TIMER_DURATIONS[newMode])
    setIsRunning(false) // Stop the timer when switching modes
  }

  // First, add a function to get panel color based on timer mode
  const getPanelColor = () => {
    switch (timerMode) {
      case 'FOCUS':
        return 'bg-[#2c2a6e]'
      case 'SHORT_BREAK':
        return 'bg-[#4682B4]'
      case 'LONG_BREAK':
        return 'bg-[#FFA500]'
      default:
        return 'bg-[#2c2a6e]'
    }
  }

  // Update TimerTabs component to use the correct focus state color
  const TimerTabs = () => {
    const tabs = [
      { id: 'FOCUS', label: 'FOCUS' },
      { id: 'SHORT_BREAK', label: 'SHORT BREAK' },
      { id: 'LONG_BREAK', label: 'LONG BREAK' }
    ]

    return (
      <div className="flex gap-2 p-1 bg-white/5 rounded-2xl mb-12">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => handleTimerModeChange(id as typeof timerMode)}
            className={`flex-1 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              timerMode === id
                ? `${id === 'FOCUS' ? 'bg-[#2c2a6e]' : id === 'SHORT_BREAK' ? 'bg-[#4682B4]' : 'bg-[#FFA500]'} text-white shadow-lg`
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    )
  }

  // Add useEffect to handle initial timer setup
  useEffect(() => {
    setTime(TIMER_DURATIONS[timerMode])
  }, []) // Set initial time when component mounts

  // Timer Display Section
  const TimerDisplay = () => {
    return (
      <div className="text-center space-y-12">
        <div className="text-[120px] font-light tracking-tight leading-none">
          {formatTime(time)}
        </div>

        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`w-full py-4 px-8 rounded-2xl text-lg font-medium transition-all duration-300 ${
            isRunning
              ? 'bg-white/10 text-white hover:bg-white/15'
              : 'bg-[#f5d820] text-[#1E1B4B] hover:bg-[#f5d820]/90 shadow-lg'
          }`}
        >
          {isRunning ? 'PAUSE' : 'START FOCUS'}
        </button>
      </div>
    )
  }

  const [isTrackListOpen, setIsTrackListOpen] = useState(false)

  // Add these functions
  const clearNotes = () => {
    if (window.confirm('Clear all notes?')) {
      setNotes('')
    }
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(notes)
    // Optional: Show a toast notification
  }

  const addQuickNote = (prefix: string) => {
    setNotes(prev => {
      const newNote = `${prefix} `
      return prev ? `${prev}\n${newNote}` : newNote
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = e.target as HTMLTextAreaElement
      const start = textarea.selectionStart ?? 0
      const end = textarea.selectionEnd ?? 0
      
      setNotes(prev => 
        prev.substring(0, start) + '  ' + prev.substring(end)
      )
    }
  }

  // Add these state variables at the top with other states
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  // Add this helper function
  const formatDateHeader = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // First, make sure you have the currentView state
  const [currentView, setCurrentView] = useState<'pomodoro' | 'calendar'>('pomodoro')

  return (
    <div className="min-h-screen bg-[#151515] text-white p-8">
      {/* Date Navigation */}
      
      {/* Navigation Buttons */}
      <div className="flex flex-wrap gap-4 mb-8 relative z-50">
        <button 
          onClick={() => setCurrentView('calendar')}
          className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl transition-all shadow-lg
            ${currentView === 'calendar' 
              ? 'bg-[#f5d820] text-[#1E1B4B]' 
              : 'bg-[#2c2a6e] text-white/90 hover:bg-[#2c2a6e]/80'
            }`}
        >
          <CalendarIcon size={20} />
          <span className="hidden sm:inline">MY YEAR</span>
        </button>
        
        <button 
          onClick={() => setCurrentView('pomodoro')}
          className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl transition-all shadow-lg
            ${currentView === 'pomodoro' 
              ? 'bg-[#f5d820] text-[#1E1B4B]' 
              : 'bg-[#2c2a6e] text-white/90 hover:bg-[#2c2a6e]/80'
            }`}
        >
          <Edit2 size={20} />
          <span className="hidden sm:inline">TO-DO LIST</span>
        </button>

        <button className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-[#2c2a6e] rounded-xl 
          text-white/90 hover:bg-[#2c2a6e]/80 transition-all shadow-lg ml-auto">
          <LogIn size={20} />
          <span className="hidden sm:inline">LOGIN</span>
        </button>
      </div>

      {/* Conditional Rendering */}
      {currentView === 'calendar' ? (
        <Calendar />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-40">
          {/* Right Column - Timer and Quote */}
          <div className="lg:col-span-4 space-y-6">
            {/* Timer Section */}
            <div className={`${getPanelColor()} rounded-2xl p-8 shadow-lg`}>
              <TimerTabs />
              <TimerDisplay />
            </div>

            {/* Quote Panel - Moved under timer */}
            <div className={`${getPanelColor()} rounded-2xl p-6 shadow-lg`}>
              <div className="text-center space-y-4">
                <p className="text-xl">"Doubt everything. Find your own light."</p>
                <p className="text-white/60">- Buddha -</p>
              </div>
            </div>

            {/* Focus Sounds - Compact Version */}
            <div className={`${getPanelColor()} rounded-2xl shadow-lg overflow-hidden`}>
              <div className="flex flex-col h-[250px]">
                {/* Header */}
                <div className="p-4 border-b border-white/10">
                  <h2 className="text-xl font-semibold">Focus Sounds</h2>
                </div>

                {/* Player Content */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  {/* Top Section: Track Name & Controls */}
                  <div className="space-y-5">
                    {/* Track Name */}
                    <div className="text-center">
                      <h3 className="text-xl font-medium text-white/90">{currentTrack.name}</h3>
                    </div>
                    
                    {/* Main Controls */}
                    <div className="flex justify-center items-center gap-8">
                      <button
                        className="text-white/60 hover:text-[#f5d820] transition-all"
                        onClick={() => changeTrack('prev')}
                      >
                        <SkipBack size={20} />
                      </button>
                      <button
                        className="bg-[#f5d820] text-[#1E1B4B] p-4 rounded-full hover:bg-[#f5d820]/90 
                          transform hover:scale-105 active:scale-95 transition-all shadow-lg"
                        onClick={togglePlay}
                      >
                        {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
                      </button>
                      <button
                        className="text-white/60 hover:text-[#f5d820] transition-all"
                        onClick={() => changeTrack('next')}
                      >
                        <SkipForward size={20} />
                      </button>
                    </div>

                    {/* Volume Slider */}
                    <div className="flex items-center gap-3 px-1">
                      <button 
                        onClick={toggleMute}
                        className="text-white/60 hover:text-[#f5d820] transition-colors"
                      >
                        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                      </button>
                      <div className="flex-1 relative h-1 bg-white/10 rounded-full">
                        <div 
                          className="absolute left-0 top-0 h-full bg-[#f5d820] rounded-full"
                          style={{ width: `${volume * 100}%` }}
                        />
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Left Column - Tasks and Chat */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Today's Focus */}
            <div className={`${getPanelColor()} rounded-2xl p-6 shadow-lg`}>
              <h2 className="text-2xl font-semibold mb-6">Today's Focus</h2>
              <div className="space-y-3">
                {tasks.filter(task => task.type === 'main').map(task => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
              <button
                onClick={() => handleAddTask('main')}
                className="w-full p-2 border border-dashed border-[#f5d820] rounded-xl 
                  text-left text-[#f5d820] mt-4 hover:bg-[#f5d820]/5 transition-all"
              >
                + Add Task
              </button>
            </div>

            {/* Supporting Tasks */}
            <div className={`${getPanelColor()} rounded-2xl p-6 shadow-lg mt-6`}>
              <h2 className="text-2xl font-semibold mb-6">Supporting Tasks</h2>
              <div className="space-y-3">
                {tasks.filter(task => task.type === 'secondary').map(task => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
              <button
                onClick={() => handleAddTask('secondary')}
                className="w-full p-2 border border-dashed border-[#f5d820] rounded-xl 
                  text-left text-[#f5d820] mt-4 hover:bg-[#f5d820]/5 transition-all"
              >
                + Add Task
              </button>
            </div>
            {/* Quick Wins - Temporarily Disabled
            <div className="bg-[#2D2A6E] rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">Quick Wins</h2>
              <div className="space-y-3">
                {tasks.filter(task => task.type === 'mini').map(task => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
              <button
                onClick={() => handleAddTask('mini')}
                className="w-full p-2 border border-dashed border-[#F6C944] rounded-xl 
                  text-left text-[#F6C944] mt-4 hover:bg-[#F6C944]/5 transition-all"
              >
                + Add Task
              </button>
            </div>
            */}
            {/* Bottom Row - Chat and Music */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* AI Chat Panel - Half width */}
              <div className={`${getPanelColor()} rounded-2xl shadow-lg overflow-hidden`}>
                <div className="flex flex-col h-[450px]">
                  {/* Chat Header */}
                  <div className="p-4 border-b border-white/10">
                    <h2 className="text-xl font-semibold">Chat with AI</h2>
                  </div>

                  {/* Chat Messages Area */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map(message => (
                      <div
                        key={message.id}
                        className={`${
                          message.sender === 'user' 
                            ? 'bg-white/5 ml-12' 
                            : 'bg-[#f5d820]/10 mr-12'
                        } rounded-xl p-4`}
                      >
                        <p className="text-white/90">{message.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Input Area */}
                  <div className="p-4 border-t border-white/10">
                    <div className="relative">
                      <textarea
                        value={aiMessage}
                        onChange={(e) => setAiMessage(e.target.value)}
                        placeholder="Ask me anything..."
                        className="w-full bg-white/5 rounded-xl pl-4 pr-12 py-3 text-white/90 
                          placeholder-white/30 border border-white/10 focus:border-[#f5d820]/30 
                          focus:ring-0 resize-none"
                        rows={1}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={isSending}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 
                          text-[#f5d820] hover:text-[#f5d820]/80 transition-colors"
                      >
                        <Send size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes Panel - Half width */}
              <div className={`${getPanelColor()} rounded-2xl shadow-lg overflow-hidden`}>
                <div className="flex flex-col h-[450px]">
                  {/* Header with Actions */}
                  <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-semibold">Quick Notes</h2>
                      <span className="text-xs text-white/50">Auto-saving</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={clearNotes}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-white/50 
                          hover:text-white/90 transition-all"
                      >
                        <Eraser size={16} />
                      </button>
                      <button 
                        onClick={copyToClipboard}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-white/50 
                          hover:text-white/90 transition-all"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Notes Content */}
                  <div className="flex-1 p-4 flex flex-col gap-4">
                    {/* Quick Actions */}
                    <div className="flex gap-2 flex-wrap">
                      <button 
                        onClick={() => addQuickNote("Task:")}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 
                          text-sm text-white/70 hover:text-white/90 transition-all"
                      >
                        + Task
                      </button>
                      <button 
                        onClick={() => addQuickNote("Idea:")}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 
                          text-sm text-white/70 hover:text-white/90 transition-all"
                      >
                        + Idea
                      </button>
                      <button 
                        onClick={() => addQuickNote("Remember:")}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 
                          text-sm text-white/70 hover:text-white/90 transition-all"
                      >
                        + Reminder
                      </button>
                    </div>

                    {/* Notes Input with Line Numbers */}
                    <div className="flex-1 flex gap-2">
                      <div className="text-right text-sm text-white/30 pt-1 select-none">
                        {notes.split('\n').map((_, i) => (
                          <div key={i} className="leading-6">{i + 1}</div>
                        ))}
                      </div>
                      <textarea
                        value={notes}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent resize-none text-white/90 leading-6
                          placeholder:text-white/30 focus:outline-none focus:ring-0 
                          scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent
                          hover:scrollbar-thumb-white/20"
                        placeholder="Start typing..."
                      />
                    </div>

                    {/* Footer Stats */}
                    <div className="flex justify-between items-center text-xs text-white/50">
                      <div className="flex gap-4">
                        <span>{notes.split('\n').length} lines</span>
                        <span>{notes.split(/\s+/).filter(Boolean).length} words</span>
                      </div>
                      <span>{notes.length} characters</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <audio ref={audioRef} src={currentTrack.src} loop />
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false)
          setEditingTaskId(null)
        }}
        onSave={handleSaveTask}
        type={currentTaskType}
        editingTask={editingTaskId ? tasks.find(t => t.id === editingTaskId) : undefined}
      />
    </div>
  )
}
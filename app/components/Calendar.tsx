'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Shield, Lock, Check, X, Plus } from 'lucide-react'

interface CalendarTask {
  id: string
  text: string
  color: 'red' | 'yellow' | 'green' | 'blue'
  completed: boolean
}

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  hasEvents: boolean
}

interface DayDetails {
  label: string
  startDate: string
  endDate: string
  color: string
  notes: string
}

export default function Calendar() {
  const months = Array.from({ length: 12 }, (_, i) => i)

  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [tasks, setTasks] = useState<Record<string, CalendarTask[]>>({})
  const [selectedColor, setSelectedColor] = useState<'red' | 'yellow' | 'green' | 'blue'>('yellow')
  const [newTask, setNewTask] = useState('')
  const [viewMode, setViewMode] = useState<'year' | 'month'>('year')
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [dayDetails, setDayDetails] = useState<DayDetails>({
    label: '',
    startDate: '',
    endDate: '',
    color: '#f5d820', // default yellow
    notes: ''
  })

  const addTask = () => {
    if (!selectedDate || !newTask.trim()) return
    
    const dateKey = selectedDate.toISOString().split('T')[0]
    const newTaskObj: CalendarTask = {
      id: Date.now().toString(),
      text: newTask.trim(),
      color: selectedColor,
      completed: false
    }
    
    setTasks(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newTaskObj]
    }))
    setNewTask('')
  }

  const toggleTask = (taskId: string) => {
    if (!selectedDate) return
    const dateKey = selectedDate.toISOString().split('T')[0]
    
    setTasks(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }))
  }

  const renderMonth = (monthIndex: number) => {
    const year = currentDate.getFullYear()
    const firstDay = new Date(year, monthIndex, 1)
    const lastDay = new Date(year, monthIndex + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const emptyDays = Array(startingDayOfWeek).fill(null)
    
    return (
      <div className="grid grid-cols-7 gap-0.5 text-[0.6rem]">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div key={day} className="text-center text-white/30">
            {day}
          </div>
        ))}
        
        {emptyDays.map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        
        {Array.from({ length: daysInMonth }, (_, i) => {
          const date = new Date(year, monthIndex, i + 1)
          const isToday = date.toDateString() === new Date().toDateString()
          
          return (
            <div
              key={i}
              className={`
                aspect-square flex items-center justify-center
                ${isToday ? 'bg-[#f5d820] text-[#1E1B4B] rounded-full' : 'text-white/60'}
              `}
            >
              {i + 1}
            </div>
          )
        })}
      </div>
    )
  }

  const getMonthDays = (month: number): CalendarDay[] => {
    const year = currentDate.getFullYear()
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    
    const startingDayOfWeek = firstDayOfMonth.getDay()
    const daysInMonth = lastDayOfMonth.getDate()
    
    const today = new Date()
    const calendarDays: CalendarDay[] = []

    const daysFromPrevMonth = startingDayOfWeek
    const prevMonth = new Date(year, month - 1)
    const daysInPrevMonth = new Date(year, month, 0).getDate()
    
    for (let i = daysInPrevMonth - daysFromPrevMonth + 1; i <= daysInPrevMonth; i++) {
      calendarDays.push({
        date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), i),
        isCurrentMonth: false,
        isToday: false,
        hasEvents: false
      })
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i)
      calendarDays.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        hasEvents: false
      })
    }

    const daysNeeded = 42 - calendarDays.length
    const nextMonth = new Date(year, month + 1)
    
    for (let i = 1; i <= daysNeeded; i++) {
      calendarDays.push({
        date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i),
        isCurrentMonth: false,
        isToday: false,
        hasEvents: false
      })
    }

    return calendarDays
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const formatMonth = (date: Date): string => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' })
  }

  const handleMonthClick = (monthIndex: number) => {
    setSelectedMonth(monthIndex)
    setViewMode('month')
  }

  const handleBackToYear = () => {
    setViewMode('year')
  }

  const handleDayClick = (date: Date) => {
    setSelectedDate(date)
    setDayDetails(prev => ({
      ...prev,
      startDate: date.toISOString().split('T')[0],
      endDate: date.toISOString().split('T')[0]
    }))
    setIsModalOpen(true)
  }

  const handleSaveDayDetails = () => {
    // Here you would typically save to your backend
    // For now, we'll just close the modal
    setIsModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#151515] text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header with Year Navigation */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#f5d820]/20 to-transparent blur-xl"></div>
          <div className="relative flex items-center justify-between bg-[#2c2a6e]/80 p-6 rounded-2xl border border-[#f5d820]/20 backdrop-blur-sm">
            {viewMode === 'month' ? (
              // Month View Header
              <div className="flex items-center justify-between w-full">
                <button
                  onClick={handleBackToYear}
                  className="flex items-center gap-2 text-white/60 hover:text-white/90 transition-all"
                >
                  <ChevronLeft size={20} />
                  <span>Back to Year</span>
                </button>
                <h1 className="text-2xl font-bold">
                  {new Date(currentDate.getFullYear(), selectedMonth).toLocaleString('default', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </h1>
                <div className="w-24"></div> {/* Spacer for alignment */}
              </div>
            ) : (
              // Year View Header
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 rounded-lg text-white/60 hover:text-white/90 
                      hover:bg-white/10 transition-all"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <h2 className="text-2xl font-bold">Year {currentDate.getFullYear()}</h2>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 rounded-lg text-white/60 hover:text-white/90 
                      hover:bg-white/10 transition-all"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Calendar Grid */}
        <div className={`grid gap-4 transition-all duration-300 ${
          viewMode === 'year' 
            ? 'grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {viewMode === 'year' ? (
            // Year View
            months.map((_, index) => (
              <button
                key={index}
                onClick={() => handleMonthClick(index)}
                className="bg-[#2c2a6e]/80 p-4 rounded-xl hover:bg-[#2c2a6e] transition-all"
              >
                <h3 className="text-lg font-medium mb-4">
                  {new Date(currentDate.getFullYear(), index).toLocaleString('default', { month: 'long' })}
                </h3>
                {renderMonth(index)}
              </button>
            ))
          ) : (
            // Month View
            <div className="bg-[#2c2a6e]/80 p-6 rounded-xl">
              <div className="grid grid-cols-7 gap-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-white/60 text-sm py-2">
                    {day}
                  </div>
                ))}
                {getMonthDays(selectedMonth).map((day, index) => (
                  <button
                    key={index}
                    onClick={() => handleDayClick(day.date)}
                    className={`
                      aspect-square p-2 rounded-lg flex flex-col items-center justify-center
                      ${day.isCurrentMonth ? 'text-white/90' : 'text-white/30'}
                      ${day.isToday ? 'bg-[#f5d820] text-[#1E1B4B]' : 'hover:bg-white/5'}
                      ${selectedDate?.toDateString() === day.date.toDateString() ? 'ring-2 ring-[#f5d820]' : ''}
                      transition-all
                    `}
                  >
                    <span className="text-sm font-medium">{day.date.getDate()}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Day Details Modal */}
        {isModalOpen && selectedDate && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-b from-[#2c2a6e] to-[#1E1B4B] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-white/10">
              {/* Modal Header with Gradient Overlay */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#f5d820]/20 to-transparent blur-xl"></div>
                <div className="relative flex items-center justify-between p-6 border-b border-white/10">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                    Event Details
                  </h2>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-xl transition-all group"
                  >
                    <X size={20} className="text-white/60 group-hover:text-white transition-colors" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Label Input with Icon */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/60">Event Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={dayDetails.label}
                      onChange={(e) => setDayDetails(prev => ({ ...prev, label: e.target.value }))}
                      className="w-full bg-white/5 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 
                        focus:ring-[#f5d820]/50 text-white placeholder-white/30 border border-white/10"
                      placeholder="What's happening?"
                    />
                  </div>
                </div>

                {/* Date Range with Modern Selectors */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white/60">Starts</label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        value={dayDetails.startDate}
                        onChange={(e) => setDayDetails(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full bg-white/5 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 
                          focus:ring-[#f5d820]/50 text-white border border-white/10 appearance-none"
                      />
                      <CalendarIcon size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white/60">Ends</label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        value={dayDetails.endDate}
                        onChange={(e) => setDayDetails(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full bg-white/5 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 
                          focus:ring-[#f5d820]/50 text-white border border-white/10 appearance-none"
                      />
                      <CalendarIcon size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" />
                    </div>
                  </div>
                </div>

                {/* Color Selection with Premium Design */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/60">Event Color</label>
                  <div className="grid grid-cols-8 gap-3">
                    {[
                      '#f5d820', // Yellow (Primary)
                      '#ef4444', // Red
                      '#22c55e', // Green
                      '#3b82f6', // Blue
                      '#a855f7', // Purple
                      '#ec4899', // Pink
                      '#f97316', // Orange
                      '#64748b'  // Slate
                    ].map(color => (
                      <button
                        key={color}
                        onClick={() => setDayDetails(prev => ({ ...prev, color }))}
                        className={`
                          w-full aspect-square rounded-xl transition-all duration-200 
                          ${dayDetails.color === color 
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-[#2c2a6e] scale-110' 
                            : 'hover:scale-105'
                          }
                        `}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Notes with Enhanced Textarea */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/60">Notes</label>
                  <textarea
                    value={dayDetails.notes}
                    onChange={(e) => setDayDetails(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full h-32 bg-white/5 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 
                      focus:ring-[#f5d820]/50 text-white border border-white/10 resize-none placeholder-white/30"
                    placeholder="Add any additional details..."
                  />
                </div>
              </div>

              {/* Modal Footer with Premium Button */}
              <div className="p-6 border-t border-white/10">
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 
                      transition-all text-white/70 hover:text-white font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveDayDetails}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#f5d820] to-[#f5b820] 
                      text-[#1E1B4B] hover:opacity-90 transition-all font-medium shadow-lg 
                      shadow-[#f5d820]/20"
                  >
                    Save Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
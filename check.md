'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  hasEvents: boolean
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Get calendar days for current month view
  const getCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    
    const startingDayOfWeek = firstDayOfMonth.getDay()
    const daysInMonth = lastDayOfMonth.getDate()
    
    const today = new Date()
    const calendarDays: CalendarDay[] = []

    // Add days from previous month
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

    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i)
      calendarDays.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        hasEvents: false // You can implement event checking logic here
      })
    }

    // Add days from next month
    const daysNeeded = 42 - calendarDays.length // 6 rows * 7 days
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

  const days = getCalendarDays()

  return (
    <div className="min-h-screen bg-[#151515] text-white p-8">
      {/* Calendar Container */}
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <CalendarIcon size={32} className="text-[#f5d820]" />
            <span>Calendar</span>
          </h1>
          
          {/* Month Navigation */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-xl font-medium min-w-[200px] text-center">
              {formatMonth(currentDate)}
            </h2>
            <button 
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className={`bg-[#2c2a6e] rounded-2xl p-6 shadow-lg`}>
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-white/60 font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => (
              <button
                key={index}
                onClick={() => setSelectedDate(day.date)}
                className={`
                  aspect-square p-2 rounded-lg flex flex-col items-center justify-center
                  ${day.isCurrentMonth ? 'text-white/90' : 'text-white/30'}
                  ${day.isToday ? 'bg-[#f5d820] text-[#1E1B4B]' : 'hover:bg-white/5'}
                  ${selectedDate?.toDateString() === day.date.toDateString() ? 'ring-2 ring-[#f5d820]' : ''}
                  transition-all
                `}
              >
                <span className="text-sm font-medium">
                  {day.date.getDate()}
                </span>
                {day.hasEvents && (
                  <div className="w-1 h-1 rounded-full bg-[#f5d820] mt-1" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Date Details */}
        {selectedDate && (
          <div className={`bg-[#2c2a6e] rounded-2xl p-6 shadow-lg mt-6`}>
            <h3 className="text-xl font-medium mb-4">
              {selectedDate.toLocaleDateString('default', { 
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </h3>
            {/* Add your event/task list here */}
            <p className="text-white/60">No events scheduled</p>
          </div>
        )}
      </div>
    </div>
  )
}
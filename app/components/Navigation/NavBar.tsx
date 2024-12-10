'use client'

import { ChevronLeft, ChevronRight, Calendar, Clock, User } from 'lucide-react'
import { format } from 'date-fns'

interface NavBarProps {
  currentView: 'calendar' | 'pomodoro'
  onViewChange: (view: 'calendar' | 'pomodoro') => void
  user: any
  onAccountClick: () => void
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export function NavBar({ 
  currentView, 
  onViewChange, 
  user, 
  onAccountClick, 
  selectedDate,
  onDateChange 
}: NavBarProps) {
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(selectedDate.getDate() - 1)
    onDateChange(newDate)
  }

  const goToNextDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(selectedDate.getDate() + 1)
    onDateChange(newDate)
  }

  return (
    <nav className="bg-transparent border-b border-white/5 px-4">
      <div className="h-12 flex items-center justify-between">
        {/* Left section - View toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewChange('calendar')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all
              ${currentView === 'calendar' 
                ? 'bg-[#2D2A6E] text-white' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
          >
            <Calendar size={24} />
            <span className="text-l">Calendar</span>
          </button>
          <button
            onClick={() => onViewChange('pomodoro')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all
              ${currentView === 'pomodoro' 
                ? 'bg-[#2D2A6E] text-white' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
          >
            <Clock size={24} />
            <span className="text-l">Tasks</span>
          </button>
        </div>

        {/* Right section - User account */}
        <button
          onClick={onAccountClick}
          className="flex items-center gap-2 px-3 py-1.5 text-white/60 hover:text-white transition-colors"
        >
          <User size={24} />
          <span className="text-l">Account</span>
        </button>
      </div>
    </nav>
  )
} 
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

export const NavBar = ({ currentView, onViewChange, user, onAccountClick, selectedDate, onDateChange }: NavBarProps) => {
  return (
    <nav className="sticky top-0 z-50 bg-[#151515]/80 backdrop-blur-lg border-b border-white/10">
      <div className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
          {/* View Toggle */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onViewChange('pomodoro')}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors
                ${currentView === 'pomodoro' 
                  ? 'bg-[#2D2A6E] text-white' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline-block mr-1.5 sm:mr-2" />
              Pomodoro
            </button>
            <button
              onClick={() => onViewChange('calendar')}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors
                ${currentView === 'calendar' 
                  ? 'bg-[#2D2A6E] text-white' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline-block mr-1.5 sm:mr-2" />
              Calendar
            </button>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => onDateChange(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))}
                className="p-1 sm:p-1.5 hover:bg-white/5 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <span className="text-xs sm:text-sm font-medium min-w-[100px] sm:min-w-[120px] text-center">
                {format(selectedDate, 'MMM d, yyyy')}
              </span>
              <button
                onClick={() => onDateChange(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))}
                className="p-1 sm:p-1.5 hover:bg-white/5 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* User Account */}
            <button
              onClick={onAccountClick}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 hover:bg-white/5 rounded-lg transition-colors sm:static sm:translate-y-0 sm:ml-2"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}; 
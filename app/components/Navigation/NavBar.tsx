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
      <div className="px-4 lg:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          {/* View Toggle */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => onViewChange('pomodoro')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${currentView === 'pomodoro' 
                  ? 'bg-[#2D2A6E] text-white' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              <Clock className="w-4 h-4 inline-block mr-2" />
              Pomodoro
            </button>
            <button
              onClick={() => onViewChange('calendar')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${currentView === 'calendar' 
                  ? 'bg-[#2D2A6E] text-white' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              <Calendar className="w-4 h-4 inline-block mr-2" />
              Calendar
            </button>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onDateChange(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))}
                className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium min-w-[120px] text-center">
                {format(selectedDate, 'MMM d, yyyy')}
              </span>
              <button
                onClick={() => onDateChange(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))}
                className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* User Account */}
            <button
              onClick={onAccountClick}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors ml-2"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}; 
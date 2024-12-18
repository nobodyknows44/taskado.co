interface TimerTabsProps {
  timerMode: 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK'
  onModeChange: (mode: 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK') => void
}

export const TimerTabs = ({ timerMode, onModeChange }: TimerTabsProps) => {
  const tabs = [
    { id: 'FOCUS', label: 'FOCUS' },
    { id: 'SHORT_BREAK', label: 'SHORT BREAK' },
    { id: 'LONG_BREAK', label: 'LONG BREAK' }
  ]

  const handleTabClick = (e: React.MouseEvent, id: typeof timerMode) => {
    e.preventDefault();
    e.stopPropagation();
    onModeChange(id);
  };

  return (
    <div className="flex gap-1 sm:gap-1.5 p-0.5 sm:p-1 bg-white/5 rounded-xl sm:rounded-2xl mb-6 sm:mb-8 lg:mb-12">
      {tabs.map(({ id, label }) => {
        const isBreakMode = id.includes('BREAK');
        return (
          <button
            key={id}
            onClick={(e) => handleTabClick(e, id as typeof timerMode)}
            className={`flex-1 px-2 sm:px-3 lg:px-6 py-2.5 sm:py-2.5 lg:py-3 rounded-lg sm:rounded-xl 
              text-[10px] sm:text-xs lg:text-sm font-medium transition-all duration-300 
              touch-auto select-none active:scale-95 hover:scale-[1.02]
              ${timerMode === id
                ? `${id === 'FOCUS' ? 'bg-[#2c2a6e]' : id === 'SHORT_BREAK' ? 'bg-[#4682B4]' : 'bg-[#FFA500]'} text-white shadow-lg`
                : 'text-white/60 hover:text-white/80 hover:bg-white/5'
              }`}
          >
            {isBreakMode ? (
              <>
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{label.replace(' BREAK', '')}</span>
              </>
            ) : (
              label
            )}
          </button>
        );
      })}
    </div>
  )
} 
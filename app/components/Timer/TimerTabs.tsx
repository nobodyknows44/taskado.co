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

  return (
    <div className="flex gap-2 p-1 bg-white/5 rounded-2xl mb-12">
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onModeChange(id as typeof timerMode)}
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
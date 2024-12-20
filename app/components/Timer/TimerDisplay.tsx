import { formatTime } from '@/utils/formatters'

interface TimerDisplayProps {
  time: number
  isRunning: boolean
  setIsRunning: (running: boolean) => void
}

export const TimerDisplay = ({ time, isRunning, setIsRunning }: TimerDisplayProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRunning(!isRunning);
  };

  return (
    <div 
      className="text-center space-y-8 sm:space-y-12"
      style={{ touchAction: 'manipulation' }}
    >
      <div className="text-[72px] sm:text-[96px] lg:text-[120px] font-light tracking-tight leading-none">
        {formatTime(time)}
      </div>

      <div className="relative z-20" style={{ touchAction: 'manipulation' }}>
        <button
          type="button"
          onClick={handleClick}
          style={{ touchAction: 'manipulation' }}
          className={`w-full py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl text-base sm:text-lg font-medium 
            transition-colors cursor-pointer select-none active:translate-y-0.5
            ${isRunning
              ? 'bg-white/10 text-white hover:bg-white/15'
              : 'bg-[#f5d820] text-[#1E1B4B] hover:bg-[#f5d820]/90 shadow-lg'
            }`}
        >
          {isRunning ? 'PAUSE' : 'START FOCUS'}
        </button>
      </div>
    </div>
  )
} 
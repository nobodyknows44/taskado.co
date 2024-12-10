import { formatTime } from '@/utils/formatters'

interface TimerDisplayProps {
  time: number
  isRunning: boolean
  setIsRunning: (running: boolean) => void
}

export const TimerDisplay = ({ time, isRunning, setIsRunning }: TimerDisplayProps) => {
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
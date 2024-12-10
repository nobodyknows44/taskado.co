import { Volume2, VolumeX, SkipBack, SkipForward, Play, Pause } from 'lucide-react'
import { AudioTrack } from '@/types'

interface MusicPlayerProps {
  currentTrack: AudioTrack
  isPlaying: boolean
  isMuted: boolean
  volume: number
  onPlayPause: () => void
  onMuteToggle: () => void
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onTrackChange: (direction: 'next' | 'prev') => void
}

export const MusicPlayer = ({
  currentTrack,
  isPlaying,
  isMuted,
  volume,
  onPlayPause,
  onMuteToggle,
  onVolumeChange,
  onTrackChange
}: MusicPlayerProps) => {
  return (
    <div className="flex flex-col h-[250px]">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-xl font-semibold">Focus Sounds</h2>
      </div>

      <div className="flex-1 p-5 flex flex-col justify-between">
        <div className="space-y-5">
          <div className="text-center">
            <h3 className="text-xl font-medium text-white/90">{currentTrack.name}</h3>
          </div>
          
          <div className="flex justify-center items-center gap-8">
            <button
              className="text-white/60 hover:text-[#f5d820] transition-all"
              onClick={() => onTrackChange('prev')}
            >
              <SkipBack size={20} />
            </button>
            <button
              className="bg-[#f5d820] text-[#1E1B4B] p-4 rounded-full hover:bg-[#f5d820]/90 
                transform hover:scale-105 active:scale-95 transition-all shadow-lg"
              onClick={onPlayPause}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
            </button>
            <button
              className="text-white/60 hover:text-[#f5d820] transition-all"
              onClick={() => onTrackChange('next')}
            >
              <SkipForward size={20} />
            </button>
          </div>

          <div className="flex items-center gap-3 px-1">
            <button 
              onClick={onMuteToggle}
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
                onChange={onVolumeChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
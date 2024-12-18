import { TimerTabs } from './TimerTabs'
import { TimerDisplay } from './TimerDisplay'
import { QuotePanel } from './QuotePanel'
import { MusicPlayer } from '../Audio/MusicPlayer'
import { useTimer } from '@/hooks/useTimer'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'

export const TimerSection = () => {
  const {
    timerMode,
    setTimerMode,
    time,
    isRunning,
    setIsRunning
  } = useTimer()

  const {
    isPlaying,
    volume,
    isMuted,
    currentTrack,
    audioRef,
    togglePlay,
    toggleMute,
    handleVolumeChange,
    changeTrack
  } = useAudioPlayer()

  const handleModeChange = (mode: 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK') => {
    setTimerMode(mode);
  };

  const handleRunningChange = (running: boolean) => {
    setIsRunning(running);
  };

  return (
    <div className="lg:col-span-4 space-y-2 sm:space-y-4 lg:space-y-6">
      <div className="bg-[#2D2A6E] rounded-xl sm:rounded-2xl p-2 sm:p-4 lg:p-8 shadow-lg relative">
        <div className="relative z-20" style={{ touchAction: 'manipulation' }}>
          <div className="mb-6 sm:mb-8 lg:mb-12">
            <TimerTabs 
              timerMode={timerMode}
              onModeChange={handleModeChange}
            />
          </div>
          <div className="mt-4">
            <TimerDisplay 
              time={time}
              isRunning={isRunning}
              setIsRunning={handleRunningChange}
            />
          </div>
        </div>
      </div>

      <div className="bg-[#2D2A6E] rounded-xl sm:rounded-2xl p-2 sm:p-4 lg:p-6 shadow-lg relative z-0">
        <QuotePanel />
      </div>

      <div className="bg-[#2D2A6E] rounded-xl sm:rounded-2xl shadow-lg overflow-hidden relative z-0">
        <MusicPlayer
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          isMuted={isMuted}
          volume={volume}
          onPlayPause={togglePlay}
          onMuteToggle={toggleMute}
          onVolumeChange={handleVolumeChange}
          onTrackChange={changeTrack}
        />
      </div>

      <audio ref={audioRef} src={currentTrack.src} loop />
    </div>
  )
} 
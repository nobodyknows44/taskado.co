import { useState, useRef, useEffect } from 'react'
import { AudioTrack } from '@/types'
import { AUDIO_TRACKS } from '@/constants'

export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<AudioTrack>(AUDIO_TRACKS[0])
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
  }

  const changeTrack = (direction: 'next' | 'prev') => {
    const currentIndex = AUDIO_TRACKS.findIndex(track => track.id === currentTrack.id)
    let newIndex = direction === 'next' 
      ? (currentIndex + 1) % AUDIO_TRACKS.length
      : (currentIndex - 1 + AUDIO_TRACKS.length) % AUDIO_TRACKS.length
    setCurrentTrack(AUDIO_TRACKS[newIndex])
  }

  return {
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    currentTrack,
    setCurrentTrack,
    audioRef,
    togglePlay,
    toggleMute,
    handleVolumeChange,
    changeTrack
  }
} 
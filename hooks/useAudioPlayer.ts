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

  // Add your audio control functions here
  
  return {
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    currentTrack,
    setCurrentTrack,
    audioRef
  }
} 
import { useState, useEffect, useCallback } from 'react'
import { TIMER_DURATIONS } from '@/constants'

export const useTimer = () => {
  const [timerMode, setTimerMode] = useState<'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK'>('FOCUS')
  const [time, setTime] = useState(TIMER_DURATIONS.FOCUS)
  const [isRunning, setIsRunning] = useState(false)

  const resetTimer = useCallback(() => {
    setTime(TIMER_DURATIONS[timerMode])
    setIsRunning(false)
  }, [timerMode])

  useEffect(() => {
    resetTimer()
  }, [timerMode, resetTimer])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1)
      }, 1000)
    } else if (time === 0) {
      setIsRunning(false)
    }
    return () => clearInterval(interval)
  }, [isRunning, time])

  return {
    timerMode,
    setTimerMode,
    time,
    isRunning,
    setIsRunning,
    resetTimer
  }
} 
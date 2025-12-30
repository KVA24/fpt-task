"use client"

import {useEffect, useState} from "react"

export function useCountdown(initialMinutes = 15) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60) // Convert to seconds
  const [isExpired, setIsExpired] = useState(false)
  
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true)
      return
    }
    
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          setIsExpired(true)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [timeLeft])
  
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  
  const formatTime = () => {
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }
  
  const resetTimer = () => {
    setTimeLeft(initialMinutes * 60)
    setIsExpired(false)
  }
  
  return {
    timeLeft,
    isExpired,
    formatTime,
    resetTimer,
    minutes,
    seconds,
  }
}

'use client'

import React, { useEffect, useRef } from 'react'

declare global {
  interface Window {
    UnicornStudio: any;
  }
}

export default function HeroSection() {
  const unicornRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = "https://cdn.unicorn.studio/v1.3.2/unicornStudio.umd.js"
    script.async = true
    
    script.onload = () => {
      if (!window.UnicornStudio?.isInitialized) {
        window.UnicornStudio.init()
        window.UnicornStudio.isInitialized = true
      }
    }

    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  return (
    <section className="w-full h-screen flex items-center justify-center">
      <div 
        data-us-project="yg6M7xqxm8wudDCP7uhm"
        ref={unicornRef}
        className="w-full max-w-[100vw] h-[100vh]" 
      />
    </section>
  )
}

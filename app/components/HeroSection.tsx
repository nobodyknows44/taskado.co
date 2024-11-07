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
    document.body.appendChild(script)

    script.onload = () => {
      if (window.UnicornStudio && unicornRef.current) {
        const isMobile = window.innerWidth <= 768; // Check if it's mobile
        const scale = isMobile ? 0.7 : 1; // Adjust scale for mobile

        window.UnicornStudio.addScene({
          elementId: unicornRef.current.id,
          fps: 60,
          scale: scale, // Dynamic scale
          dpi: 1.5,
          projectId: "LJFs3NJlr1VGGop3poFS",
          lazyLoad: false,
          altText: "PomoPlanner Hero Section",
          ariaLabel: "Interactive hero section for PomoPlanner",
          production: false,
          interactivity: {
            mouse: {
              disableMobile: true,
            },
          },
        }).then((scene: any) => {
          console.log('Unicorn Studio scene loaded')
        }).catch((err: Error) => {
          console.error('Error loading Unicorn Studio scene:', err)
        })
      }
    }

    return () => {
      if (window.UnicornStudio) {
        window.UnicornStudio.destroy()
      }
      document.body.removeChild(script)
    }
  }, [])

  return (
    <section className="w-full h-screen overflow-hidden">
      <div 
        id="unicorn-hero"
        ref={unicornRef}
        className="w-full h-full"
      ></div>
    </section>
  )
}

import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pomodoro Planner',
  description: 'A productivity tool for time management and task tracking',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      </head>
      <body className="w-full min-h-screen overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}


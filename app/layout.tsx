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
      <body className="w-full min-h-screen overflow-x-hidden">
        <div className="max-w-full overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  )
}

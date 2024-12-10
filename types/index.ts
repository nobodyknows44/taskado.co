export interface ChatMessage {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

export interface AudioTrack {
  id: string
  name: string
  src: string
}

export interface Task {
  id: string
  userId: string
  title: string
  description?: string
  type: 'main' | 'secondary' | 'additional' | 'mini'
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'completed'
  tags: string[]
  createdAt: Date
  updatedAt: Date
  completedAt?: Date | null
  completedPomodoros: number
  targetPomodoros: number
} 
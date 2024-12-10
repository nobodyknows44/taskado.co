import { useState } from 'react'
import { ChatMessage } from '@/types'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || '')

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isSending, setIsSending] = useState(false)

  const sendMessage = async (message: string) => {
    if (!message.trim() || isSending) return

    setIsSending(true)
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newUserMessage])

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" })
      const result = await model.generateContent(message)
      const response = result.response
      const aiResponse = response.text()

      const newAiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, newAiMessage])
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I couldn't process your request. Please try again later.",
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsSending(false)
    }
  }

  return {
    messages,
    isSending,
    sendMessage
  }
} 
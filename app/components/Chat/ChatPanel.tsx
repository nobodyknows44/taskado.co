import { useState } from 'react'
import { Send } from 'lucide-react'
import { ChatMessage } from '@/types'

interface ChatPanelProps {
  messages: ChatMessage[]
  onSendMessage: (message: string) => void
  isSending: boolean
}

export const ChatPanel = ({ messages, onSendMessage, isSending }: ChatPanelProps) => {
  const [message, setMessage] = useState('')

  const handleSend = () => {
    if (!message.trim() || isSending) return
    onSendMessage(message)
    setMessage('')
  }

  return (
    <div className="flex flex-col h-[450px]">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-xl font-semibold">Chat with AI</h2>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`${
              message.sender === 'user'
                ? 'bg-white/5 ml-12'
                : 'bg-[#f5d820]/10 mr-12'
            } rounded-xl p-4`}
          >
            <p className="text-white/90">{message.text}</p>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask me anything..."
            className="w-full bg-white/5 rounded-xl pl-4 pr-12 py-3 text-white/90 
              placeholder-white/30 border border-white/10 focus:border-[#f5d820]/30 
              focus:ring-0 resize-none"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={isSending}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 
              text-[#f5d820] hover:text-[#f5d820]/80 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
} 
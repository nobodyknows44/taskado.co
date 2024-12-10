import { useState } from 'react'
import { Eraser, Copy } from 'lucide-react'

interface NotesPanelProps {
  notes: string
  onNotesChange: (notes: string) => void
}

export const NotesPanel = ({ notes, onNotesChange }: NotesPanelProps) => {
  const handleClearNotes = () => {
    if (window.confirm('Clear all notes?')) {
      onNotesChange('')
    }
  }

  const handleCopyToClipboard = async () => {
    await navigator.clipboard.writeText(notes)
  }

  const addQuickNote = (prefix: string) => {
    const newNote = `${prefix} `
    onNotesChange(notes ? `${notes}\n${newNote}` : newNote)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = e.target as HTMLTextAreaElement
      const start = textarea.selectionStart ?? 0
      const end = textarea.selectionEnd ?? 0
      
      onNotesChange(
        notes.substring(0, start) + '  ' + notes.substring(end)
      )
    }
  }

  return (
    <div className="flex flex-col h-[450px]">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Quick Notes</h2>
          <span className="text-xs text-white/50">Auto-saving</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleClearNotes}
            className="p-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-white/90 transition-all"
          >
            <Eraser size={16} />
          </button>
          <button 
            onClick={handleCopyToClipboard}
            className="p-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-white/90 transition-all"
          >
            <Copy size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-4">
        <div className="flex gap-2 flex-wrap">
          {['Task:', 'Idea:', 'Remember:'].map(prefix => (
            <button 
              key={prefix}
              onClick={() => addQuickNote(prefix)}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 
                text-sm text-white/70 hover:text-white/90 transition-all"
            >
              + {prefix.replace(':', '')}
            </button>
          ))}
        </div>

        <div className="flex-1 flex gap-2">
          <div className="text-right text-sm text-white/30 pt-1 select-none">
            {notes.split('\n').map((_, i) => (
              <div key={i} className="leading-6">{i + 1}</div>
            ))}
          </div>
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent resize-none text-white/90 leading-6
              placeholder:text-white/30 focus:outline-none focus:ring-0 
              scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent
              hover:scrollbar-thumb-white/20"
            placeholder="Start typing..."
          />
        </div>

        <div className="flex justify-between items-center text-xs text-white/50">
          <div className="flex gap-4">
            <span>{notes.split('\n').length} lines</span>
            <span>{notes.split(/\s+/).filter(Boolean).length} words</span>
          </div>
          <span>{notes.length} characters</span>
        </div>
      </div>
    </div>
  )
} 
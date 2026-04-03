'use client'
import { useState, KeyboardEvent } from 'react'
import Link from 'next/link'

interface TagsInputProps {
  value: string[]
  onChange: (tags: string[]) => void
}

export default function TagsInput({ value, onChange }: TagsInputProps) {
  const [input, setInput] = useState('')

  function addTag(raw: string) {
    const tag = raw.trim().toLowerCase().replace(/\s+/g, '-')
    if (!tag || value.includes(tag)) return
    onChange([...value, tag])
    setInput('')
  }

  function removeTag(tag: string) {
    onChange(value.filter(t => t !== tag))
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(input)
    }
    if (e.key === 'Backspace' && !input && value.length) {
      removeTag(value[value.length - 1])
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5 p-2 border border-gray-300 focus-within:border-sow-blue min-h-[42px] bg-white">
        {value.map(tag => (
          <span key={tag}
            className="flex items-center gap-1 bg-sow-teal text-white text-xs font-bold px-2 py-0.5 rounded-full">
            #{tag}
            <button type="button" onClick={() => removeTag(tag)}
              className="hover:text-red-200 font-black leading-none">×</button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          onBlur={() => addTag(input)}
          placeholder={value.length ? '' : 'Type a tag and press Enter (e.g. Football, WAEC)'}
          className="flex-1 min-w-[160px] outline-none text-sm bg-transparent"
        />
      </div>
      <p className="text-[10px] text-gray-400">Press Enter or comma to add a tag. Tags let readers find related articles.</p>
      {/* Quick-add suggestions */}
      <div className="flex flex-wrap gap-1">
        {['WAEC', 'JAMB', 'Football', 'Basketball', 'Drama', 'Science', 'Mathematics', 'Technology', 'Leadership'].map(s => (
          <button key={s} type="button" onClick={() => addTag(s)}
            className="text-[10px] px-2 py-0.5 border border-sow-teal text-sow-teal hover:bg-sow-teal hover:text-white rounded-full transition-colors">
            +{s}
          </button>
        ))}
      </div>
    </div>
  )
}

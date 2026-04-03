'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
}

export default function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok) {
        onChange(data.url)
      } else {
        setError(data.error || 'Upload failed.')
      }
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      {/* Preview */}
      {value && (
        <div className="relative w-full aspect-video bg-gray-100 overflow-hidden border border-gray-200">
          <Image src={value} alt="Cover preview" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 hover:bg-red-700"
          >
            Remove
          </button>
        </div>
      )}

      {/* Upload + URL row */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="btn-outline text-xs px-3 py-2 whitespace-nowrap disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : '↑ Upload Image'}
        </button>

        <input
          type="url"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Or paste an image URL"
          className="flex-1 border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-ink"
        />
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFile}
      />

      {error && <p className="text-xs text-red-600">{error}</p>}
      <p className="text-[10px] text-gray-400">JPEG, PNG, WebP or GIF · Max 5MB</p>
    </div>
  )
}

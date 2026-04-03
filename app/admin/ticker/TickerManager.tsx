'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface TickerItem {
  id: string
  text: string
  active: boolean
  sort_order: number
}

export default function TickerManager({ initialItems }: { initialItems: TickerItem[] }) {
  const router = useRouter()
  const [items, setItems] = useState<TickerItem[]>(initialItems)
  const [newText, setNewText] = useState('')
  const [loading, setLoading] = useState<string | null>(null)

  async function addItem() {
    if (!newText.trim()) return
    setLoading('add')
    const res = await fetch('/api/admin/ticker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newText.trim(), sort_order: items.length + 1 }),
    })
    if (res.ok) {
      setNewText('')
      router.refresh()
    }
    setLoading(null)
  }

  async function toggleItem(id: string, active: boolean) {
    setLoading(id)
    await fetch(`/api/admin/ticker/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active }),
    })
    setItems(prev => prev.map(i => i.id === id ? { ...i, active: !active } : i))
    setLoading(null)
  }

  async function deleteItem(id: string) {
    setLoading(id + '-del')
    await fetch(`/api/admin/ticker/${id}`, { method: 'DELETE' })
    setItems(prev => prev.filter(i => i.id !== id))
    setLoading(null)
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Add new */}
      <div className="border-2 border-ink p-5">
        <h2 className="text-[10px] tracking-[2px] uppercase font-bold mb-3">Add New Ticker Item</h2>
        <div className="flex gap-0 border border-ink">
          <input
            type="text"
            value={newText}
            onChange={e => setNewText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addItem()}
            placeholder="e.g. School sports day this Friday at 9am"
            className="flex-1 px-3 py-2.5 text-sm bg-paper outline-none"
          />
          <button
            onClick={addItem}
            disabled={loading === 'add' || !newText.trim()}
            className="bg-ink text-paper px-4 text-[10px] tracking-[2px] uppercase font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading === 'add' ? '...' : 'Add'}
          </button>
        </div>
      </div>

      {/* Items list */}
      <div>
        <h2 className="text-[10px] tracking-[2px] uppercase font-bold mb-3 pb-2 border-b border-gray-200">
          Current Items ({items.filter(i => i.active).length} active / {items.length} total)
        </h2>

        {items.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No ticker items yet.</p>
        ) : (
          <div className="space-y-2">
            {items.map(item => (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-3 border rounded ${
                  item.active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'
                }`}
              >
                {/* Active toggle */}
                <button
                  onClick={() => toggleItem(item.id, item.active)}
                  disabled={loading === item.id}
                  className={`flex-shrink-0 w-10 h-5 rounded-full transition-colors relative ${
                    item.active ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                  title={item.active ? 'Click to deactivate' : 'Click to activate'}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      item.active ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>

                <p className="flex-1 text-sm">{item.text}</p>

                <span className={`text-[9px] tracking-wide uppercase font-bold px-2 py-0.5 rounded ${
                  item.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {item.active ? 'Live' : 'Hidden'}
                </span>

                <button
                  onClick={() => deleteItem(item.id)}
                  disabled={loading === item.id + '-del'}
                  className="text-red-400 hover:text-red-600 text-xs font-bold transition-colors disabled:opacity-40"
                >
                  {loading === item.id + '-del' ? '...' : '✕'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview */}
      {items.some(i => i.active) && (
        <div>
          <h2 className="text-[10px] tracking-[2px] uppercase font-bold mb-2">Live Preview</h2>
          <div className="bg-ink text-paper flex items-center overflow-hidden h-8 rounded">
            <span className="flex-shrink-0 text-[10px] tracking-[2px] uppercase font-bold px-3 border-r border-white/20 h-full flex items-center">
              Breaking
            </span>
            <div className="overflow-hidden flex-1 px-3">
              <span className="text-[11px]">
                {items.filter(i => i.active).map(i => i.text).join(' · ')}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

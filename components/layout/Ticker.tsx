'use client'

interface TickerProps {
  items: string[]
}

export default function Ticker({ items }: TickerProps) {
  if (!items.length) return null
  const doubled = [...items, ...items]

  return (
    <div className="flex items-center overflow-hidden h-8 bg-sow-red text-white">
      <span className="flex-shrink-0 text-[10px] tracking-[2px] uppercase font-bold px-3 border-r border-white/20 h-full flex items-center bg-sow-gold text-ink whitespace-nowrap">
        ⚡ Breaking
      </span>
      <div className="overflow-hidden flex-1">
        <div className="flex gap-8 whitespace-nowrap" style={{ animation: 'ticker-scroll 30s linear infinite' }}>
          {doubled.map((item, i) => (
            <span key={i} className="text-[11px] tracking-wide">
              {item} &nbsp;·
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

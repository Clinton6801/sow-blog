// Maps category slugs to colour classes used throughout the site

export function getCategoryBadgeClass(slug?: string): string {
  const map: Record<string, string> = {
    news:         'badge-news',
    academics:    'badge-academics',
    sports:       'badge-sports',
    'arts-culture': 'badge-arts',
    opinion:      'badge-opinion',
    events:       'badge-events',
  }
  return map[slug || ''] || 'badge-default'
}

export function getCategorySectionClass(slug?: string): string {
  const map: Record<string, string> = {
    news:           'section-blue',
    academics:      'section-green',
    sports:         'section-red',
    'arts-culture': 'section-purple',
    opinion:        'section-teal',
    events:         'section-gold',
  }
  return map[slug || ''] || 'section-default'
}

export function getCategoryAccentColor(slug?: string): string {
  const map: Record<string, string> = {
    news:           '#1e3a8a',
    academics:      '#16a34a',
    sports:         '#dc2626',
    'arts-culture': '#7c3aed',
    opinion:        '#0891b2',
    events:         '#f59e0b',
  }
  return map[slug || ''] || '#1a1a2e'
}

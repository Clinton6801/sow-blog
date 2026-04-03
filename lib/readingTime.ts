/**
 * Estimates reading time in minutes from HTML or plain text content.
 * Average reading speed: 200 words per minute.
 */
export function getReadingTime(content: string): number {
  // Strip HTML tags
  const text = content.replace(/<[^>]+>/g, ' ')
  const words = text.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.ceil(words / 200)
  return Math.max(1, minutes)
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`
}

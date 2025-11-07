import { useState, useRef, useEffect } from 'react'

interface QuickAddInputProps {
  onAdd: (name: string) => Promise<void>
  placeholder?: string
  error?: string | null
}

export function QuickAddInput({ onAdd, placeholder = 'Type medication name...', error }: QuickAddInputProps) {
  const [value, setValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Auto-focus on mount and after successful submission
    inputRef.current?.focus()
  }, [isSubmitting])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedValue = value.trim()
    if (!trimmedValue) return

    setIsSubmitting(true)
    try {
      await onAdd(trimmedValue)
      // Clear and refocus after successful add (OpenSpec requirement)
      setValue('')
      inputRef.current?.focus()
    } catch (error) {
      console.error('Quick Add failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={isSubmitting}
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:ring-black'
        }`}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </form>
  )
}

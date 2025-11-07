import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export function AddDocument() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [folder, setFolder] = useState('')
  const [date, setDate] = useState('')
  const [tags, setTags] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const folderOptions = ['Prescriptions', 'Lab Results', 'Imaging', 'Consult', 'Other']

  const handleSubmit = async () => {
    if (!name.trim()) {
      setErrors({ name: 'Document name is required' })
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('documents')
        .insert({
          name: name.trim(),
          folder: folder || null,
          document_date: date || null,
          tags: tags || null
        })

      if (error) throw error

      navigate('/documents')
    } catch (error) {
      console.error('Error adding document:', error)
      setErrors({ submit: 'Failed to add document' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="h-14 border-b border-gray-300 flex items-center justify-between px-4">
        <button
          onClick={() => navigate('/documents')}
          className="text-lg"
        >
          ←
        </button>
        <h1 className="text-lg font-medium">Add Document</h1>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-4 py-2 bg-black text-white rounded font-extrabold w-[86px] h-[42px] disabled:bg-gray-400"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Take Photo button */}
        <button className="w-full h-[58px] bg-gray-100 border border-gray-600 rounded-lg font-extrabold text-base hover:bg-gray-200">
          📷 Take Photo
        </button>

        {/* Upload button */}
        <button className="w-full h-[58px] bg-gray-100 border border-gray-600 rounded-lg font-extrabold text-base hover:bg-gray-200">
          📤 Upload File
        </button>

        {/* Document Name */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Document Name (Required)
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (errors.name) setErrors({ ...errors, name: '' })
            }}
            placeholder="Enter document name..."
            className={`w-full h-[58px] px-4 border rounded focus:outline-none focus:ring-2 ${
              errors.name
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-black'
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Folder */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Folder
          </label>
          <div className="relative">
            <select
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="w-full h-[58px] px-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black appearance-none"
            >
              <option value="">Select folder...</option>
              {folderOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              ▼
            </div>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Document Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full h-[58px] px-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. urgent, follow-up"
            className="w-full h-[58px] px-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {errors.submit && (
          <p className="text-sm text-red-600">{errors.submit}</p>
        )}
      </div>
    </div>
  )
}

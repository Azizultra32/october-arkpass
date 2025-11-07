import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

interface SupplementFormData {
  name: string
  dosage: string
  frequency: string
  start_date: string | null
  details: string
}

export function AddSupplement() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<SupplementFormData>({
    name: '',
    dosage: '',
    frequency: '',
    start_date: null,
    details: ''
  })
  const [showMore, setShowMore] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field: keyof SupplementFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Name (Incomplete)'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const dataToInsert = {
        name: formData.name.trim(),
        dosage: formData.dosage.trim() || null,
        frequency: formData.frequency.trim() || null,
        start_date: formData.start_date,
        details: formData.details.trim() || null
      }

      const { error } = await supabase
        .from('supplements')
        .insert(dataToInsert)

      if (error) throw error

      navigate('/supplements')
    } catch (error) {
      console.error('Error adding supplement:', error)
      setErrors({ submit: 'Failed to add supplement' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="h-14 border-b border-gray-300 flex items-center justify-between px-4">
        <button
          onClick={() => navigate('/supplements')}
          className="text-lg"
        >
          ←
        </button>
        <h1 className="text-lg font-medium">Add Supplement</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/supplements')}
            className="px-3 py-1 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-black text-white rounded font-extrabold text-sm h-[42px] disabled:bg-gray-400"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Name */}
        <div>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Name* (Required)"
            className={`w-full h-[58px] px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
              errors.name
                ? 'border-red-500 focus:ring-red-500 placeholder-red-500'
                : 'border-gray-300 focus:ring-black'
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Dosage */}
        <div>
          <input
            type="text"
            value={formData.dosage}
            onChange={(e) => handleChange('dosage', e.target.value)}
            placeholder="Dosage"
            className="w-full h-[58px] px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Frequency */}
        <div>
          <input
            type="text"
            value={formData.frequency}
            onChange={(e) => handleChange('frequency', e.target.value)}
            placeholder="Frequency"
            className="w-full h-[58px] px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Show more/less */}
        {!showMore ? (
          <button
            onClick={() => setShowMore(true)}
            className="text-blue-600 text-base font-medium"
          >
            Show more ▼
          </button>
        ) : (
          <>
            {/* Start date */}
            <div className="relative">
              <input
                type="date"
                value={formData.start_date || ''}
                onChange={(e) => handleChange('start_date', e.target.value)}
                placeholder="Start"
                className="w-full h-[58px] px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-2xl">
                📅
              </div>
            </div>

            {/* Details */}
            <div>
              <textarea
                value={formData.details}
                onChange={(e) => handleChange('details', e.target.value)}
                placeholder="Details"
                className="w-full h-[90px] px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black resize-none"
              />
            </div>

            {/* Documents */}
            <div>
              <h2 className="text-base font-bold uppercase mb-2">DOCUMENTS</h2>
              <p className="text-gray-500 text-center py-4">No Documents</p>
              <button className="w-full h-[58px] bg-gray-100 border border-gray-600 rounded font-extrabold text-sm hover:bg-gray-200">
                + Add Documents
              </button>
            </div>

            <button
              onClick={() => setShowMore(false)}
              className="text-blue-600 text-base font-medium"
            >
              Show less ▲
            </button>
          </>
        )}

        {errors.submit && (
          <p className="text-sm text-red-600">{errors.submit}</p>
        )}
      </div>
    </div>
  )
}

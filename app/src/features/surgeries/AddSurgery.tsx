import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

interface SurgeryFormData {
  name: string
  when_date: string | null
  details: string
  complications: string
  attending_surgeon: string
}

export function AddSurgery() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<SurgeryFormData>({
    name: '',
    when_date: null,
    details: '',
    complications: '',
    attending_surgeon: ''
  })
  const [showMore, setShowMore] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field: keyof SurgeryFormData, value: string) => {
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
        when_date: formData.when_date,
        details: formData.details.trim() || null,
        complications: formData.complications.trim() || null,
        attending_surgeon: formData.attending_surgeon.trim() || null
      }

      const { error } = await supabase
        .from('surgeries')
        .insert(dataToInsert)

      if (error) throw error

      navigate('/surgeries')
    } catch (error) {
      console.error('Error adding surgery:', error)
      setErrors({ submit: 'Failed to add surgery' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Back arrow + Title + Save button */}
      <div className="h-14 border-b border-gray-300 flex items-center justify-between px-4">
        <button
          onClick={() => navigate('/surgeries')}
          className="text-lg"
        >
          ←
        </button>
        <h1 className="text-lg font-medium">Add Previous Surgery</h1>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-4 py-2 bg-black text-white rounded font-extrabold w-[86px] h-[42px] disabled:bg-gray-400"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Name field - 58px height */}
        <div>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Name (Required)"
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

        {/* Show more/less toggle */}
        {!showMore ? (
          <button
            onClick={() => setShowMore(true)}
            className="text-blue-600 text-base font-medium"
          >
            Show more
          </button>
        ) : (
          <>
            {/* When field - 58px height with calendar icon (Date OR Age - for now just date) */}
            <div className="relative">
              <input
                type="date"
                value={formData.when_date || ''}
                onChange={(e) => handleChange('when_date', e.target.value)}
                placeholder="When (Date)"
                className="w-full h-[58px] px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-2xl">
                📅
              </div>
            </div>

            {/* Details field - 90px height (multi-line) */}
            <div>
              <textarea
                value={formData.details}
                onChange={(e) => handleChange('details', e.target.value)}
                placeholder="Details"
                className="w-full h-[90px] px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black resize-none"
              />
            </div>

            {/* Complications field - 90px height (multi-line) */}
            <div>
              <textarea
                value={formData.complications}
                onChange={(e) => handleChange('complications', e.target.value)}
                placeholder="Complications"
                className="w-full h-[90px] px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black resize-none"
              />
            </div>

            {/* Attending Surgeon field - 58px height */}
            <div>
              <input
                type="text"
                value={formData.attending_surgeon}
                onChange={(e) => handleChange('attending_surgeon', e.target.value)}
                placeholder="Attending Surgeon"
                className="w-full h-[58px] px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <button
              onClick={() => setShowMore(false)}
              className="text-blue-600 text-base font-medium"
            >
              Show less
            </button>
          </>
        )}

        {/* Divider */}
        <div className="border-t border-gray-300 my-6"></div>

        {/* DOCUMENTS section */}
        <div>
          <h2 className="text-sm font-semibold text-gray-600 uppercase mb-2">DOCUMENTS</h2>
          <p className="text-gray-500 text-center py-4">No Documents</p>
          <button className="w-full h-[58px] bg-gray-100 border border-gray-600 rounded font-extrabold text-sm hover:bg-gray-200">
            + Add Documents
          </button>
        </div>

        {errors.submit && (
          <p className="text-sm text-red-600">{errors.submit}</p>
        )}
      </div>
    </div>
  )
}

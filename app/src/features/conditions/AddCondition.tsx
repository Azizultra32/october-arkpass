import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

interface ConditionFormData {
  name: string
  type: string
  diagnosis_date: string | null
  details: string
}

export function AddCondition() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<ConditionFormData>({
    name: '',
    type: '',
    diagnosis_date: null,
    details: ''
  })
  const [showMore, setShowMore] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field: keyof ConditionFormData, value: string) => {
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
        type: formData.type || null,
        diagnosis_date: formData.diagnosis_date,
        details: formData.details.trim() || null
      }

      const { error } = await supabase
        .from('conditions')
        .insert(dataToInsert)

      if (error) throw error

      navigate('/conditions')
    } catch (error) {
      console.error('Error adding condition:', error)
      setErrors({ submit: 'Failed to add condition' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Back arrow + Title + Save button */}
      <div className="h-14 border-b border-gray-300 flex items-center justify-between px-4">
        <button
          onClick={() => navigate('/conditions')}
          className="text-lg"
        >
          ←
        </button>
        <h1 className="text-lg font-medium">Add Condition</h1>
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

        {/* Type field - Radio buttons */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-600">Type</label>
          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input
                type="radio"
                name="type"
                value="chronic"
                checked={formData.type === 'chronic'}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-5 h-5"
              />
              <span className="text-base">Chronic</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="radio"
                name="type"
                value="transient_recurrent"
                checked={formData.type === 'transient_recurrent'}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-5 h-5"
              />
              <span className="text-base">Transient-Recurrent</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="radio"
                name="type"
                value="transient_resolved"
                checked={formData.type === 'transient_resolved'}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-5 h-5"
              />
              <span className="text-base">Transient-Resolved</span>
            </label>
          </div>
        </div>

        {/* Show more/less toggle */}
        {!showMore ? (
          <button
            onClick={() => setShowMore(true)}
            className="text-blue-600 text-base font-medium w-full text-center"
          >
            Show more
          </button>
        ) : (
          <>
            {/* Diagnosis Date field - 58px height with calendar icon */}
            <div className="relative">
              <input
                type="date"
                value={formData.diagnosis_date || ''}
                onChange={(e) => handleChange('diagnosis_date', e.target.value)}
                placeholder="Diagnosis Date"
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

            <button
              onClick={() => setShowMore(false)}
              className="text-blue-600 text-base font-medium w-full text-center"
            >
              Show less
            </button>
          </>
        )}

        {/* Separator */}
        <div className="h-[2px] bg-gray-300 my-6"></div>

        {/* MEDICATIONS section */}
        <div>
          <h2 className="text-base font-bold uppercase mb-2">MEDICATIONS</h2>
          <div className="h-[2px] bg-gray-300 mb-3"></div>
          <p className="text-gray-500 text-center py-4">No Medications</p>
          <button className="w-full h-[58px] bg-gray-100 border border-gray-600 rounded font-extrabold text-sm hover:bg-gray-200">
            + Add Medications
          </button>
        </div>

        {/* Separator */}
        <div className="h-[2px] bg-gray-300 my-6"></div>

        {/* DOCUMENTS section */}
        <div>
          <h2 className="text-base font-bold uppercase mb-2">DOCUMENTS</h2>
          <div className="h-[2px] bg-gray-300 mb-3"></div>
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

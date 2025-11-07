import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

interface ImmunizationFormData {
  name: string
  description_purpose: string
  when_administered: string | null
  date_administered: string | null
  location_administered: string
}

export function AddImmunization() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<ImmunizationFormData>({
    name: '',
    description_purpose: '',
    when_administered: null,
    date_administered: null,
    location_administered: ''
  })
  const [showMore, setShowMore] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Location options
  const locationOptions = [
    'Arm',
    'Gluteal',
    'Arm/gluteal',
    'Thigh',
    'Other'
  ]

  const handleChange = (field: keyof ImmunizationFormData, value: string) => {
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
        description_purpose: formData.description_purpose.trim() || null,
        when_administered: formData.when_administered,
        date_administered: formData.date_administered,
        location_administered: formData.location_administered || null
      }

      const { error } = await supabase
        .from('immunizations')
        .insert(dataToInsert)

      if (error) throw error

      navigate('/immunizations')
    } catch (error) {
      console.error('Error adding immunization:', error)
      setErrors({ submit: 'Failed to add immunization' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Back arrow + Title + Cancel/Save buttons */}
      <div className="h-14 border-b border-gray-300 flex items-center justify-between px-4">
        <button
          onClick={() => navigate('/immunizations')}
          className="text-lg"
        >
          ←
        </button>
        <h1 className="text-lg font-medium">Add Immunization</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/immunizations')}
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
        {/* Name field - 58px height */}
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

        {/* Description/Purpose field - 58px height */}
        <div>
          <input
            type="text"
            value={formData.description_purpose}
            onChange={(e) => handleChange('description_purpose', e.target.value)}
            placeholder="Description/Purpose"
            className="w-full h-[58px] px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Show more/less toggle */}
        {!showMore ? (
          <button
            onClick={() => setShowMore(true)}
            className="text-blue-600 text-base font-medium"
          >
            Show more ▼
          </button>
        ) : (
          <>
            {/* When field - 58px height with calendar icon */}
            <div className="relative">
              <input
                type="date"
                value={formData.when_administered || ''}
                onChange={(e) => handleChange('when_administered', e.target.value)}
                placeholder="When"
                className="w-full h-[58px] px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-2xl">
                📅
              </div>
            </div>

            {/* Date Administered field - 58px height with calendar icon */}
            <div className="relative">
              <input
                type="date"
                value={formData.date_administered || ''}
                onChange={(e) => handleChange('date_administered', e.target.value)}
                placeholder="Date Administered"
                className="w-full h-[58px] px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-2xl">
                📅
              </div>
            </div>

            {/* Location Administered dropdown - 58px height */}
            <div className="relative">
              <select
                value={formData.location_administered}
                onChange={(e) => handleChange('location_administered', e.target.value)}
                className="w-full h-[58px] px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black appearance-none"
              >
                <option value="">Location Administered - Select</option>
                {locationOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                ▼
              </div>
            </div>

            {/* Documents section */}
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

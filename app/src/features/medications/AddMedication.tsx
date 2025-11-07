import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

interface MedicationFormData {
  name: string
  dosage: string
  frequency: string
  route: string
  start_date: string | null
  status: string
}

export function AddMedication() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<MedicationFormData>({
    name: '',
    dosage: '',
    frequency: '',
    route: '',
    start_date: null,
    status: ''
  })
  const [showMore, setShowMore] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Frequency options from MEDICATIONS_DROPDOWN_OPTIONS.md
  const frequencyOptions = [
    { value: '1 time a day', label: '1 time a day' },
    { value: '2 times a day', label: '2 times a day' },
    { value: '3 times a day', label: '3 times a day' },
    { value: '4 times a day', label: '4 times a day' },
    { value: 'As needed', label: 'As needed' }
  ]

  // Route options from OpenSpec
  const routeOptions = [
    { value: 'Oral', label: 'Oral' },
    { value: 'Sublingual (SL)', label: 'Sublingual (SL)' },
    { value: 'Injection (INJ)', label: 'Injection (INJ)' },
    { value: 'Drops', label: 'Drops' },
    { value: 'Inhaler', label: 'Inhaler' },
    { value: 'Topical', label: 'Topical' },
    { value: 'Patch', label: 'Patch' },
    { value: 'Other', label: 'Other' }
  ]

  // Status options from OpenSpec
  const statusOptions = [
    { value: 'Taking regularly as directed', label: 'Taking regularly as directed' },
    { value: 'Taking but not regularly', label: 'Taking but not regularly' },
    { value: 'As needed', label: 'As needed' },
    { value: 'Discontinued', label: 'Discontinued' }
  ]

  const handleChange = (field: keyof MedicationFormData, value: string) => {
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
        frequency: formData.frequency || null,
        route: formData.route || null,
        start_date: formData.start_date,
        status: formData.status || null
      }

      const { error } = await supabase
        .from('medications')
        .insert(dataToInsert)

      if (error) throw error

      navigate('/medications')
    } catch (error) {
      console.error('Error adding medication:', error)
      setErrors({ submit: 'Failed to add medication' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Back arrow + Title + Save button */}
      <div className="h-14 border-b border-gray-300 flex items-center justify-between px-4">
        <button
          onClick={() => navigate('/medications')}
          className="text-lg"
        >
          ←
        </button>
        <h1 className="text-lg font-medium">Add Medication</h1>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="text-blue-600 disabled:text-gray-400"
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
            className={`w-full h-[58px] px-4 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.name
                ? 'border-red-500 focus:ring-red-500 placeholder-red-500'
                : 'border-gray-300 focus:ring-black'
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Dosage field - 58px height */}
        <div>
          <input
            type="text"
            value={formData.dosage}
            onChange={(e) => handleChange('dosage', e.target.value)}
            placeholder="Dosage"
            className="w-full h-[58px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Frequency dropdown - 58px height */}
        <div className="relative">
          <select
            value={formData.frequency}
            onChange={(e) => handleChange('frequency', e.target.value)}
            className="w-full h-[58px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black appearance-none"
          >
            <option value="">Frequency - Select</option>
            {frequencyOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {/* Chevron icon */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            ▼
          </div>
        </div>

        {/* Show more/less toggle */}
        {!showMore ? (
          <button
            onClick={() => setShowMore(true)}
            className="text-blue-600 text-sm"
          >
            Show more
          </button>
        ) : (
          <>
            {/* ORAL/SL/INJ/DROPS dropdown - 58px height */}
            <div className="relative">
              <select
                value={formData.route}
                onChange={(e) => handleChange('route', e.target.value)}
                className="w-full h-[58px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black appearance-none"
              >
                <option value="">ORAL/SL/INJ/DROPS - Select</option>
                {routeOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                ▼
              </div>
            </div>

            {/* Prescribed / Start day - 58px height */}
            <div className="relative">
              <input
                type="date"
                value={formData.start_date || ''}
                onChange={(e) => handleChange('start_date', e.target.value)}
                placeholder="Prescribed / Start day"
                className="w-full h-[58px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                📅
              </div>
            </div>

            {/* Status dropdown - 58px height */}
            <div className="relative">
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full h-[58px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black appearance-none"
              >
                <option value="">Status - Select</option>
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                ▼
              </div>
            </div>

            <button
              onClick={() => setShowMore(false)}
              className="text-blue-600 text-sm"
            >
              Show less
            </button>
          </>
        )}

        {/* Divider */}
        <div className="border-t border-gray-300 my-6"></div>

        {/* CONDITIONS section */}
        <div>
          <h2 className="text-sm font-semibold text-gray-600 mb-2">CONDITIONS</h2>
          <p className="text-gray-500">No Conditions</p>
          <button className="text-blue-600 text-sm mt-2">+ Add Condition</button>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 my-6"></div>

        {/* DOCUMENTS section */}
        <div>
          <h2 className="text-sm font-semibold text-gray-600 mb-2">DOCUMENTS</h2>
          <p className="text-gray-500">No Documents</p>
          <button className="text-blue-600 text-sm mt-2">+ Add Documents</button>
        </div>

        {errors.submit && (
          <p className="text-sm text-red-600">{errors.submit}</p>
        )}
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

interface FamilyMemberFormData {
  relative: string
  status: string
  conditions: string
}

export function EditFamilyMember() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FamilyMemberFormData>({
    relative: '',
    status: '',
    conditions: ''
  })
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const relativeOptions = [
    'Mother',
    'Father',
    'Sister',
    'Brother',
    'Maternal Grandmother',
    'Maternal Grandfather',
    'Paternal Grandmother',
    'Paternal Grandfather',
    'Aunt',
    'Uncle',
    'Cousin'
  ]

  const statusOptions = ['Alive', 'Deceased', 'Unknown']

  useEffect(() => {
    if (id) {
      fetchFamilyMember(id)
    }
  }, [id])

  async function fetchFamilyMember(memberId: string) {
    try {
      const { data, error } = await supabase
        .from('family_history')
        .select('*')
        .eq('id', memberId)
        .single()

      if (error) throw error

      setFormData({
        relative: data.relative,
        status: data.status,
        conditions: data.conditions || ''
      })
    } catch (error) {
      console.error('Error fetching family member:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof FamilyMemberFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.relative) {
      newErrors.relative = 'Relative is required'
    }
    if (!formData.status) {
      newErrors.status = 'Status is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const dataToUpdate = {
        relative: formData.relative,
        status: formData.status,
        conditions: formData.conditions.trim() || null
      }

      const { error } = await supabase
        .from('family_history')
        .update(dataToUpdate)
        .eq('id', id)

      if (error) throw error

      navigate('/family-history')
    } catch (error) {
      console.error('Error updating family member:', error)
      setErrors({ submit: 'Failed to update family member' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="h-14 border-b border-gray-300 flex items-center justify-between px-4">
        <button
          onClick={() => navigate('/family-history')}
          className="text-lg"
        >
          ←
        </button>
        <h1 className="text-lg font-medium">{formData.relative}</h1>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-4 py-2 bg-black text-white rounded font-extrabold w-[86px] h-[42px] disabled:bg-gray-400"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Relative and Status dropdowns side by side */}
        <div className="grid grid-cols-2 gap-3">
          {/* Relative dropdown */}
          <div className="relative">
            <select
              value={formData.relative}
              onChange={(e) => handleChange('relative', e.target.value)}
              className={`w-full h-[58px] px-4 border rounded focus:outline-none focus:ring-2 appearance-none ${
                errors.relative
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-black'
              }`}
            >
              <option value="">Relative</option>
              {relativeOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              ▼
            </div>
            {errors.relative && (
              <p className="mt-1 text-sm text-red-600">{errors.relative}</p>
            )}
          </div>

          {/* Status dropdown */}
          <div className="relative">
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className={`w-full h-[58px] px-4 border rounded focus:outline-none focus:ring-2 appearance-none ${
                errors.status
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-black'
              }`}
            >
              <option value="">Status</option>
              {statusOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              ▼
            </div>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status}</p>
            )}
          </div>
        </div>

        {/* Conditions textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Known medical conditions / cause of death
          </label>
          <textarea
            value={formData.conditions}
            onChange={(e) => handleChange('conditions', e.target.value)}
            placeholder="Enter conditions..."
            className="w-full h-[90px] px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black resize-none"
          />
        </div>

        {errors.submit && (
          <p className="text-sm text-red-600">{errors.submit}</p>
        )}
      </div>
    </div>
  )
}

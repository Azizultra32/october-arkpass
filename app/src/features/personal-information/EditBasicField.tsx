import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

type FieldConfig = {
  field: string
  label: string
  type: 'text' | 'email' | 'tel' | 'date' | 'dropdown' | 'textarea' | 'height-weight' | 'insurance' | 'doctor' | 'emergency'
  options?: string[]
}

const FIELD_CONFIGS: Record<string, FieldConfig> = {
  gender: {
    field: 'gender',
    label: 'Gender',
    type: 'dropdown',
    options: ['Male', 'Female', 'Non-binary', 'Prefer not to say', 'Other']
  },
  dob: {
    field: 'date_of_birth',
    label: 'Date of Birth',
    type: 'date'
  },
  phone: {
    field: 'mobile_phone',
    label: 'Mobile Phone',
    type: 'tel'
  },
  email: {
    field: 'email',
    label: 'Email',
    type: 'email'
  },
  address: {
    field: 'legal_address',
    label: 'Legal Mailing Address',
    type: 'textarea'
  }
}

export function EditBasicField() {
  const { field } = useParams<{ field: string }>()
  const navigate = useNavigate()
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [personalInfoId, setPersonalInfoId] = useState<string | null>(null)

  const config = field ? FIELD_CONFIGS[field] : null

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const { data, error } = await supabase
        .from('personal_information')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setPersonalInfoId(data.id)
        if (config) {
          setValue(data[config.field] || '')
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!personalInfoId || !config) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('personal_information')
        .update({ [config.field]: value || null })
        .eq('id', personalInfoId)

      if (error) throw error

      navigate('/personal-information')
    } catch (error) {
      console.error('Error updating:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || !config) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="h-14 border-b border-gray-300 flex items-center justify-between px-4">
        <button onClick={() => navigate('/personal-information')} className="text-lg">←</button>
        <h1 className="text-lg font-medium">{config.label}</h1>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-4 py-2 bg-black text-white rounded font-extrabold w-[86px] h-[42px] disabled:bg-gray-400"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">{config.label}</label>

          {config.type === 'dropdown' ? (
            <div className="relative">
              <select
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full h-[58px] px-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black appearance-none"
              >
                <option value="">Select...</option>
                {config.options?.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
            </div>
          ) : config.type === 'textarea' ? (
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Enter ${config.label.toLowerCase()}...`}
              className="w-full h-[90px] px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black resize-none"
            />
          ) : (
            <input
              type={config.type}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Enter ${config.label.toLowerCase()}...`}
              className="w-full h-[58px] px-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
            />
          )}
        </div>
      </div>
    </div>
  )
}

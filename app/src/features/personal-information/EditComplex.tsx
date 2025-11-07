import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

type ComplexFieldType = 'insurance' | 'doctor' | 'emergency'

export function EditComplex() {
  const { field } = useParams<{ field: string }>()
  const navigate = useNavigate()
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [personalInfoId, setPersonalInfoId] = useState<string | null>(null)

  const fieldConfig: Record<ComplexFieldType, { title: string; fields: Array<{ key: string; label: string; type: string }> }> = {
    insurance: {
      title: 'Health Insurance',
      fields: [
        { key: 'health_insurance_number', label: 'Insurance Number', type: 'text' },
        { key: 'health_insurance_jurisdiction', label: 'Jurisdiction', type: 'text' }
      ]
    },
    doctor: {
      title: 'Family Doctor',
      fields: [
        { key: 'family_doctor_name', label: 'Doctor Name', type: 'text' },
        { key: 'family_doctor_phone', label: 'Phone Number', type: 'tel' }
      ]
    },
    emergency: {
      title: 'Emergency Contact',
      fields: [
        { key: 'emergency_contact_name', label: 'Contact Name', type: 'text' },
        { key: 'emergency_contact_relationship', label: 'Relationship', type: 'text' },
        { key: 'emergency_contact_phone', label: 'Phone Number', type: 'tel' }
      ]
    }
  }

  const config = field ? fieldConfig[field as ComplexFieldType] : null

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

      if (data && config) {
        setPersonalInfoId(data.id)
        const values: Record<string, string> = {}
        config.fields.forEach(f => {
          values[f.key] = data[f.key] || ''
        })
        setFormData(values)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    if (!personalInfoId || !config) return

    setIsSubmitting(true)
    try {
      const updateData: Record<string, string | null> = {}
      config.fields.forEach(f => {
        updateData[f.key] = formData[f.key] || null
      })

      const { error } = await supabase
        .from('personal_information')
        .update(updateData)
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
        <h1 className="text-lg font-medium">{config.title}</h1>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-4 py-2 bg-black text-white rounded font-extrabold w-[86px] h-[42px] disabled:bg-gray-400"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="p-4 space-y-4">
        {config.fields.map(fieldDef => (
          <div key={fieldDef.key}>
            <label className="block text-sm font-medium text-gray-600 mb-1">{fieldDef.label}</label>
            <input
              type={fieldDef.type}
              value={formData[fieldDef.key] || ''}
              onChange={(e) => handleChange(fieldDef.key, e.target.value)}
              placeholder={`Enter ${fieldDef.label.toLowerCase()}...`}
              className="w-full h-[58px] px-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

interface SmokingFormData {
  smoking_status: 'smoker' | 'quit' | 'never' | ''
  smoking_quantity: string
  smoking_duration_value: string
  smoking_duration_unit: 'years' | 'months'
  smoking_quit_date: string
  smoking_past_quantity: string
}

export function EditSmoking() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<SmokingFormData>({
    smoking_status: '',
    smoking_quantity: '',
    smoking_duration_value: '',
    smoking_duration_unit: 'years',
    smoking_quit_date: '',
    smoking_past_quantity: ''
  })
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const { data, error } = await supabase
        .from('social_history')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setFormData({
          smoking_status: data.smoking_status || '',
          smoking_quantity: data.smoking_quantity || '',
          smoking_duration_value: data.smoking_duration_value?.toString() || '',
          smoking_duration_unit: data.smoking_duration_unit || 'years',
          smoking_quit_date: data.smoking_quit_date || '',
          smoking_past_quantity: data.smoking_past_quantity || ''
        })
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof SmokingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const dataToUpdate: any = {
        smoking_status: formData.smoking_status || null,
        smoking_quantity: null,
        smoking_duration_value: null,
        smoking_duration_unit: null,
        smoking_quit_date: null,
        smoking_past_quantity: null
      }

      // Set fields based on smoking status
      if (formData.smoking_status === 'smoker') {
        dataToUpdate.smoking_quantity = formData.smoking_quantity || null
        dataToUpdate.smoking_duration_value = formData.smoking_duration_value ? parseInt(formData.smoking_duration_value) : null
        dataToUpdate.smoking_duration_unit = formData.smoking_duration_unit
      } else if (formData.smoking_status === 'quit') {
        dataToUpdate.smoking_quit_date = formData.smoking_quit_date || null
        dataToUpdate.smoking_past_quantity = formData.smoking_past_quantity || null
      }

      const { error } = await supabase
        .from('social_history')
        .update(dataToUpdate)
        .eq('id', (await supabase.from('social_history').select('id').single()).data?.id)

      if (error) throw error

      navigate('/social-history')
    } catch (error) {
      console.error('Error updating:', error)
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
          onClick={() => navigate('/social-history')}
          className="text-lg"
        >
          ←
        </button>
        <h1 className="text-lg font-medium">Smoking</h1>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-4 py-2 bg-black text-white rounded font-extrabold w-[86px] h-[42px] disabled:bg-gray-400"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Smoking Status Radio Buttons */}
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="smoking_status"
              value="smoker"
              checked={formData.smoking_status === 'smoker'}
              onChange={(e) => handleChange('smoking_status', e.target.value)}
              className="w-5 h-5"
            />
            <span className="text-base">Smoker</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="smoking_status"
              value="quit"
              checked={formData.smoking_status === 'quit'}
              onChange={(e) => handleChange('smoking_status', e.target.value)}
              className="w-5 h-5"
            />
            <span className="text-base">Quit</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="smoking_status"
              value="never"
              checked={formData.smoking_status === 'never'}
              onChange={(e) => handleChange('smoking_status', e.target.value)}
              className="w-5 h-5"
            />
            <span className="text-base">Never</span>
          </label>
        </div>

        {/* Conditional: Smoker fields */}
        {formData.smoking_status === 'smoker' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                "Estimate" how many cigarettes or packs per day?
              </label>
              <input
                type="text"
                value={formData.smoking_quantity}
                onChange={(e) => handleChange('smoking_quantity', e.target.value)}
                placeholder="Enter here"
                className="w-full h-[58px] px-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                How long approximately
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={formData.smoking_duration_value}
                  onChange={(e) => handleChange('smoking_duration_value', e.target.value)}
                  placeholder="Value"
                  className="w-full h-[58px] px-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                />
                <div className="relative">
                  <select
                    value={formData.smoking_duration_unit}
                    onChange={(e) => handleChange('smoking_duration_unit', e.target.value)}
                    className="w-full h-[58px] px-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black appearance-none"
                  >
                    <option value="years">Years</option>
                    <option value="months">Months</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    ▼
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Conditional: Quit fields */}
        {formData.smoking_status === 'quit' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                When did you quit?
              </label>
              <input
                type="date"
                value={formData.smoking_quit_date}
                onChange={(e) => handleChange('smoking_quit_date', e.target.value)}
                className="w-full h-[58px] px-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Approximately how many cigarettes/packs did you smoke per day?
              </label>
              <input
                type="text"
                value={formData.smoking_past_quantity}
                onChange={(e) => handleChange('smoking_past_quantity', e.target.value)}
                placeholder="Enter here"
                className="w-full h-[58px] px-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

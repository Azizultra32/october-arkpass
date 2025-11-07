import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

interface AlcoholFormData {
  drinking_frequency: 'never' | 'occasionally' | 'more_than_once_a_week' | ''
  drinks_per_day: string
  alcohol_type: string
}

export function EditAlcohol() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<AlcoholFormData>({
    drinking_frequency: '',
    drinks_per_day: '',
    alcohol_type: ''
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
          drinking_frequency: data.drinking_frequency || '',
          drinks_per_day: data.drinks_per_day || '',
          alcohol_type: data.alcohol_type || ''
        })
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof AlcoholFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const dataToUpdate: any = {
        drinking_frequency: formData.drinking_frequency || null,
        drinks_per_day: formData.drinking_frequency === 'never' ? null : formData.drinks_per_day || null,
        alcohol_type: formData.drinking_frequency === 'never' ? null : formData.alcohol_type || null
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
        <h1 className="text-lg font-medium">Drinking Alcohol</h1>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-4 py-2 bg-black text-white rounded font-extrabold w-[86px] h-[42px] disabled:bg-gray-400"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Drinking Frequency Radio Buttons */}
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="drinking_frequency"
              value="never"
              checked={formData.drinking_frequency === 'never'}
              onChange={(e) => handleChange('drinking_frequency', e.target.value)}
              className="w-5 h-5"
            />
            <span className="text-base">Never</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="drinking_frequency"
              value="occasionally"
              checked={formData.drinking_frequency === 'occasionally'}
              onChange={(e) => handleChange('drinking_frequency', e.target.value)}
              className="w-5 h-5"
            />
            <span className="text-base">Occasionally</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="drinking_frequency"
              value="more_than_once_a_week"
              checked={formData.drinking_frequency === 'more_than_once_a_week'}
              onChange={(e) => handleChange('drinking_frequency', e.target.value)}
              className="w-5 h-5"
            />
            <span className="text-base">More than once a week</span>
          </label>
        </div>

        {/* Conditional: Drinks per day and Alcohol type (if not Never) */}
        {formData.drinking_frequency && formData.drinking_frequency !== 'never' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                On a typical drinking day, how many drinks do you have?
              </label>
              <div className="relative">
                <select
                  value={formData.drinks_per_day}
                  onChange={(e) => handleChange('drinks_per_day', e.target.value)}
                  className="w-full h-[58px] px-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black appearance-none"
                >
                  <option value="">Select...</option>
                  <option value="1-2 drinks">1-2 drinks</option>
                  <option value="3-4 drinks">3-4 drinks</option>
                  <option value="5-6 drinks">5-6 drinks</option>
                  <option value="7-9 drinks">7-9 drinks</option>
                  <option value="10+ drinks">10+ drinks</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  ▼
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                What type of alcohol do you typically drink?
              </label>
              <div className="relative">
                <select
                  value={formData.alcohol_type}
                  onChange={(e) => handleChange('alcohol_type', e.target.value)}
                  className="w-full h-[58px] px-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black appearance-none"
                >
                  <option value="">Select...</option>
                  <option value="Beer">Beer</option>
                  <option value="Wine">Wine</option>
                  <option value="Spirits">Spirits</option>
                  <option value="Mixed drinks">Mixed drinks</option>
                  <option value="Other">Other</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  ▼
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

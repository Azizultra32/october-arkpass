import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

interface CaffeineFormData {
  uses_caffeine: boolean
  caffeine_quantity_per_day: string
}

export function EditCaffeine() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<CaffeineFormData>({
    uses_caffeine: false,
    caffeine_quantity_per_day: ''
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
          uses_caffeine: data.uses_caffeine || false,
          caffeine_quantity_per_day: data.caffeine_quantity_per_day || ''
        })
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const dataToUpdate = {
        uses_caffeine: formData.uses_caffeine,
        caffeine_quantity_per_day: formData.uses_caffeine ? formData.caffeine_quantity_per_day || null : null
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
        <h1 className="text-lg font-medium">Coffee, tea, or caffeinated...</h1>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-4 py-2 bg-black text-white rounded font-extrabold w-[86px] h-[42px] disabled:bg-gray-400"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Yes/No Radio Buttons */}
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="uses_caffeine"
              checked={formData.uses_caffeine === true}
              onChange={() => setFormData(prev => ({ ...prev, uses_caffeine: true }))}
              className="w-5 h-5"
            />
            <span className="text-base">Yes</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="uses_caffeine"
              checked={formData.uses_caffeine === false}
              onChange={() => setFormData(prev => ({ ...prev, uses_caffeine: false }))}
              className="w-5 h-5"
            />
            <span className="text-base">No</span>
          </label>
        </div>

        {/* Conditional: Daily quantity if Yes */}
        {formData.uses_caffeine && (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Approximately how many cups and/or cans did you drink per day?
            </label>
            <input
              type="text"
              value={formData.caffeine_quantity_per_day}
              onChange={(e) => setFormData(prev => ({ ...prev, caffeine_quantity_per_day: e.target.value }))}
              placeholder="Enter here"
              className="w-full h-[58px] px-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        )}
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export function EditLiving() {
  const navigate = useNavigate()
  const [livingSituation, setLivingSituation] = useState('')
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
        setLivingSituation(data.living_situation || '')
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
      const { error } = await supabase
        .from('social_history')
        .update({ living_situation: livingSituation || null })
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
        <h1 className="text-lg font-medium">Living Situation</h1>
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
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Your living situation. Who do you live with.
          </label>
          <textarea
            value={livingSituation}
            onChange={(e) => setLivingSituation(e.target.value)}
            placeholder="Enter your living situation..."
            className="w-full h-[90px] px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black resize-none"
          />
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export function EditHeightWeight() {
  const navigate = useNavigate()
  const [heightValue, setHeightValue] = useState('')
  const [heightUnit, setHeightUnit] = useState('cm')
  const [weightValue, setWeightValue] = useState('')
  const [weightUnit, setWeightUnit] = useState('kg')
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [personalInfoId, setPersonalInfoId] = useState<string | null>(null)

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
        setHeightValue(data.height_value?.toString() || '')
        setHeightUnit(data.height_unit || 'cm')
        setWeightValue(data.weight_value?.toString() || '')
        setWeightUnit(data.weight_unit || 'kg')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!personalInfoId) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('personal_information')
        .update({
          height_value: heightValue ? parseFloat(heightValue) : null,
          height_unit: heightUnit,
          weight_value: weightValue ? parseFloat(weightValue) : null,
          weight_unit: weightUnit
        })
        .eq('id', personalInfoId)

      if (error) throw error

      navigate('/personal-information')
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
      <div className="h-14 border-b border-gray-300 flex items-center justify-between px-4">
        <button onClick={() => navigate('/personal-information')} className="text-lg">←</button>
        <h1 className="text-lg font-medium">Height and Weight</h1>
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
          <label className="block text-sm font-medium text-gray-600 mb-1">Height</label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              value={heightValue}
              onChange={(e) => setHeightValue(e.target.value)}
              placeholder="Value"
              className="w-full h-[58px] px-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
            />
            <div className="relative">
              <select
                value={heightUnit}
                onChange={(e) => setHeightUnit(e.target.value)}
                className="w-full h-[58px] px-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black appearance-none"
              >
                <option value="cm">cm</option>
                <option value="in">in</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Weight</label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              value={weightValue}
              onChange={(e) => setWeightValue(e.target.value)}
              placeholder="Value"
              className="w-full h-[58px] px-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
            />
            <div className="relative">
              <select
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value)}
                className="w-full h-[58px] px-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black appearance-none"
              >
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

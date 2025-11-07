import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

interface Surgery {
  id: string
  name: string
}

export function SurgeriesList() {
  const navigate = useNavigate()
  const [surgeries, setSurgeries] = useState<Surgery[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSurgeries()
  }, [])

  async function fetchSurgeries() {
    try {
      const { data, error } = await supabase
        .from('surgeries')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setSurgeries(data || [])
    } catch (error) {
      console.error('Error fetching surgeries:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleCardClick(id: string) {
    navigate(`/surgeries/${id}`)
  }

  function handleShareHealthRecord() {
    console.log('Share health record')
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Share Your Health Record button - 58px height */}
      <div className="px-4 pt-4">
        <button
          onClick={handleShareHealthRecord}
          className="w-full h-[58px] bg-black text-white rounded-lg font-extrabold text-base hover:bg-gray-800"
        >
          Share Your Health Record
        </button>
      </div>

      {/* Title - centered, bold, 24px */}
      <h1 className="text-[24px] font-bold text-center my-6">Previous Surgeries</h1>

      <div className="px-4 space-y-3 flex-1">
        {/* Add Previous Surgery button */}
        <button
          onClick={() => navigate('/surgeries/add')}
          className="w-full h-[58px] bg-gray-100 border border-gray-600 rounded-lg font-extrabold text-base hover:bg-gray-200"
        >
          + Add Previous Surgery
        </button>

        {/* Divider */}
        <div className="border-t border-gray-300 my-4"></div>

        {/* Surgery cards */}
        {surgeries.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No previous surgeries recorded</p>
        ) : (
          <div className="space-y-3 pb-20">
            {surgeries.map((surgery) => (
              <div
                key={surgery.id}
                onClick={() => handleCardClick(surgery.id)}
                className="border border-gray-600 rounded p-4 cursor-pointer hover:border-gray-800"
              >
                {/* Surgery name - bold, 20px */}
                <h3 className="text-[20px] font-bold">{surgery.name}</h3>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom navigation bar */}
      <div className="h-[58px] border-t border-black bg-white"></div>
    </div>
  )
}

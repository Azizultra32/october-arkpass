import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { BottomNav } from '../../components/BottomNav'

interface Immunization {
  id: string
  name: string
  description_purpose?: string | null
}

export function ImmunizationsList() {
  const navigate = useNavigate()
  const [immunizations, setImmunizations] = useState<Immunization[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchImmunizations()
  }, [])

  async function fetchImmunizations() {
    try {
      const { data, error } = await supabase
        .from('immunizations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setImmunizations(data || [])
    } catch (error) {
      console.error('Error fetching immunizations:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleCardClick(id: string) {
    navigate(`/immunizations/${id}`)
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

      {/* Header with title and add button */}
      <div className="px-4 py-6 flex items-center justify-between">
        <h1 className="text-[24px] font-bold">Immunizations</h1>
        <button
          onClick={() => navigate('/immunizations/add')}
          className="w-12 h-12 bg-black text-white rounded-full text-2xl flex items-center justify-center hover:bg-gray-800"
        >
          +
        </button>
      </div>

      <div className="px-4 space-y-3 flex-1">
        {immunizations.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No immunizations yet. Add your first one!</p>
        ) : (
          <div className="space-y-3 pb-20">
            {immunizations.map((immunization) => (
              <div
                key={immunization.id}
                onClick={() => handleCardClick(immunization.id)}
                className="border border-gray-600 rounded p-4 cursor-pointer hover:border-gray-800"
              >
                {/* Vaccine name - bold, 20px */}
                <h3 className="text-[20px] font-bold">{immunization.name}</h3>
                {/* Purpose - regular, 16px */}
                {immunization.description_purpose && (
                  <p className="text-base font-medium mt-1">{immunization.description_purpose}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom navigation bar */}
      <BottomNav />
    </div>
  )
}

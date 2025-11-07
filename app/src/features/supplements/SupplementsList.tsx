import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { BottomNav } from '../../components/BottomNav'

interface Supplement {
  id: string
  name: string
  dosage?: string | null
  frequency?: string | null
}

export function SupplementsList() {
  const navigate = useNavigate()
  const [supplements, setSupplements] = useState<Supplement[]>([])
  const [loading, setLoading] = useState(true)
  const [quickAddValue, setQuickAddValue] = useState('')
  const [quickAddError, setQuickAddError] = useState<string | null>(null)

  useEffect(() => {
    fetchSupplements()
  }, [])

  async function fetchSupplements() {
    try {
      const { data, error} = await supabase
        .from('supplements')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setSupplements(data || [])
    } catch (error) {
      console.error('Error fetching supplements:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleQuickAdd() {
    const name = quickAddValue.trim()
    if (!name) return

    setQuickAddError(null)

    const existingSupplement = supplements.find(
      sup => sup.name.toLowerCase() === name.toLowerCase()
    )
    if (existingSupplement) {
      setQuickAddError('This supplement already exists')
      return
    }

    try {
      const { data, error } = await supabase
        .from('supplements')
        .insert({ name })
        .select()
        .single()

      if (error) throw error

      setSupplements(prev => [data, ...prev])
      setQuickAddValue('')
    } catch (error) {
      console.error('Error adding supplement:', error)
      setQuickAddError('Failed to add supplement')
    }
  }

  function handleCardClick(id: string) {
    navigate(`/supplements/${id}`)
  }

  function handleShareHealthRecord() {
    console.log('Share health record')
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Share Your Health Record button */}
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
        <h1 className="text-[24px] font-bold">Supplements</h1>
        <button
          onClick={() => navigate('/supplements/add')}
          className="w-12 h-12 bg-black text-white rounded-full text-2xl flex items-center justify-center hover:bg-gray-800"
        >
          +
        </button>
      </div>

      <div className="px-4 space-y-3 flex-1">
        {/* Quick Add */}
        <div className="flex gap-2">
          <input
            type="text"
            value={quickAddValue}
            onChange={(e) => setQuickAddValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
            placeholder="Quick Add"
            className={`flex-1 h-[58px] px-4 border rounded-lg focus:outline-none focus:ring-2 ${
              quickAddError
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-black'
            }`}
          />
          <button
            onClick={handleQuickAdd}
            className="h-[58px] px-6 bg-black text-white rounded-lg font-extrabold text-base hover:bg-gray-800"
          >
            Add
          </button>
        </div>
        {quickAddError && (
          <p className="text-sm text-red-600">{quickAddError}</p>
        )}

        {/* Divider */}
        <div className="border-t border-gray-300 my-4"></div>

        {/* Supplement cards */}
        {supplements.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No supplements yet. Add your first one!</p>
        ) : (
          <div className="space-y-3 pb-20">
            {supplements.map((supplement) => (
              <div
                key={supplement.id}
                onClick={() => handleCardClick(supplement.id)}
                className="border border-gray-600 rounded p-4 cursor-pointer hover:border-gray-800 relative"
              >
                {/* Red dot for incomplete records */}
                {(!supplement.dosage || !supplement.frequency) && (
                  <div className="absolute top-4 right-4 w-[10px] h-[10px] bg-red-500 rounded-full"></div>
                )}

                {/* Name - bold, 20px */}
                <h3 className="text-[20px] font-bold pr-6">{supplement.name}</h3>

                {/* Dosage + frequency */}
                {(supplement.dosage || supplement.frequency) && (
                  <p className="text-base font-medium mt-1">
                    {[supplement.dosage, supplement.frequency].filter(Boolean).join(', ')}
                  </p>
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

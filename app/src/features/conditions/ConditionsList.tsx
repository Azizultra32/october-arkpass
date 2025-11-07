import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { BottomNav } from '../../components/BottomNav'

interface Condition {
  id: string
  name: string
  type?: string | null // 'chronic', 'transient_recurrent', 'transient_resolved'
}

export function ConditionsList() {
  const navigate = useNavigate()
  const [conditions, setConditions] = useState<Condition[]>([])
  const [loading, setLoading] = useState(true)
  const [quickAddValue, setQuickAddValue] = useState('')
  const [quickAddError, setQuickAddError] = useState<string | null>(null)

  useEffect(() => {
    fetchConditions()
  }, [])

  async function fetchConditions() {
    try {
      const { data, error } = await supabase
        .from('conditions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setConditions(data || [])
    } catch (error) {
      console.error('Error fetching conditions:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleQuickAdd() {
    const name = quickAddValue.trim()
    if (!name) return

    setQuickAddError(null)

    // Check for duplicates
    const existingCondition = conditions.find(
      cond => cond.name.toLowerCase() === name.toLowerCase()
    )
    if (existingCondition) {
      setQuickAddError('This condition already exists')
      return
    }

    try {
      const { data, error } = await supabase
        .from('conditions')
        .insert({ name })
        .select()
        .single()

      if (error) throw error

      setConditions(prev => [data, ...prev])
      setQuickAddValue('')
    } catch (error) {
      console.error('Error adding condition:', error)
      setQuickAddError('Failed to add condition')
    }
  }

  function handleCardClick(id: string) {
    navigate(`/conditions/${id}`)
  }

  function handleShareHealthRecord() {
    console.log('Share health record')
  }

  // Separate conditions by type
  const chronicConditions = conditions.filter(c => c.type === 'chronic')
  const transientConditions = conditions.filter(c =>
    c.type === 'transient_recurrent' || c.type === 'transient_resolved'
  )

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
      <h1 className="text-[24px] font-bold text-center my-6">Conditions</h1>

      <div className="px-4 space-y-3 flex-1">
        {/* Quick Add - Input + Add button combo */}
        <div className="flex gap-0">
          <input
            type="text"
            value={quickAddValue}
            onChange={(e) => setQuickAddValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
            placeholder="Quick Add"
            className={`flex-1 h-[58px] px-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 ${
              quickAddError
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-black'
            }`}
          />
          <button
            onClick={handleQuickAdd}
            className="h-[58px] px-6 bg-black text-white rounded-r-lg font-extrabold text-base hover:bg-gray-800"
          >
            Add
          </button>
        </div>
        {quickAddError && (
          <p className="text-sm text-red-600">{quickAddError}</p>
        )}

        {/* Add with details button - 42px height */}
        <button
          onClick={() => navigate('/conditions/add')}
          className="w-full h-[42px] border border-gray-600 rounded font-extrabold text-sm hover:bg-gray-50"
        >
          + Add with details
        </button>

        {/* Divider */}
        <div className="border-t border-gray-300 my-4"></div>

        {/* CHRONIC section */}
        <div className="mb-6">
          <h2 className="text-[16px] font-bold uppercase mb-3">CHRONIC</h2>
          {chronicConditions.length === 0 ? (
            <p className="text-center py-4 font-medium">No Chronic Conditions</p>
          ) : (
            <div className="space-y-3">
              {chronicConditions.map((condition) => (
                <div
                  key={condition.id}
                  onClick={() => handleCardClick(condition.id)}
                  className="border border-gray-600 rounded p-4 cursor-pointer hover:border-gray-800 relative"
                >
                  {/* Status indicator dot - 10px */}
                  {!condition.type && (
                    <div className="absolute top-4 right-4 w-[10px] h-[10px] bg-red-500 rounded-full"></div>
                  )}

                  {/* Name - bold, 20px */}
                  <h3 className="text-[20px] font-bold">{condition.name}</h3>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TRANSIENT section */}
        <div className="mb-6">
          <h2 className="text-[16px] font-bold uppercase mb-3">TRANSIENT</h2>
          {transientConditions.length === 0 ? (
            <p className="text-center py-4 font-medium">No Transient Conditions</p>
          ) : (
            <div className="space-y-3">
              {transientConditions.map((condition) => (
                <div
                  key={condition.id}
                  onClick={() => handleCardClick(condition.id)}
                  className="border border-gray-600 rounded p-4 cursor-pointer hover:border-gray-800 relative"
                >
                  {!condition.type && (
                    <div className="absolute top-4 right-4 w-[10px] h-[10px] bg-red-500 rounded-full"></div>
                  )}
                  <h3 className="text-[20px] font-bold">{condition.name}</h3>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom navigation bar - 58px height */}
      <BottomNav />
    </div>
  )
}

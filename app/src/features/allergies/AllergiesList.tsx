import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { BottomNav } from '../../components/BottomNav'

interface Allergy {
  id: string
  name: string
  category?: string | null
  severity?: string | null
  requires_epipen?: boolean
}

export function AllergiesList() {
  const navigate = useNavigate()
  const [allergies, setAllergies] = useState<Allergy[]>([])
  const [loading, setLoading] = useState(true)
  const [quickAddValue, setQuickAddValue] = useState('')
  const [quickAddError, setQuickAddError] = useState<string | null>(null)

  useEffect(() => {
    fetchAllergies()
  }, [])

  async function fetchAllergies() {
    try {
      const { data, error } = await supabase
        .from('allergies')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAllergies(data || [])
    } catch (error) {
      console.error('Error fetching allergies:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleQuickAdd() {
    const name = quickAddValue.trim()
    if (!name) return

    setQuickAddError(null)

    // Check for duplicates
    const existingAllergy = allergies.find(
      allergy => allergy.name.toLowerCase() === name.toLowerCase()
    )
    if (existingAllergy) {
      setQuickAddError('This allergy already exists')
      return
    }

    try {
      const { data, error } = await supabase
        .from('allergies')
        .insert({ name })
        .select()
        .single()

      if (error) throw error

      setAllergies(prev => [data, ...prev])
      setQuickAddValue('')
    } catch (error) {
      console.error('Error adding allergy:', error)
      setQuickAddError('Failed to add allergy')
    }
  }

  function handleCardClick(id: string) {
    navigate(`/allergies/${id}`)
  }

  function handleShareHealthRecord() {
    console.log('Share health record')
  }

  // Separate allergies by category
  const medicationAllergies = allergies.filter(a => a.category === 'medication')
  const otherAllergies = allergies.filter(a => a.category !== 'medication')

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Share Your Health Record button - 58px height */}
      <div className="px-4 pt-4">
        <button
          onClick={handleShareHealthRecord}
          className="w-full h-[58px] bg-black text-white rounded-lg font-medium hover:bg-gray-800"
        >
          Share Your Health Record
        </button>
      </div>

      {/* Title - centered, bold, 24px */}
      <h1 className="text-[24px] font-bold text-center my-6">Allergies</h1>

      <div className="px-4 space-y-3 flex-1">
        {/* Quick Add - Input + Add button combo */}
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
            className="h-[58px] px-6 bg-black text-white rounded-lg font-medium hover:bg-gray-800"
          >
            Add
          </button>
        </div>
        {quickAddError && (
          <p className="text-sm text-red-600">{quickAddError}</p>
        )}

        {/* Add with details button */}
        <button
          onClick={() => navigate('/allergies/add')}
          className="w-full h-[58px] border border-gray-600 rounded-lg font-medium hover:bg-gray-50"
        >
          + Add with details
        </button>

        {/* Divider */}
        <div className="border-t border-gray-300 my-4"></div>

        {/* MEDICATION ALLERGIES section */}
        <div className="mb-6">
          <h2 className="text-[16px] font-bold uppercase mb-3">MEDICATION ALLERGIES</h2>
          {medicationAllergies.length === 0 ? (
            <p className="text-gray-500">No medication allergies</p>
          ) : (
            <div className="space-y-3">
              {medicationAllergies.map((allergy) => (
                <div
                  key={allergy.id}
                  onClick={() => handleCardClick(allergy.id)}
                  className="border border-gray-600 rounded p-4 cursor-pointer hover:border-gray-800 relative"
                >
                  {/* Status dot for incomplete records */}
                  {!allergy.category && (
                    <div className="absolute top-4 right-4 w-[10px] h-[10px] bg-red-500 rounded-full"></div>
                  )}

                  {/* Name - bold, 20px */}
                  <h3 className="text-[20px] font-bold">{allergy.name}</h3>

                  {/* EpiPen indicator (PATIENT SAFETY CRITICAL) */}
                  {allergy.requires_epipen && (
                    <p className="text-sm text-red-600 font-bold mt-1">⚠️ EpiPen Required</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ENVIRONMENTAL/SEASONAL/SKIN/OTHER section */}
        <div className="mb-6">
          <h2 className="text-[16px] font-bold uppercase mb-3">ENVIRONMENTAL/SEASONAL/SKIN/OTHER</h2>
          {otherAllergies.length === 0 ? (
            <p className="text-gray-500">No environmental/seasonal/skin/other allergies</p>
          ) : (
            <div className="space-y-3">
              {otherAllergies.map((allergy) => (
                <div
                  key={allergy.id}
                  onClick={() => handleCardClick(allergy.id)}
                  className="border border-gray-600 rounded p-4 cursor-pointer hover:border-gray-800 relative"
                >
                  {!allergy.category && (
                    <div className="absolute top-4 right-4 w-[10px] h-[10px] bg-red-500 rounded-full"></div>
                  )}
                  <h3 className="text-[20px] font-bold">{allergy.name}</h3>
                  {allergy.requires_epipen && (
                    <p className="text-sm text-red-600 font-bold mt-1">⚠️ EpiPen Required</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom navigation bar */}
      <div className="h-16 border-t border-gray-300 bg-white"></div>
    </div>
  )
}

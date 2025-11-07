import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

interface Medication {
  id: string
  name: string
  dosage?: string | null
  frequency?: string | null
  status?: string | null
}

export function MedicationsList() {
  const navigate = useNavigate()
  const [medications, setMedications] = useState<Medication[]>([])
  const [loading, setLoading] = useState(true)
  const [quickAddValue, setQuickAddValue] = useState('')
  const [quickAddError, setQuickAddError] = useState<string | null>(null)

  useEffect(() => {
    fetchMedications()
  }, [])

  async function fetchMedications() {
    try {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMedications(data || [])
    } catch (error) {
      console.error('Error fetching medications:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleQuickAdd() {
    const name = quickAddValue.trim()
    if (!name) return

    setQuickAddError(null)

    // Check for duplicates
    const existingMed = medications.find(
      med => med.name.toLowerCase() === name.toLowerCase()
    )
    if (existingMed) {
      setQuickAddError('This medication already exists')
      return
    }

    try {
      const { data, error } = await supabase
        .from('medications')
        .insert({ name })
        .select()
        .single()

      if (error) throw error

      setMedications(prev => [data, ...prev])
      setQuickAddValue('')
    } catch (error) {
      console.error('Error adding medication:', error)
      setQuickAddError('Failed to add medication')
    }
  }

  function handleCardClick(id: string) {
    navigate(`/medications/${id}`)
  }

  function handleShareHealthRecord() {
    // TODO: Implement share functionality
    console.log('Share health record')
  }

  function handleTakePhoto() {
    // TODO: Implement photo capture
    console.log('Take photo')
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
          className="w-full h-[58px] bg-black text-white rounded-lg font-medium hover:bg-gray-800"
        >
          Share Your Health Record
        </button>
      </div>

      {/* Title - centered, bold, 24px */}
      <h1 className="text-[24px] font-bold text-center my-6">Medications</h1>

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

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/medications/add')}
            className="flex-1 h-[58px] border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
          >
            + Add with details
          </button>
          <button
            onClick={handleTakePhoto}
            className="flex-1 h-[58px] border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
          >
            Take a Photo
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 my-4"></div>

        {/* Medication cards */}
        {medications.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No medications yet. Add your first one!</p>
        ) : (
          <div className="space-y-3 pb-20">
            {medications.map((med) => (
              <div
                key={med.id}
                onClick={() => handleCardClick(med.id)}
                className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400 relative"
              >
                {/* Status dot - 10px, top right */}
                <div className="absolute top-4 right-4 w-[10px] h-[10px] bg-red-500 rounded-full"></div>

                {/* Name - bold, 20px */}
                <h3 className="text-[20px] font-bold pr-6">{med.name}</h3>

                {/* Dosage + frequency */}
                {(med.dosage || med.frequency) && (
                  <p className="text-[14px] text-gray-600 mt-1">
                    {[med.dosage, med.frequency].filter(Boolean).join(', ')}
                  </p>
                )}

                {/* Linked condition - TODO: fetch from associations */}
                {/* <p className="text-[14px] text-gray-600 mt-1">for Asthma</p> */}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom navigation bar - TODO: implement */}
      <div className="h-16 border-t border-gray-300 bg-white"></div>
    </div>
  )
}

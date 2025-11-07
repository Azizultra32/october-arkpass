import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

interface Medication {
  id: string
  name: string
  dosage?: string | null
  frequency?: string | null
  route?: string | null
  start_date?: string | null
  status?: string | null
}

export function ViewMedication() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [medication, setMedication] = useState<Medication | null>(null)
  const [loading, setLoading] = useState(true)
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    if (id) {
      fetchMedication(id)
    }
  }, [id])

  async function fetchMedication(medId: string) {
    try {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('id', medId)
        .single()

      if (error) throw error
      setMedication(data)
    } catch (error) {
      console.error('Error fetching medication:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!id || !confirm('Are you sure you want to delete this medication?')) return

    try {
      const { error } = await supabase
        .from('medications')
        .delete()
        .eq('id', id)

      if (error) throw error

      navigate('/medications')
    } catch (error) {
      console.error('Error deleting medication:', error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!medication) {
    return <div className="flex items-center justify-center min-h-screen">Medication not found</div>
  }

  const isIncomplete = !medication.dosage || !medication.frequency

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Back arrow + Title + Edit button */}
      <div className="h-14 border-b border-gray-300 flex items-center justify-between px-4">
        <button
          onClick={() => navigate('/medications')}
          className="text-lg"
        >
          ←
        </button>
        <h1 className="text-lg font-medium">{medication.name}</h1>
        <button
          onClick={() => navigate(`/medications/${id}/edit`)}
          className="text-blue-600"
        >
          Edit
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Name field with status dot */}
        <div className="relative">
          <label className="block text-sm text-gray-600 mb-1">Name</label>
          <div className="relative">
            <p className="text-base">{medication.name}</p>
            {/* Status dot - 10px */}
            {isIncomplete && (
              <div className="absolute top-0 right-0 w-[10px] h-[10px] bg-red-500 rounded-full"></div>
            )}
          </div>
          {isIncomplete && (
            <p className="text-sm text-red-600 mt-1">Incomplete Name (red warning)</p>
          )}
        </div>

        {/* Dosage */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Dosage</label>
          <p className="text-base">{medication.dosage || 'N/a'}</p>
        </div>

        {/* Frequency */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Frequency</label>
          <p className="text-base">{medication.frequency || 'N/a'}</p>
        </div>

        {/* Show more/less toggle */}
        {!showMore ? (
          <button
            onClick={() => setShowMore(true)}
            className="text-blue-600 text-sm"
          >
            Show more
          </button>
        ) : (
          <>
            {/* ORAL/SL/INJ/DROPS */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">ORAL/SL/INJ/DROPS</label>
              <p className="text-base">{medication.route || 'N/a'}</p>
            </div>

            {/* Prescribed / Start day */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Prescribed / Start day</label>
              <p className="text-base">{medication.start_date || 'N/a'}</p>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Status</label>
              <p className="text-base">{medication.status || 'N/a'}</p>
            </div>

            <button
              onClick={() => setShowMore(false)}
              className="text-blue-600 text-sm"
            >
              Show less
            </button>
          </>
        )}

        {/* Divider */}
        <div className="border-t border-gray-300 my-6"></div>

        {/* CONDITIONS section */}
        <div>
          <h2 className="text-sm font-semibold text-gray-600 mb-2">CONDITIONS</h2>
          <p className="text-gray-500">No Conditions</p>
          <button className="text-blue-600 text-sm mt-2">+ Add Condition</button>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 my-6"></div>

        {/* DOCUMENTS section */}
        <div>
          <h2 className="text-sm font-semibold text-gray-600 mb-2">DOCUMENTS</h2>
          <p className="text-gray-500">No Documents</p>
          <button className="text-blue-600 text-sm mt-2">+ Add Documents</button>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 my-6"></div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 text-red-600"
        >
          <span>🗑️</span>
          <span>Delete</span>
        </button>
      </div>
    </div>
  )
}

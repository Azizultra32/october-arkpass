import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

interface Condition {
  id: string
  name: string
  type?: string | null
  diagnosis_date?: string | null
  details?: string | null
}

export function ViewCondition() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [condition, setCondition] = useState<Condition | null>(null)
  const [loading, setLoading] = useState(true)
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    if (id) {
      fetchCondition(id)
    }
  }, [id])

  async function fetchCondition(conditionId: string) {
    try {
      const { data, error } = await supabase
        .from('conditions')
        .select('*')
        .eq('id', conditionId)
        .single()

      if (error) throw error
      setCondition(data)
    } catch (error) {
      console.error('Error fetching condition:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!id || !confirm('Are you sure you want to delete this condition?')) return

    try {
      const { error } = await supabase
        .from('conditions')
        .delete()
        .eq('id', id)

      if (error) throw error

      navigate('/conditions')
    } catch (error) {
      console.error('Error deleting condition:', error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!condition) {
    return <div className="flex items-center justify-center min-h-screen">Condition not found</div>
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Back arrow + Title + Edit button */}
      <div className="h-14 border-b border-gray-300 flex items-center justify-between px-4">
        <button
          onClick={() => navigate('/conditions')}
          className="text-lg"
        >
          ←
        </button>
        <h1 className="text-[24px] font-bold">{condition.name}</h1>
        <button
          onClick={() => navigate(`/conditions/${id}/edit`)}
          className="px-4 py-2 border border-gray-600 rounded text-sm font-extrabold w-[77px] h-[42px]"
        >
          Edit
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Name field */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Name (Diagnosis)</label>
          <p className="text-base font-bold leading-6">{condition.name}</p>
        </div>

        {/* Type field */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Type</label>
          <p className="text-base font-bold leading-6">
            {condition.type === 'chronic' && 'Chronic'}
            {condition.type === 'transient_recurrent' && 'Transient-Recurrent'}
            {condition.type === 'transient_resolved' && 'Transient-Resolved'}
            {!condition.type && 'N/a'}
          </p>
        </div>

        {/* Show more/less toggle */}
        {!showMore ? (
          <button
            onClick={() => setShowMore(true)}
            className="text-blue-600 text-base font-medium w-full text-center"
          >
            Show more
          </button>
        ) : (
          <>
            {/* Diagnosis Date */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Diagnosis Date</label>
              <p className="text-base font-bold leading-6">{condition.diagnosis_date || 'N/a'}</p>
            </div>

            {/* Details */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Details</label>
              <p className="text-base font-bold leading-6">{condition.details || 'N/a'}</p>
            </div>

            <button
              onClick={() => setShowMore(false)}
              className="text-blue-600 text-base font-medium w-full text-center"
            >
              Show less
            </button>
          </>
        )}

        {/* Separator */}
        <div className="h-[2px] bg-gray-300 my-6"></div>

        {/* MEDICATIONS section */}
        <div>
          <h2 className="text-base font-bold uppercase mb-2">MEDICATIONS</h2>
          <div className="h-[2px] bg-gray-300 mb-3"></div>
          <p className="text-gray-500">No medications linked to this condition</p>
        </div>

        {/* Separator */}
        <div className="h-[2px] bg-gray-300 my-6"></div>

        {/* DOCUMENTS section */}
        <div>
          <h2 className="text-base font-bold uppercase mb-2">DOCUMENTS</h2>
          <div className="h-[2px] bg-gray-300 mb-3"></div>
          <p className="text-gray-500">No documents</p>
        </div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 text-gray-600 h-[58px] px-4"
        >
          <span className="text-2xl">🗑️</span>
          <span className="font-bold text-base">Delete</span>
        </button>
      </div>
    </div>
  )
}

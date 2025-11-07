import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

interface Supplement {
  id: string
  name: string
  dosage?: string | null
  frequency?: string | null
  start_date?: string | null
  details?: string | null
}

export function ViewSupplement() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [supplement, setSupplement] = useState<Supplement | null>(null)
  const [loading, setLoading] = useState(true)
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    if (id) {
      fetchSupplement(id)
    }
  }, [id])

  async function fetchSupplement(supplementId: string) {
    try {
      const { data, error } = await supabase
        .from('supplements')
        .select('*')
        .eq('id', supplementId)
        .single()

      if (error) throw error
      setSupplement(data)
    } catch (error) {
      console.error('Error fetching supplement:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!id || !confirm('Are you sure you want to delete this supplement?')) return

    try {
      const { error } = await supabase
        .from('supplements')
        .delete()
        .eq('id', id)

      if (error) throw error

      navigate('/supplements')
    } catch (error) {
      console.error('Error deleting supplement:', error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!supplement) {
    return <div className="flex items-center justify-center min-h-screen">Supplement not found</div>
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="h-14 border-b border-gray-300 flex items-center justify-between px-4">
        <button
          onClick={() => navigate('/supplements')}
          className="text-lg"
        >
          ← Supplements
        </button>
        <button
          onClick={() => navigate('/supplements')}
          className="text-2xl"
        >
          ×
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Name */}
        <h1 className="text-[20px] font-bold">{supplement.name}</h1>

        {/* Dosage */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Dosage</label>
          <p className="text-base font-bold">{supplement.dosage || 'N/a'}</p>
        </div>

        {/* Frequency */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Frequency</label>
          <p className="text-base font-bold">{supplement.frequency || 'N/a'}</p>
        </div>

        {/* Show more/less */}
        {!showMore ? (
          <button
            onClick={() => setShowMore(true)}
            className="text-blue-600 text-base font-medium"
          >
            Show more ▼
          </button>
        ) : (
          <>
            {/* Start */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Start</label>
              <p className="text-base font-bold">{supplement.start_date || 'N/a'}</p>
            </div>

            {/* Details */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Details</label>
              <p className="text-base font-bold">{supplement.details || 'N/a'}</p>
            </div>

            {/* Documents */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Documents</label>
              <p className="text-gray-500">No documents</p>
            </div>

            <button
              onClick={() => setShowMore(false)}
              className="text-blue-600 text-base font-medium"
            >
              Show less ▲
            </button>
          </>
        )}

        {/* Edit button */}
        <button
          onClick={() => navigate(`/supplements/${id}/edit`)}
          className="w-full h-[58px] border border-gray-600 rounded font-extrabold text-base hover:bg-gray-50"
        >
          Edit
        </button>
      </div>
    </div>
  )
}

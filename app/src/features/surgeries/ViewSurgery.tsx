import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

interface Surgery {
  id: string
  name: string
  when_date?: string | null
  details?: string | null
  complications?: string | null
  attending_surgeon?: string | null
}

export function ViewSurgery() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [surgery, setSurgery] = useState<Surgery | null>(null)
  const [loading, setLoading] = useState(true)
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    if (id) {
      fetchSurgery(id)
    }
  }, [id])

  async function fetchSurgery(surgeryId: string) {
    try {
      const { data, error } = await supabase
        .from('surgeries')
        .select('*')
        .eq('id', surgeryId)
        .single()

      if (error) throw error
      setSurgery(data)
    } catch (error) {
      console.error('Error fetching surgery:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!id || !confirm('Are you sure you want to delete this surgery record?')) return

    try {
      const { error } = await supabase
        .from('surgeries')
        .delete()
        .eq('id', id)

      if (error) throw error

      navigate('/surgeries')
    } catch (error) {
      console.error('Error deleting surgery:', error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!surgery) {
    return <div className="flex items-center justify-center min-h-screen">Surgery not found</div>
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Back arrow + Title + Edit button */}
      <div className="h-14 border-b border-gray-300 flex items-center justify-between px-4">
        <button
          onClick={() => navigate('/surgeries')}
          className="text-lg"
        >
          ←
        </button>
        <h1 className="text-[20px] font-bold">{surgery.name}</h1>
        <button
          onClick={() => navigate(`/surgeries/${id}/edit`)}
          className="px-4 py-2 border border-gray-600 rounded text-sm font-extrabold w-[77px] h-[42px]"
        >
          Edit
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Name field */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
          <p className="text-base font-bold leading-6">{surgery.name}</p>
        </div>

        {/* Show more/less toggle */}
        {!showMore ? (
          <button
            onClick={() => setShowMore(true)}
            className="text-blue-600 text-base font-medium"
          >
            Show more
          </button>
        ) : (
          <>
            {/* When */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">When</label>
              <p className="text-base font-bold leading-6">
                {surgery.when_date
                  ? new Date(surgery.when_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })
                  : 'N/a'}
              </p>
            </div>

            {/* Details */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Details</label>
              <p className="text-base font-bold leading-6">{surgery.details || 'N/a'}</p>
            </div>

            {/* Complications */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Complications</label>
              <p className="text-base font-bold leading-6">{surgery.complications || 'N/a'}</p>
            </div>

            {/* Attending Surgeon */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Attending Surgeon</label>
              <p className="text-base font-bold leading-6">{surgery.attending_surgeon || 'N/a'}</p>
            </div>

            <button
              onClick={() => setShowMore(false)}
              className="text-blue-600 text-base font-medium"
            >
              Show less
            </button>
          </>
        )}

        {/* Divider */}
        <div className="border-t border-gray-300 my-6"></div>

        {/* DOCUMENTS section */}
        <div>
          <h2 className="text-sm font-semibold text-gray-600 uppercase mb-2">DOCUMENTS</h2>
          <p className="text-gray-500">No documents</p>
          <button className="text-blue-600 text-sm mt-2">+ Add Documents</button>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 my-6"></div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 text-gray-600 h-[58px]"
        >
          <span className="text-2xl">🗑️</span>
          <span className="font-bold text-base">Delete</span>
        </button>
      </div>
    </div>
  )
}

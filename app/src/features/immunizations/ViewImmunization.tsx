import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

interface Immunization {
  id: string
  name: string
  description_purpose?: string | null
  when_administered?: string | null
  date_administered?: string | null
  location_administered?: string | null
}

export function ViewImmunization() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [immunization, setImmunization] = useState<Immunization | null>(null)
  const [loading, setLoading] = useState(true)
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    if (id) {
      fetchImmunization(id)
    }
  }, [id])

  async function fetchImmunization(immunizationId: string) {
    try {
      const { data, error } = await supabase
        .from('immunizations')
        .select('*')
        .eq('id', immunizationId)
        .single()

      if (error) throw error
      setImmunization(data)
    } catch (error) {
      console.error('Error fetching immunization:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!id || !confirm('Are you sure you want to delete this immunization?')) return

    try {
      const { error } = await supabase
        .from('immunizations')
        .delete()
        .eq('id', id)

      if (error) throw error

      navigate('/immunizations')
    } catch (error) {
      console.error('Error deleting immunization:', error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!immunization) {
    return <div className="flex items-center justify-center min-h-screen">Immunization not found</div>
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Back arrow + Title + Close button */}
      <div className="h-14 border-b border-gray-300 flex items-center justify-between px-4">
        <button
          onClick={() => navigate('/immunizations')}
          className="text-lg"
        >
          ← Immunizations
        </button>
        <button
          onClick={() => navigate('/immunizations')}
          className="text-2xl"
        >
          ×
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Name */}
        <h1 className="text-[20px] font-bold">{immunization.name}</h1>

        {/* Description/Purpose */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Description/Purpose</label>
          <p className="text-base font-bold">{immunization.description_purpose || 'N/a'}</p>
        </div>

        {/* Show more/less toggle */}
        {!showMore ? (
          <button
            onClick={() => setShowMore(true)}
            className="text-blue-600 text-base font-medium"
          >
            Show more ▼
          </button>
        ) : (
          <>
            {/* When */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">When</label>
              <p className="text-base font-bold">{immunization.when_administered || 'N/a'}</p>
            </div>

            {/* Date Administered */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Date Administered</label>
              <p className="text-base font-bold">
                {immunization.date_administered
                  ? new Date(immunization.date_administered).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })
                  : 'N/a'}
              </p>
            </div>

            {/* Location Administered */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Location Administered</label>
              <p className="text-base font-bold">{immunization.location_administered || 'N/a'}</p>
            </div>

            {/* Documents section */}
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
          onClick={() => navigate(`/immunizations/${id}/edit`)}
          className="w-full h-[58px] border border-gray-600 rounded font-extrabold text-base hover:bg-gray-50"
        >
          Edit
        </button>
      </div>
    </div>
  )
}

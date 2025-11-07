import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

interface Allergy {
  id: string
  name: string
  onset?: string | null
  details?: string | null
  category?: string | null
  severity?: string | null
  requires_epipen?: boolean
}

export function ViewAllergy() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [allergy, setAllergy] = useState<Allergy | null>(null)
  const [loading, setLoading] = useState(true)
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    if (id) {
      fetchAllergy(id)
    }
  }, [id])

  async function fetchAllergy(allergyId: string) {
    try {
      const { data, error } = await supabase
        .from('allergies')
        .select('*')
        .eq('id', allergyId)
        .single()

      if (error) throw error
      setAllergy(data)
    } catch (error) {
      console.error('Error fetching allergy:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!id || !confirm('Are you sure you want to delete this allergy?')) return

    try {
      const { error } = await supabase
        .from('allergies')
        .delete()
        .eq('id', id)

      if (error) throw error

      navigate('/allergies')
    } catch (error) {
      console.error('Error deleting allergy:', error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!allergy) {
    return <div className="flex items-center justify-center min-h-screen">Allergy not found</div>
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Back arrow + Title + Edit button */}
      <div className="h-14 border-b border-gray-300 flex items-center justify-between px-4">
        <button
          onClick={() => navigate('/allergies')}
          className="text-lg"
        >
          ←
        </button>
        <h1 className="text-lg font-medium">{allergy.name}</h1>
        <button
          onClick={() => navigate(`/allergies/${id}/edit`)}
          className="px-4 py-2 border border-gray-600 rounded text-sm font-bold w-[77px] h-[42px]"
        >
          Edit
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Name field */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Name</label>
          <p className="text-base font-bold">{allergy.name}</p>
        </div>

        {/* Show more/less toggle */}
        {!showMore ? (
          <button
            onClick={() => setShowMore(true)}
            className="text-blue-600 text-base"
          >
            Show more
          </button>
        ) : (
          <>
            {/* Onset field */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Onset</label>
              <p className="text-base font-bold">{allergy.onset || 'N/a'}</p>
            </div>

            {/* Details field */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Details</label>
              <p className="text-base font-bold">{allergy.details || 'N/a'}</p>
            </div>

            <button
              onClick={() => setShowMore(false)}
              className="text-blue-600 text-base"
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
          <p className="text-gray-500">No Documents</p>
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
          <span>Delete</span>
        </button>
      </div>
    </div>
  )
}

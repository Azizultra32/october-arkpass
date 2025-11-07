import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { BottomNav } from '../../components/BottomNav'

interface FamilyMember {
  id: string
  relative: string
  status: string
  conditions: string | null
}

export function FamilyHistoryList() {
  const navigate = useNavigate()
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFamilyHistory()
  }, [])

  async function fetchFamilyHistory() {
    try {
      const { data, error } = await supabase
        .from('family_history')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setFamilyMembers(data || [])
    } catch (error) {
      console.error('Error fetching family history:', error)
    } finally {
      setLoading(false)
    }
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

      {/* Title */}
      <h1 className="text-[24px] font-bold text-center my-6">Family History</h1>

      <div className="px-4 space-y-3 flex-1">
        {/* Add Family History button */}
        <button
          onClick={() => navigate('/family-history/add')}
          className="w-full h-[58px] bg-gray-100 border border-gray-600 rounded-lg font-extrabold text-base hover:bg-gray-200"
        >
          + Add Family History
        </button>

        {/* Divider */}
        <div className="border-t border-gray-300 my-4"></div>

        {/* Family member entries */}
        {familyMembers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No family history recorded</p>
        ) : (
          <div className="space-y-4 pb-20">
            {familyMembers.map((member) => (
              <div key={member.id} className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base text-gray-600">{member.relative}</h3>
                      {/* Red dot if no conditions */}
                      {!member.conditions && (
                        <div className="w-[10px] h-[10px] bg-red-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-base font-medium mt-1">
                      {member.status}
                      {member.conditions && `, ${member.conditions}`}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/family-history/${member.id}/edit`)}
                    className="px-4 py-2 border border-gray-600 rounded text-sm font-extrabold h-[42px]"
                  >
                    Edit
                  </button>
                </div>
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

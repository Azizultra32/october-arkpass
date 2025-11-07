import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

interface SocialHistory {
  id: string
  smoking_status: string | null
  smoking_quantity: string | null
  smoking_quit_date: string | null
  drinking_frequency: string | null
  drinks_per_day: string | null
  alcohol_type: string | null
  uses_recreational_drugs: boolean
  uses_caffeine: boolean
  caffeine_quantity_per_day: string | null
  living_situation: string | null
  occupation: string | null
}

export function SocialHistoryMain() {
  const navigate = useNavigate()
  const [socialHistory, setSocialHistory] = useState<SocialHistory | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSocialHistory()
  }, [])

  async function fetchSocialHistory() {
    try {
      const { data, error } = await supabase
        .from('social_history')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') throw error

      // If no record exists, create one
      if (!data) {
        const { data: newData, error: insertError } = await supabase
          .from('social_history')
          .insert({})
          .select()
          .single()

        if (insertError) throw insertError
        setSocialHistory(newData)
      } else {
        setSocialHistory(data)
      }
    } catch (error) {
      console.error('Error fetching social history:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleShareHealthRecord() {
    console.log('Share health record')
  }

  function getSmokingDisplay() {
    if (!socialHistory?.smoking_status) return 'Not specified'
    if (socialHistory.smoking_status === 'never') return 'No'
    if (socialHistory.smoking_status === 'smoker') {
      return socialHistory.smoking_quantity || 'Smoker'
    }
    if (socialHistory.smoking_status === 'quit') {
      return `Quit${socialHistory.smoking_quit_date ? ` (${socialHistory.smoking_quit_date})` : ''}`
    }
    return socialHistory.smoking_status
  }

  function getDrinkingDisplay() {
    if (!socialHistory?.drinking_frequency || socialHistory.drinking_frequency === 'never') {
      return 'No'
    }
    const parts = []
    if (socialHistory.drinking_frequency === 'occasionally') {
      parts.push('Yes, occasionally')
    } else if (socialHistory.drinking_frequency === 'more_than_once_a_week') {
      parts.push('Yes, on a regular basis')
    }
    if (socialHistory.drinks_per_day && socialHistory.alcohol_type) {
      parts.push(`${socialHistory.drinks_per_day} ${socialHistory.alcohol_type} per day`)
    }
    return parts.join('\n') || 'Yes'
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
      <h1 className="text-[24px] font-bold text-center my-6">Social History</h1>

      <div className="px-4 space-y-6 flex-1 pb-20">
        {/* Smoking */}
        <div className="border-b border-gray-300 pb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-base font-medium text-gray-600">Smoking</h3>
            <button
              onClick={() => navigate('/social-history/smoking')}
              className="px-4 py-2 border border-gray-600 rounded text-sm font-extrabold h-[42px]"
            >
              Edit
            </button>
          </div>
          <p className="text-base">{getSmokingDisplay()}</p>
        </div>

        {/* Drinking Alcohol */}
        <div className="border-b border-gray-300 pb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-base font-medium text-gray-600">Drinking Alcohol</h3>
            <button
              onClick={() => navigate('/social-history/alcohol')}
              className="px-4 py-2 border border-gray-600 rounded text-sm font-extrabold h-[42px]"
            >
              Edit
            </button>
          </div>
          <p className="text-base whitespace-pre-line">{getDrinkingDisplay()}</p>
        </div>

        {/* Recreational Drugs */}
        <div className="border-b border-gray-300 pb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-base font-medium text-gray-600">Recreational Drugs incl. Cannabis</h3>
            <button
              onClick={() => navigate('/social-history/drugs')}
              className="px-4 py-2 border border-gray-600 rounded text-sm font-extrabold h-[42px]"
            >
              Edit
            </button>
          </div>
          <p className="text-base">{socialHistory?.uses_recreational_drugs ? 'Yes' : 'No'}</p>
        </div>

        {/* Caffeine */}
        <div className="border-b border-gray-300 pb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-base font-medium text-gray-600">Coffee, tea, or caffeinated beverages</h3>
            <button
              onClick={() => navigate('/social-history/caffeine')}
              className="px-4 py-2 border border-gray-600 rounded text-sm font-extrabold h-[42px]"
            >
              Edit
            </button>
          </div>
          <p className="text-base">
            {socialHistory?.uses_caffeine
              ? (socialHistory.caffeine_quantity_per_day || 'Yes')
              : 'No'}
          </p>
        </div>

        {/* Living Situation */}
        <div className="border-b border-gray-300 pb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-base font-medium text-gray-600">Your living situation. Who do you live with.</h3>
            <button
              onClick={() => navigate('/social-history/living')}
              className="px-4 py-2 border border-gray-600 rounded text-sm font-extrabold h-[42px]"
            >
              Edit
            </button>
          </div>
          <p className="text-base">{socialHistory?.living_situation || 'Not specified'}</p>
        </div>

        {/* Occupation */}
        <div className="pb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-base font-medium text-gray-600">Occupation</h3>
            <button
              onClick={() => navigate('/social-history/occupation')}
              className="px-4 py-2 border border-gray-600 rounded text-sm font-extrabold h-[42px]"
            >
              Edit
            </button>
          </div>
          <p className="text-base">{socialHistory?.occupation || 'Not specified'}</p>
        </div>
      </div>

      {/* Bottom navigation bar */}
      <div className="h-[58px] border-t border-black bg-white"></div>
    </div>
  )
}

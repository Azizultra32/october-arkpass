import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export function EditName() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [personalInfoId, setPersonalInfoId] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const { data, error } = await supabase
        .from('personal_information')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setPersonalInfoId(data.id)
        setFirstName(data.first_name || '')
        setMiddleName(data.middle_name || '')
        setLastName(data.last_name || '')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!personalInfoId) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('personal_information')
        .update({
          first_name: firstName || null,
          middle_name: middleName || null,
          last_name: lastName || null
        })
        .eq('id', personalInfoId)

      if (error) throw error

      navigate('/personal-information')
    } catch (error) {
      console.error('Error updating:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="h-14 border-b border-gray-300 flex items-center justify-between px-4">
        <button onClick={() => navigate('/personal-information')} className="text-lg">←</button>
        <h1 className="text-lg font-medium">Name</h1>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-4 py-2 bg-black text-white rounded font-extrabold w-[86px] h-[42px] disabled:bg-gray-400"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">First Name (Required)</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            className="w-full h-[58px] px-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Middle Name</label>
          <input
            type="text"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
            placeholder="Middle name"
            className="w-full h-[58px] px-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Last Name (Required)</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            className="w-full h-[58px] px-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>
    </div>
  )
}

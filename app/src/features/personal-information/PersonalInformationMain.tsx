import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

interface PersonalInfo {
  id: string
  first_name: string | null
  middle_name: string | null
  last_name: string | null
  gender: string | null
  date_of_birth: string | null
  height_value: number | null
  height_unit: string | null
  weight_value: number | null
  weight_unit: string | null
  mobile_phone: string | null
  email: string | null
  legal_address: string | null
  health_insurance_number: string | null
  health_insurance_jurisdiction: string | null
  family_doctor_name: string | null
  family_doctor_phone: string | null
  emergency_contact_name: string | null
  emergency_contact_relationship: string | null
  emergency_contact_phone: string | null
}

export function PersonalInformationMain() {
  const navigate = useNavigate()
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPersonalInfo()
  }, [])

  async function fetchPersonalInfo() {
    try {
      const { data, error } = await supabase
        .from('personal_information')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (!data) {
        const { data: newData, error: insertError } = await supabase
          .from('personal_information')
          .insert({})
          .select()
          .single()

        if (insertError) throw insertError
        setPersonalInfo(newData)
      } else {
        setPersonalInfo(data)
      }
    } catch (error) {
      console.error('Error fetching personal info:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleShareHealthRecord() {
    console.log('Share health record')
  }

  function getFullName() {
    const parts = [personalInfo?.first_name, personalInfo?.middle_name, personalInfo?.last_name].filter(Boolean)
    return parts.length > 0 ? parts.join(' ') : 'Not specified'
  }

  function getHeightWeight() {
    const height = personalInfo?.height_value && personalInfo?.height_unit
      ? `${personalInfo.height_value} ${personalInfo.height_unit}`
      : null
    const weight = personalInfo?.weight_value && personalInfo?.weight_unit
      ? `${personalInfo.weight_value} ${personalInfo.weight_unit}`
      : null

    if (height && weight) return `${height}, ${weight}`
    if (height) return height
    if (weight) return weight
    return 'Not specified'
  }

  function getHealthInsurance() {
    if (personalInfo?.health_insurance_number) {
      const jurisdiction = personalInfo.health_insurance_jurisdiction
        ? ` (${personalInfo.health_insurance_jurisdiction})`
        : ''
      return `${personalInfo.health_insurance_number}${jurisdiction}`
    }
    return 'Not specified'
  }

  function getFamilyDoctor() {
    if (personalInfo?.family_doctor_name) {
      const phone = personalInfo.family_doctor_phone ? `\n${personalInfo.family_doctor_phone}` : ''
      return `${personalInfo.family_doctor_name}${phone}`
    }
    return 'Not specified'
  }

  function getEmergencyContact() {
    if (personalInfo?.emergency_contact_name) {
      const relationship = personalInfo.emergency_contact_relationship
        ? ` (${personalInfo.emergency_contact_relationship})`
        : ''
      const phone = personalInfo.emergency_contact_phone
        ? `\n${personalInfo.emergency_contact_phone}`
        : ''
      return `${personalInfo.emergency_contact_name}${relationship}${phone}`
    }
    return 'N/A'
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
      <h2 className="text-[20px] font-bold px-4 mt-6 mb-4">Primary Info</h2>

      <div className="px-4 space-y-6 flex-1 pb-20">
        {/* Name */}
        <div className="border-b border-gray-300 pb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-base font-medium text-gray-600">Name</h3>
            <button
              onClick={() => navigate('/personal-information/name')}
              className="px-4 py-2 border border-gray-600 rounded text-sm font-extrabold h-[42px]"
            >
              Edit
            </button>
          </div>
          <p className="text-base">{getFullName()}</p>
        </div>

        {/* Gender */}
        <div className="border-b border-gray-300 pb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-base font-medium text-gray-600">Gender</h3>
            <button
              onClick={() => navigate('/personal-information/gender')}
              className="px-4 py-2 border border-gray-600 rounded text-sm font-extrabold h-[42px]"
            >
              Edit
            </button>
          </div>
          <p className="text-base">{personalInfo?.gender || 'Not specified'}</p>
        </div>

        {/* Date of Birth */}
        <div className="border-b border-gray-300 pb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-base font-medium text-gray-600">Date of Birth</h3>
            <button
              onClick={() => navigate('/personal-information/dob')}
              className="px-4 py-2 border border-gray-600 rounded text-sm font-extrabold h-[42px]"
            >
              Edit
            </button>
          </div>
          <p className="text-base">{personalInfo?.date_of_birth || 'Not specified'}</p>
        </div>

        {/* Height & Weight */}
        <div className="border-b border-gray-300 pb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-base font-medium text-gray-600">Height & Weight</h3>
            <button
              onClick={() => navigate('/personal-information/height-weight')}
              className="px-4 py-2 border border-gray-600 rounded text-sm font-extrabold h-[42px]"
            >
              Edit
            </button>
          </div>
          <p className="text-base">{getHeightWeight()}</p>
        </div>

        {/* Mobile Phone */}
        <div className="border-b border-gray-300 pb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-base font-medium text-gray-600">Mobile Phone</h3>
            <button
              onClick={() => navigate('/personal-information/phone')}
              className="px-4 py-2 border border-gray-600 rounded text-sm font-extrabold h-[42px]"
            >
              Edit
            </button>
          </div>
          <p className="text-base">{personalInfo?.mobile_phone || 'Not specified'}</p>
        </div>

        {/* Email */}
        <div className="border-b border-gray-300 pb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-base font-medium text-gray-600">Email</h3>
            <button
              onClick={() => navigate('/personal-information/email')}
              className="px-4 py-2 border border-gray-600 rounded text-sm font-extrabold h-[42px]"
            >
              Edit
            </button>
          </div>
          <p className="text-base">{personalInfo?.email || 'Not specified'}</p>
        </div>

        {/* Legal Mailing Address */}
        <div className="border-b border-gray-300 pb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-base font-medium text-gray-600">Legal Mailing Address</h3>
            <button
              onClick={() => navigate('/personal-information/address')}
              className="px-4 py-2 border border-gray-600 rounded text-sm font-extrabold h-[42px]"
            >
              Edit
            </button>
          </div>
          <p className="text-base">{personalInfo?.legal_address || 'Not specified'}</p>
        </div>

        {/* Health Insurance # */}
        <div className="border-b border-gray-300 pb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-base font-medium text-gray-600">Health Insurance #</h3>
            <button
              onClick={() => navigate('/personal-information/insurance')}
              className="px-4 py-2 border border-gray-600 rounded text-sm font-extrabold h-[42px]"
            >
              Edit
            </button>
          </div>
          <p className="text-base">{getHealthInsurance()}</p>
        </div>

        {/* Family Doctor */}
        <div className="border-b border-gray-300 pb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-base font-medium text-gray-600">Family Doctor</h3>
            <button
              onClick={() => navigate('/personal-information/doctor')}
              className="px-4 py-2 border border-gray-600 rounded text-sm font-extrabold h-[42px]"
            >
              Edit
            </button>
          </div>
          <p className="text-base whitespace-pre-line">{getFamilyDoctor()}</p>
        </div>

        {/* Emergency Contact */}
        <div className="pb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-base font-medium text-gray-600">Emergency Contact</h3>
            <button
              onClick={() => navigate('/personal-information/emergency')}
              className="px-4 py-2 border border-gray-600 rounded text-sm font-extrabold h-[42px]"
            >
              Edit
            </button>
          </div>
          <p className="text-base whitespace-pre-line">{getEmergencyContact()}</p>
        </div>
      </div>

      {/* Bottom navigation bar */}
      <div className="h-[58px] border-t border-black bg-white"></div>
    </div>
  )
}

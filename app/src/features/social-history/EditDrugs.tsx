import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

interface DrugEntry {
  id?: string
  drug_type: string
  custom_drug_name: string
  frequency: string
}

export function EditDrugs() {
  const navigate = useNavigate()
  const [usesDrugs, setUsesDrugs] = useState(false)
  const [drugEntries, setDrugEntries] = useState<DrugEntry[]>([
    { drug_type: '', custom_drug_name: '', frequency: '' }
  ])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [socialHistoryId, setSocialHistoryId] = useState<string | null>(null)

  const drugTypeOptions = [
    { value: 'cannabis', label: 'Cannabis' },
    { value: 'psychoactive_medications', label: 'Psychoactive medications' },
    { value: 'stimulants_mdma', label: 'Stimulants/MDMA' },
    { value: 'opioids', label: 'Opioids' },
    { value: 'hallucinogens', label: 'Hallucinogens' },
    { value: 'cocaine', label: 'Cocaine' },
    { value: 'other', label: 'Other' }
  ]

  const frequencyOptions = [
    'Not at all in the past month',
    'Once or twice in the past month',
    'Weekly',
    'Daily or almost daily',
    'Multiple times per day'
  ]

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const { data: shData, error: shError } = await supabase
        .from('social_history')
        .select('*')
        .single()

      if (shError && shError.code !== 'PGRST116') throw shError

      if (shData) {
        setSocialHistoryId(shData.id)
        setUsesDrugs(shData.uses_recreational_drugs || false)

        const { data: drugData, error: drugError } = await supabase
          .from('recreational_drugs')
          .select('*')
          .eq('social_history_id', shData.id)

        if (drugError) throw drugError

        if (drugData && drugData.length > 0) {
          setDrugEntries(drugData.map((d: any) => ({
            id: d.id,
            drug_type: d.drug_type,
            custom_drug_name: d.custom_drug_name || '',
            frequency: d.frequency
          })))
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDrugEntryChange = (index: number, field: keyof DrugEntry, value: string) => {
    const newEntries = [...drugEntries]
    newEntries[index] = { ...newEntries[index], [field]: value }
    setDrugEntries(newEntries)
  }

  const addMoreDrug = () => {
    setDrugEntries([...drugEntries, { drug_type: '', custom_drug_name: '', frequency: '' }])
  }

  const removeDrug = (index: number) => {
    if (drugEntries.length > 1) {
      setDrugEntries(drugEntries.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async () => {
    if (!socialHistoryId) return

    setIsSubmitting(true)
    try {
      // Update social_history uses_recreational_drugs flag
      const { error: shError } = await supabase
        .from('social_history')
        .update({ uses_recreational_drugs: usesDrugs })
        .eq('id', socialHistoryId)

      if (shError) throw shError

      // Delete existing drug entries
      const { error: deleteError } = await supabase
        .from('recreational_drugs')
        .delete()
        .eq('social_history_id', socialHistoryId)

      if (deleteError) throw deleteError

      // Insert new drug entries if usesDrugs is true
      if (usesDrugs) {
        const validEntries = drugEntries.filter(entry => entry.drug_type && entry.frequency)
        if (validEntries.length > 0) {
          const { error: insertError } = await supabase
            .from('recreational_drugs')
            .insert(validEntries.map(entry => ({
              social_history_id: socialHistoryId,
              drug_type: entry.drug_type,
              custom_drug_name: entry.drug_type === 'other' ? entry.custom_drug_name : null,
              frequency: entry.frequency
            })))

          if (insertError) throw insertError
        }
      }

      navigate('/social-history')
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
      {/* Header */}
      <div className="h-14 border-b border-gray-300 flex items-center justify-between px-4">
        <button
          onClick={() => navigate('/social-history')}
          className="text-lg"
        >
          ←
        </button>
        <h1 className="text-lg font-medium">Recreational Drugs</h1>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-4 py-2 bg-black text-white rounded font-extrabold w-[86px] h-[42px] disabled:bg-gray-400"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Yes/No Radio Buttons */}
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="uses_drugs"
              checked={usesDrugs === true}
              onChange={() => setUsesDrugs(true)}
              className="w-5 h-5"
            />
            <span className="text-base">Yes</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="uses_drugs"
              checked={usesDrugs === false}
              onChange={() => setUsesDrugs(false)}
              className="w-5 h-5"
            />
            <span className="text-base">No</span>
          </label>
        </div>

        {/* Conditional: Drug entries if Yes */}
        {usesDrugs && (
          <div className="space-y-4">
            {drugEntries.map((entry, index) => (
              <div key={index} className="p-4 border border-gray-300 rounded space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-600">Drug Entry {index + 1}</h3>
                  {drugEntries.length > 1 && (
                    <button
                      onClick={() => removeDrug(index)}
                      className="text-red-600 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    What type of recreational drug?
                  </label>
                  <div className="relative">
                    <select
                      value={entry.drug_type}
                      onChange={(e) => handleDrugEntryChange(index, 'drug_type', e.target.value)}
                      className="w-full h-[58px] px-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black appearance-none"
                    >
                      <option value="">Select...</option>
                      {drugTypeOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      ▼
                    </div>
                  </div>
                </div>

                {entry.drug_type === 'other' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Specify drug name
                    </label>
                    <input
                      type="text"
                      value={entry.custom_drug_name}
                      onChange={(e) => handleDrugEntryChange(index, 'custom_drug_name', e.target.value)}
                      placeholder="Enter drug name..."
                      className="w-full h-[58px] px-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    How often?
                  </label>
                  <div className="relative">
                    <select
                      value={entry.frequency}
                      onChange={(e) => handleDrugEntryChange(index, 'frequency', e.target.value)}
                      className="w-full h-[58px] px-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black appearance-none"
                    >
                      <option value="">Select...</option>
                      {frequencyOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      ▼
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addMoreDrug}
              className="text-blue-600 text-base font-medium"
            >
              Add more
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

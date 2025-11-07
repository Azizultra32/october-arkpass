import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { BottomNav } from '../../components/BottomNav'

interface Folder {
  name: string
  count: number
}

interface Document {
  id: string
  name: string
  folder: string
  created_at: string
}

export function DocumentsList() {
  const navigate = useNavigate()
  const [view, setView] = useState<'browse' | 'inbox'>('browse')
  const [folders] = useState<Folder[]>([
    { name: 'Prescriptions', count: 0 },
    { name: 'Lab Results', count: 0 },
    { name: 'Imaging', count: 0 },
    { name: 'Consult', count: 0 },
    { name: 'Other', count: 0 }
  ])
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDocuments()
  }, [])

  async function fetchDocuments() {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setDocuments(data || [])
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }

  function getFolderCount(folderName: string) {
    return documents.filter(d => d.folder === folderName).length
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
      <h1 className="text-[24px] font-bold text-center my-6">My Documents</h1>

      <div className="px-4 space-y-3 flex-1">
        {/* Add New Document button */}
        <button
          onClick={() => navigate('/documents/add')}
          className="w-full h-[58px] bg-gray-100 border border-gray-600 rounded-lg font-extrabold text-base hover:bg-gray-200"
        >
          + Add New Document
        </button>

        {/* Search input */}
        <input
          type="text"
          placeholder="Search"
          className="w-full h-[58px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />

        {/* Filter button */}
        <button className="w-full h-[42px] border border-gray-600 rounded font-extrabold text-base hover:bg-gray-50">
          Filter
        </button>

        {/* Divider */}
        <div className="border-t-2 border-gray-300 my-4"></div>

        {/* Browse / Inbox toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setView('browse')}
            className={`flex-1 h-[42px] rounded font-extrabold text-base ${
              view === 'browse'
                ? 'bg-black text-white'
                : 'bg-white border border-gray-600 text-black hover:bg-gray-50'
            }`}
          >
            Browse
          </button>
          <button
            onClick={() => setView('inbox')}
            className={`flex-1 h-[42px] rounded font-extrabold text-base ${
              view === 'inbox'
                ? 'bg-black text-white'
                : 'bg-white border border-gray-600 text-black hover:bg-gray-50'
            }`}
          >
            Inbox
          </button>
        </div>

        {/* Browse view - Folders */}
        {view === 'browse' && (
          <div className="space-y-3 pb-20">
            {folders.map((folder) => (
              <div
                key={folder.name}
                onClick={() => navigate(`/documents/folder/${folder.name.toLowerCase().replace(' ', '-')}`)}
                className="border border-gray-600 rounded p-4 cursor-pointer hover:border-gray-800"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">☰</span>
                  <span className="text-lg">📁</span>
                  <div className="flex-1">
                    <h3 className="text-base font-bold">{folder.name}</h3>
                    <p className="text-sm text-gray-600">
                      {getFolderCount(folder.name)} document{getFolderCount(folder.name) !== 1 ? 's' : ''} inside
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Loose files (not in folders) */}
            {documents.filter(d => !d.folder).map((doc) => (
              <div
                key={doc.id}
                onClick={() => navigate(`/documents/${doc.id}`)}
                className="border border-gray-600 rounded p-4 cursor-pointer hover:border-gray-800"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">📄</span>
                  <div className="flex-1">
                    <h3 className="text-base font-bold">{doc.name}</h3>
                    <p className="text-sm text-gray-600">{new Date(doc.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Inbox view - Date-based list */}
        {view === 'inbox' && (
          <div className="space-y-3 pb-20">
            {documents.map((doc) => (
              <div
                key={doc.id}
                onClick={() => navigate(`/documents/${doc.id}`)}
                className="border border-gray-600 rounded p-4 cursor-pointer hover:border-gray-800"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">📄</span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{new Date(doc.created_at).toLocaleDateString()}</p>
                    <h3 className="text-base font-bold">{doc.name}</h3>
                    {doc.folder && <p className="text-sm text-gray-500">{doc.folder}</p>}
                  </div>
                </div>
              </div>
            ))}
            {documents.length === 0 && (
              <p className="text-gray-500 text-center py-8">No documents yet</p>
            )}
          </div>
        )}
      </div>

      {/* Bottom navigation bar */}
      <BottomNav />
    </div>
  )
}

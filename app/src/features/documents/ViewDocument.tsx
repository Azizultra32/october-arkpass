import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

interface Document {
  id: string
  name: string
  folder: string | null
  document_date: string | null
  tags: string | null
  created_at: string
}

export function ViewDocument() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [document, setDocument] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchDocument(id)
    }
  }, [id])

  async function fetchDocument(documentId: string) {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single()

      if (error) throw error
      setDocument(data)
    } catch (error) {
      console.error('Error fetching document:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!id || !confirm('Are you sure you want to delete this document?')) return

    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id)

      if (error) throw error

      navigate('/documents')
    } catch (error) {
      console.error('Error deleting document:', error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!document) {
    return <div className="flex items-center justify-center min-h-screen">Document not found</div>
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="h-14 border-b border-gray-300 flex items-center justify-between px-4">
        <button
          onClick={() => navigate('/documents')}
          className="text-lg"
        >
          ← Documents
        </button>
        <button
          onClick={() => navigate('/documents')}
          className="text-2xl"
        >
          ×
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Document preview placeholder */}
        <div className="w-full h-64 bg-gray-100 border border-gray-300 rounded flex items-center justify-center">
          <p className="text-gray-500">📄 Document Preview</p>
        </div>

        {/* Document Name */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
          <p className="text-base font-bold">{document.name}</p>
        </div>

        {/* Folder */}
        {document.folder && (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Folder</label>
            <p className="text-base font-bold">{document.folder}</p>
          </div>
        )}

        {/* Date */}
        {document.document_date && (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
            <p className="text-base font-bold">{document.document_date}</p>
          </div>
        )}

        {/* Tags */}
        {document.tags && (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Tags</label>
            <p className="text-base font-bold">{document.tags}</p>
          </div>
        )}

        {/* Created */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Uploaded</label>
          <p className="text-base font-bold">{new Date(document.created_at).toLocaleDateString()}</p>
        </div>

        {/* Action buttons */}
        <div className="space-y-3 pt-4">
          <button
            onClick={() => console.log('Share document')}
            className="w-full h-[58px] bg-black text-white rounded font-extrabold text-base hover:bg-gray-800"
          >
            Share Document
          </button>

          <button
            onClick={handleDelete}
            className="w-full h-[58px] border border-red-600 text-red-600 rounded font-extrabold text-base hover:bg-red-50"
          >
            Delete Document
          </button>
        </div>
      </div>
    </div>
  )
}

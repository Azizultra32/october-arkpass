import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MedicationsList } from './features/medications/MedicationsList'
import { AddMedication } from './features/medications/AddMedication'
import { ViewMedication } from './features/medications/ViewMedication'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to="/medications" replace />} />
        <Route path="medications" element={<MedicationsList />} />
        <Route path="medications/add" element={<AddMedication />} />
        <Route path="medications/:id" element={<ViewMedication />} />
        {/* TODO: Add other feature routes */}
      </Routes>
    </BrowserRouter>
  )
}

export default App

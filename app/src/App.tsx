import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MedicationsList } from './features/medications/MedicationsList'
import { AddMedication } from './features/medications/AddMedication'
import { ViewMedication } from './features/medications/ViewMedication'
import { AllergiesList } from './features/allergies/AllergiesList'
import { AddAllergy } from './features/allergies/AddAllergy'
import { ViewAllergy } from './features/allergies/ViewAllergy'
import { ConditionsList } from './features/conditions/ConditionsList'
import { AddCondition } from './features/conditions/AddCondition'
import { ViewCondition } from './features/conditions/ViewCondition'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to="/medications" replace />} />

        {/* Medications */}
        <Route path="medications" element={<MedicationsList />} />
        <Route path="medications/add" element={<AddMedication />} />
        <Route path="medications/:id" element={<ViewMedication />} />

        {/* Allergies */}
        <Route path="allergies" element={<AllergiesList />} />
        <Route path="allergies/add" element={<AddAllergy />} />
        <Route path="allergies/:id" element={<ViewAllergy />} />

        {/* Conditions */}
        <Route path="conditions" element={<ConditionsList />} />
        <Route path="conditions/add" element={<AddCondition />} />
        <Route path="conditions/:id" element={<ViewCondition />} />

        {/* TODO: Add remaining feature routes */}
      </Routes>
    </BrowserRouter>
  )
}

export default App

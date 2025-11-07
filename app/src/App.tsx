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
import { ImmunizationsList } from './features/immunizations/ImmunizationsList'
import { AddImmunization } from './features/immunizations/AddImmunization'
import { ViewImmunization } from './features/immunizations/ViewImmunization'
import { SurgeriesList } from './features/surgeries/SurgeriesList'
import { AddSurgery } from './features/surgeries/AddSurgery'
import { ViewSurgery } from './features/surgeries/ViewSurgery'
import { SupplementsList } from './features/supplements/SupplementsList'
import { AddSupplement } from './features/supplements/AddSupplement'
import { ViewSupplement } from './features/supplements/ViewSupplement'

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

        {/* Immunizations */}
        <Route path="immunizations" element={<ImmunizationsList />} />
        <Route path="immunizations/add" element={<AddImmunization />} />
        <Route path="immunizations/:id" element={<ViewImmunization />} />

        {/* Surgeries */}
        <Route path="surgeries" element={<SurgeriesList />} />
        <Route path="surgeries/add" element={<AddSurgery />} />
        <Route path="surgeries/:id" element={<ViewSurgery />} />

        {/* Supplements */}
        <Route path="supplements" element={<SupplementsList />} />
        <Route path="supplements/add" element={<AddSupplement />} />
        <Route path="supplements/:id" element={<ViewSupplement />} />

        {/* TODO: Add remaining feature routes */}
      </Routes>
    </BrowserRouter>
  )
}

export default App

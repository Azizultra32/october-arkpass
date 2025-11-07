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
import { FamilyHistoryList } from './features/family-history/FamilyHistoryList'
import { AddFamilyMember } from './features/family-history/AddFamilyMember'
import { EditFamilyMember } from './features/family-history/EditFamilyMember'
import { SocialHistoryMain } from './features/social-history/SocialHistoryMain'
import { EditSmoking } from './features/social-history/EditSmoking'
import { EditAlcohol } from './features/social-history/EditAlcohol'
import { EditDrugs } from './features/social-history/EditDrugs'
import { EditCaffeine } from './features/social-history/EditCaffeine'
import { EditLiving } from './features/social-history/EditLiving'
import { EditOccupation } from './features/social-history/EditOccupation'
import { PersonalInformationMain } from './features/personal-information/PersonalInformationMain'
import { EditName } from './features/personal-information/EditName'
import { EditBasicField } from './features/personal-information/EditBasicField'
import { EditHeightWeight } from './features/personal-information/EditHeightWeight'
import { EditComplex } from './features/personal-information/EditComplex'
import { DocumentsList } from './features/documents/DocumentsList'
import { AddDocument } from './features/documents/AddDocument'
import { ViewDocument } from './features/documents/ViewDocument'

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

        {/* Family History */}
        <Route path="family-history" element={<FamilyHistoryList />} />
        <Route path="family-history/add" element={<AddFamilyMember />} />
        <Route path="family-history/:id/edit" element={<EditFamilyMember />} />

        {/* Social History */}
        <Route path="social-history" element={<SocialHistoryMain />} />
        <Route path="social-history/smoking" element={<EditSmoking />} />
        <Route path="social-history/alcohol" element={<EditAlcohol />} />
        <Route path="social-history/drugs" element={<EditDrugs />} />
        <Route path="social-history/caffeine" element={<EditCaffeine />} />
        <Route path="social-history/living" element={<EditLiving />} />
        <Route path="social-history/occupation" element={<EditOccupation />} />

        {/* Personal Information */}
        <Route path="personal-information" element={<PersonalInformationMain />} />
        <Route path="personal-information/name" element={<EditName />} />
        <Route path="personal-information/:field" element={<EditBasicField />} />
        <Route path="personal-information/height-weight" element={<EditHeightWeight />} />
        <Route path="personal-information/insurance" element={<EditComplex />} />
        <Route path="personal-information/doctor" element={<EditComplex />} />
        <Route path="personal-information/emergency" element={<EditComplex />} />

        {/* Documents */}
        <Route path="documents" element={<DocumentsList />} />
        <Route path="documents/add" element={<AddDocument />} />
        <Route path="documents/:id" element={<ViewDocument />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App

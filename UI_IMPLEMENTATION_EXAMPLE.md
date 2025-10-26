# UI Implementation Examples - Pixel-Perfect Specifications

**Purpose**: Show exactly how screens will be built to match Figma
**Date**: 2025-10-25

---

## Example 1: Allergies List Screen

**Figma Node**: 1483:8437
**Screen Type**: List view with Quick Add

### Visual Layout (Exact Figma Match)

```
┌─────────────────────────────────────────────────┐
│  [Share Your Health Record]                     │  ← Black button, 58px height
│                                                  │     Full width minus 32px margin
│                                                  │
│                  Allergies                       │  ← Title: 24px, bold, centered
│                                                  │
│  ┌─────────────────────────────┬──────────────┐ │
│  │ Quick Add                   │  Add         │ │  ← Inline input + button
│  └─────────────────────────────┴──────────────┘ │     Height: 48px
│                                                  │
│  [+ Add with details]                           │  ← Outlined button, 42px height
│                                                  │     Border: 1px #666666
│                                                  │
│  ──────────────────────────────────────────     │  ← Divider line
│                                                  │
│  MEDICATION ALLERGIES                           │  ← Section header
│                                                  │     Font: 12px, #666666, uppercase
│  ┌──────────────────────────────────────────┐  │
│  │  Penicillins                        ●    │  │  ← Allergy card
│  └──────────────────────────────────────────┘  │     Border: 1px #666666, radius: 4px
│                                                  │     Padding: 16px
│  ┌──────────────────────────────────────────┐  │     Status dot: 10px, positioned right
│  │  Erythromycin                       ●    │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  ──────────────────────────────────────────     │
│                                                  │
│  ENVIRONMENTAL/SEASONAL/SKIN/OTHER              │  ← Section header
│  No environmental/seasonal/skin/other allergies │  ← Empty state
│                                                  │     Font: 16px, #999999
│                                                  │
│  ──────────────────────────────────────────     │
│                                                  │
│  [Home] [Records] [Profile] [Settings]         │  ← Bottom nav
└─────────────────────────────────────────────────┘
```

### Detailed Component Specifications

#### Share Button
```css
.share-button {
  width: 100%; /* Full width minus margins */
  height: 58px;
  background: #000000;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 500;
  border-radius: 4px;
  border: none;
  margin: 16px;
  margin-bottom: 24px;
}
```

#### Title
```css
.screen-title {
  font-size: 24px;
  font-weight: 700; /* Bold */
  color: #000000;
  text-align: center;
  margin-bottom: 24px;
}
```

#### Quick Add Component
```css
.quick-add-container {
  display: flex;
  height: 48px;
  margin: 0 16px 16px 16px;
  border: 1px solid #CCCCCC;
  border-radius: 4px;
  overflow: hidden;
}

.quick-add-input {
  flex: 1;
  border: none;
  padding: 0 16px;
  font-size: 16px;
  color: #000000;
}

.quick-add-input::placeholder {
  color: #999999;
}

.quick-add-button {
  width: 80px;
  background: #000000;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 500;
  border: none;
  cursor: pointer;
}
```

#### Add with Details Button
```css
.add-with-details-button {
  width: calc(100% - 32px);
  height: 42px;
  background: transparent;
  border: 1px solid #666666;
  border-radius: 4px;
  color: #000000;
  font-size: 16px;
  margin: 0 16px 16px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.add-with-details-button::before {
  content: "+";
  font-size: 20px;
  font-weight: 300;
}
```

#### Section Header
```css
.section-header {
  font-size: 12px;
  font-weight: 700;
  color: #666666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 16px 16px 8px 16px;
}
```

#### Allergy Card
```css
.allergy-card {
  border: 1px solid #666666;
  border-radius: 4px;
  padding: 16px;
  margin: 0 16px 12px 16px;
  background: #FFFFFF;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s;
}

.allergy-card:active {
  background: #F5F5F5;
}

.allergy-name {
  font-size: 20px;
  font-weight: 700;
  color: #000000;
}

.status-dot {
  width: 10px;
  height: 10px;
  background: #DC3445; /* Red for incomplete */
  border-radius: 50%;
  flex-shrink: 0;
}

.status-dot.complete {
  background: #4CAF50; /* Green for complete */
}
```

#### Empty State
```css
.empty-state {
  font-size: 16px;
  color: #999999;
  padding: 16px;
  text-align: center;
  font-style: italic;
}
```

### React Native Implementation

```tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';

export function AllergiesListScreen() {
  const [quickAddValue, setQuickAddValue] = useState('');
  const [allergies, setAllergies] = useState([
    { id: '1', name: 'Penicillins', category: 'medication', complete: false },
    { id: '2', name: 'Erythromycin', category: 'medication', complete: false },
  ]);

  const handleQuickAdd = () => {
    if (quickAddValue.trim()) {
      // Create minimal allergy record (name only)
      // Navigate to view/edit to complete details
      setQuickAddValue('');
    }
  };

  const medicationAllergies = allergies.filter(a => a.category === 'medication');
  const otherAllergies = allergies.filter(a => a.category !== 'medication');

  return (
    <ScrollView style={styles.container}>
      {/* Share Button */}
      <TouchableOpacity style={styles.shareButton}>
        <Text style={styles.shareButtonText}>Share Your Health Record</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Allergies</Text>

      {/* Quick Add */}
      <View style={styles.quickAddContainer}>
        <TextInput
          style={styles.quickAddInput}
          placeholder="Quick Add"
          value={quickAddValue}
          onChangeText={setQuickAddValue}
          onSubmitEditing={handleQuickAdd}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={styles.quickAddButton}
          onPress={handleQuickAdd}
        >
          <Text style={styles.quickAddButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Add with Details Button */}
      <TouchableOpacity
        style={styles.addWithDetailsButton}
        onPress={() => {/* Navigate to Add Allergy screen */}}
      >
        <Text style={styles.addWithDetailsButtonText}>+ Add with details</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Medication Allergies Section */}
      <Text style={styles.sectionHeader}>MEDICATION ALLERGIES</Text>
      {medicationAllergies.map(allergy => (
        <TouchableOpacity
          key={allergy.id}
          style={styles.allergyCard}
          onPress={() => {/* Navigate to View Allergy */}}
        >
          <Text style={styles.allergyName}>{allergy.name}</Text>
          <View style={[
            styles.statusDot,
            allergy.complete && styles.statusDotComplete
          ]} />
        </TouchableOpacity>
      ))}

      {/* Divider */}
      <View style={styles.divider} />

      {/* Environmental/Seasonal/Skin/Other Section */}
      <Text style={styles.sectionHeader}>
        ENVIRONMENTAL/SEASONAL/SKIN/OTHER
      </Text>
      {otherAllergies.length === 0 ? (
        <Text style={styles.emptyState}>
          No environmental/seasonal/skin/other allergies
        </Text>
      ) : (
        otherAllergies.map(allergy => (
          <TouchableOpacity
            key={allergy.id}
            style={styles.allergyCard}
            onPress={() => {/* Navigate to View Allergy */}}
          >
            <Text style={styles.allergyName}>{allergy.name}</Text>
            <View style={[
              styles.statusDot,
              allergy.complete && styles.statusDotComplete
            ]} />
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  shareButton: {
    height: 58,
    backgroundColor: '#000000',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 24,
  },
  quickAddContainer: {
    flexDirection: 'row',
    height: 48,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    overflow: 'hidden',
  },
  quickAddInput: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000000',
  },
  quickAddButton: {
    width: 80,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickAddButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  addWithDetailsButton: {
    height: 42,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#666666',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addWithDetailsButtonText: {
    color: '#000000',
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  allergyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#666666',
    borderRadius: 4,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  allergyName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  statusDot: {
    width: 10,
    height: 10,
    backgroundColor: '#DC3445',
    borderRadius: 5,
  },
  statusDotComplete: {
    backgroundColor: '#4CAF50',
  },
  emptyState: {
    fontSize: 16,
    color: '#999999',
    padding: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
```

---

## Example 2: Edit Allergy (Expanded) - COMPLETE VERSION

**Figma Node**: 1483:8441 (base) + ALLERGIES_EXPANSION_SPEC requirements
**Screen Type**: Field-level edit with safety-critical fields

### Visual Layout (Production Version with Safety Fields)

```
┌─────────────────────────────────────────────────┐
│  ←  Penicillins                         [Save] │  ← Header: Back + Name + Save
├─────────────────────────────────────────────────┤
│                                                  │
│  Name (Required)                                │  ← Label: 14px, #666666
│  [Penicillins_______________________________]  │  ← Input: 58px height, 16px font
│                                                  │     Border: 1px #CCCCCC (or red if error)
│                                                  │
│  Category (Required)                            │  ← NEW: Safety critical
│  [Medication_____________________________] ▼   │  ← Dropdown: 58px height
│                                                  │
│  Severity (Required)                            │  ← NEW: Safety critical
│  ● Severe  ○ Not Severe                         │  ← Radio buttons: horizontal layout
│                                                  │     Font: 16px, gap: 24px
│                                                  │
│  EpiPen Prescribed? (Required)                  │  ← NEW: CRITICAL safety field
│  ● Yes  ○ No                                    │  ← Radio buttons: horizontal
│                                                  │     ⚠️ SHOWS ONLY if Severity = "Severe"
│                                                  │
│  ──────────────────────────────────────────     │  ← Show more separator
│                                                  │
│  Show more ▼                                    │  ← Expandable section
│                                                  │
└─────────────────────────────────────────────────┘
```

### When "Show more" Clicked (Expanded State)

```
┌─────────────────────────────────────────────────┐
│  ←  Penicillins                         [Save] │
├─────────────────────────────────────────────────┤
│                                                  │
│  Name (Required)                                │
│  [Penicillins_______________________________]  │
│                                                  │
│  Category (Required)                            │
│  [Medication_____________________________] ▼   │
│                                                  │
│  Severity (Required)                            │
│  ● Severe  ○ Not Severe                         │
│                                                  │
│  EpiPen Prescribed? (Required)                  │
│  ● Yes  ○ No                                    │
│                                                  │
│  ──────────────────────────────────────────     │
│                                                  │
│  Onset                                          │  ← Dual-mode date component
│  ┌──────────┬──────────────────────────────┐  │
│  │ Date  ▼ │ Select Date              📅  │  │  ← Mode selector + date picker
│  └──────────┴──────────────────────────────┘  │     107px + flexible width
│                                                  │
│  Details                                        │
│  [First reaction at age 5. Required________]  │  ← Textarea: 90px height
│  [hospitalization. Now carries EpiPen at___]  │     Multi-line
│  [all times.______________________________ ]  │
│                                                  │
│  ──────────────────────────────────────────     │
│                                                  │
│  DOCUMENTS                                      │
│  Document 1                             🗑️     │  ← Document with delete icon
│  Document 2                             🗑️     │
│  [+ Add Documents]                              │
│                                                  │
│  ──────────────────────────────────────────     │
│                                                  │
│  Show less ▲                                    │
│                                                  │
│  ──────────────────────────────────────────     │
│                                                  │
│  🗑️ Delete Allergy                              │  ← Delete button at bottom
│                                                  │     Red text + icon
└─────────────────────────────────────────────────┘
```

### Detailed Component Specifications

#### Header Bar
```css
.edit-header {
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #E0E0E0;
  background: #FFFFFF;
}

.back-button {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  width: 24px;
  height: 24px;
  color: #000000;
}

.header-title {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin-left: 16px;
}

.save-button {
  width: 77px;
  height: 42px;
  background: transparent;
  border: 1px solid #666666;
  border-radius: 4px;
  font-size: 16px;
  color: #000000;
  font-weight: 500;
}

.save-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
```

#### Text Input Field
```css
.field-container {
  margin: 16px;
}

.field-label {
  font-size: 14px;
  color: #666666;
  margin-bottom: 8px;
}

.field-label.required::after {
  content: " (Required)";
  color: #DC3445;
}

.text-input {
  height: 58px;
  border: 1px solid #CCCCCC;
  border-radius: 4px;
  padding: 0 16px;
  font-size: 16px;
  color: #000000;
  background: #FFFFFF;
}

.text-input.error {
  border-color: #DC3445;
}

.text-input:focus {
  border-color: #000000;
  outline: none;
}

.text-input::placeholder {
  color: #CCCCCC;
}
```

#### Dropdown Field
```css
.dropdown-container {
  position: relative;
}

.dropdown-button {
  height: 58px;
  width: 100%;
  border: 1px solid #CCCCCC;
  border-radius: 4px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #FFFFFF;
  cursor: pointer;
}

.dropdown-value {
  font-size: 16px;
  color: #000000;
}

.dropdown-value.placeholder {
  color: #CCCCCC;
}

.dropdown-icon {
  width: 20px;
  height: 20px;
  color: #666666;
}
```

#### Radio Button Group (Severity & EpiPen)
```css
.radio-group {
  display: flex;
  gap: 24px;
  margin-top: 12px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.radio-button {
  width: 20px;
  height: 20px;
  border: 2px solid #666666;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFFFFF;
}

.radio-button.selected {
  border-color: #000000;
}

.radio-button.selected::after {
  content: '';
  width: 10px;
  height: 10px;
  background: #000000;
  border-radius: 50%;
}

.radio-label {
  font-size: 16px;
  color: #000000;
}
```

#### Dual-Mode Date Component
```css
.dual-mode-date {
  display: flex;
  gap: 16px;
  margin-top: 12px;
}

.mode-selector {
  width: 107px;
  height: 58px;
  border: 1px solid #CCCCCC;
  border-radius: 4px;
  padding: 0 12px;
  background: #FFFFFF;
  font-size: 16px;
  color: #000000;
}

.date-input {
  flex: 1;
  height: 58px;
  border: 1px solid #CCCCCC;
  border-radius: 4px;
  padding: 0 16px;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.calendar-icon {
  width: 24px;
  height: 24px;
  color: #666666;
}
```

#### Textarea
```css
.textarea {
  min-height: 90px;
  border: 1px solid #CCCCCC;
  border-radius: 4px;
  padding: 16px;
  font-size: 16px;
  color: #000000;
  line-height: 24px;
  resize: vertical;
}
```

#### Show More/Less Toggle
```css
.show-more-button {
  width: 100%;
  height: 48px;
  border: none;
  background: transparent;
  color: #0066CC;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  margin: 16px 0;
}

.chevron-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.2s;
}

.chevron-icon.expanded {
  transform: rotate(180deg);
}
```

#### Delete Button
```css
.delete-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  margin: 24px 16px 16px 16px;
  border: none;
  background: transparent;
  color: #DC3445;
  font-size: 16px;
  cursor: pointer;
}

.delete-icon {
  width: 24px;
  height: 24px;
}
```

### React Native Implementation (Complete with Safety Fields)

```tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';

interface AllergyFormData {
  id: string;
  name: string;
  category: 'medication' | 'food' | 'seasonal' | 'skin_contact' | 'environmental' | null;
  severity: 'severe' | 'not_severe' | null;
  epipenPrescribed: boolean | null;
  onset?: DualModeDate;
  details?: string;
}

export function EditAllergyScreen({ route, navigation }) {
  const { allergy } = route.params;

  const [formData, setFormData] = useState<AllergyFormData>({
    id: allergy.id,
    name: allergy.name || '',
    category: allergy.category || null,
    severity: allergy.severity || null,
    epipenPrescribed: allergy.epipenPrescribed || null,
    onset: allergy.onset,
    details: allergy.details || '',
  });

  const [showMore, setShowMore] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const CATEGORY_OPTIONS = [
    { value: 'medication', label: 'Medication' },
    { value: 'food', label: 'Food' },
    { value: 'seasonal', label: 'Seasonal' },
    { value: 'skin_contact', label: 'Skin/Contact' },
    { value: 'environmental', label: 'Environmental' },
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.severity) {
      newErrors.severity = 'Severity is required';
    }

    // EpiPen required if severe
    if (formData.severity === 'severe' && formData.epipenPrescribed === null) {
      newErrors.epipenPrescribed = 'EpiPen status is required for severe allergies';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      Alert.alert('Validation Error', 'Please complete all required fields');
      return;
    }

    try {
      await updateAllergy(formData.id, formData);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save allergy');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Allergy',
      `Are you sure you want to delete ${formData.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteAllergy(formData.id);
            navigation.goBack();
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{formData.name || 'New Allergy'}</Text>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Name Field */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.fieldLabel, styles.required]}>Name</Text>
          <TextInput
            style={[styles.textInput, errors.name && styles.inputError]}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Enter allergy name"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        {/* Category Dropdown */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.fieldLabel, styles.required]}>Category</Text>
          <TouchableOpacity
            style={[styles.dropdownButton, errors.category && styles.inputError]}
            onPress={() => {/* Open category picker */}}
          >
            <Text style={[
              styles.dropdownValue,
              !formData.category && styles.placeholder
            ]}>
              {formData.category
                ? CATEGORY_OPTIONS.find(o => o.value === formData.category)?.label
                : 'Select category'
              }
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
          {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
        </View>

        {/* Severity Radio Buttons */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.fieldLabel, styles.required]}>Severity</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setFormData({ ...formData, severity: 'severe' })}
            >
              <View style={[
                styles.radioButton,
                formData.severity === 'severe' && styles.radioButtonSelected
              ]}>
                {formData.severity === 'severe' && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.radioLabel}>Severe</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setFormData({
                ...formData,
                severity: 'not_severe',
                epipenPrescribed: null // Clear EpiPen if not severe
              })}
            >
              <View style={[
                styles.radioButton,
                formData.severity === 'not_severe' && styles.radioButtonSelected
              ]}>
                {formData.severity === 'not_severe' && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.radioLabel}>Not Severe</Text>
            </TouchableOpacity>
          </View>
          {errors.severity && <Text style={styles.errorText}>{errors.severity}</Text>}
        </View>

        {/* EpiPen Field (Conditional - only if Severe) */}
        {formData.severity === 'severe' && (
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, styles.required]}>EpiPen Prescribed?</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setFormData({ ...formData, epipenPrescribed: true })}
              >
                <View style={[
                  styles.radioButton,
                  formData.epipenPrescribed === true && styles.radioButtonSelected
                ]}>
                  {formData.epipenPrescribed === true && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.radioLabel}>Yes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setFormData({ ...formData, epipenPrescribed: false })}
              >
                <View style={[
                  styles.radioButton,
                  formData.epipenPrescribed === false && styles.radioButtonSelected
                ]}>
                  {formData.epipenPrescribed === false && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.radioLabel}>No</Text>
              </TouchableOpacity>
            </View>
            {errors.epipenPrescribed && (
              <Text style={styles.errorText}>{errors.epipenPrescribed}</Text>
            )}
          </View>
        )}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Show More Button */}
        <TouchableOpacity
          style={styles.showMoreButton}
          onPress={() => setShowMore(!showMore)}
        >
          <Text style={styles.showMoreText}>
            {showMore ? 'Show less' : 'Show more'}
          </Text>
          <Text style={[styles.chevron, showMore && styles.chevronUp]}>▼</Text>
        </TouchableOpacity>

        {/* Expanded Fields */}
        {showMore && (
          <>
            {/* Onset (Dual-Mode Date) */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Onset</Text>
              <DualModeDateInput
                value={formData.onset}
                onChange={(date) => setFormData({ ...formData, onset: date })}
              />
            </View>

            {/* Details Textarea */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Details</Text>
              <TextInput
                style={styles.textarea}
                value={formData.details}
                onChangeText={(text) => setFormData({ ...formData, details: text })}
                placeholder="Enter additional details..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Documents Section (Future) */}
            <View style={styles.divider} />
            <Text style={styles.sectionHeader}>DOCUMENTS</Text>
            <Text style={styles.emptyState}>No documents</Text>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>+ Add Documents</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Delete Button */}
        <View style={styles.divider} />
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Text style={styles.deleteIcon}>🗑️</Text>
          <Text style={styles.deleteText}>Delete Allergy</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#000000',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 16,
  },
  saveButton: {
    width: 77,
    height: 42,
    borderWidth: 1,
    borderColor: '#666666',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  content: {
    flex: 1,
  },
  fieldContainer: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  required: {
    // Show "(Required)" after label
  },
  textInput: {
    height: 58,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000000',
  },
  inputError: {
    borderColor: '#DC3445',
  },
  errorText: {
    fontSize: 12,
    color: '#DC3445',
    marginTop: 4,
  },
  dropdownButton: {
    height: 58,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    paddingHorizontal: 16,
  },
  dropdownValue: {
    fontSize: 16,
    color: '#000000',
  },
  placeholder: {
    color: '#CCCCCC',
  },
  dropdownIcon: {
    fontSize: 14,
    color: '#666666',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#666666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#000000',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000000',
  },
  radioLabel: {
    fontSize: 16,
    color: '#000000',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
    marginVertical: 16,
  },
  showMoreButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  showMoreText: {
    fontSize: 16,
    color: '#0066CC',
  },
  chevron: {
    fontSize: 12,
    color: '#0066CC',
  },
  chevronUp: {
    transform: [{ rotate: '180deg' }],
  },
  textarea: {
    minHeight: 90,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    padding: 16,
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
    textAlignVertical: 'top',
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666666',
    textTransform: 'uppercase',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  emptyState: {
    fontSize: 16,
    color: '#999999',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  addButton: {
    marginHorizontal: 16,
    paddingVertical: 12,
  },
  addButtonText: {
    fontSize: 16,
    color: '#0066CC',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    marginTop: 24,
  },
  deleteIcon: {
    fontSize: 20,
  },
  deleteText: {
    fontSize: 16,
    color: '#DC3445',
  },
});
```

---

## Key Differences Between Figma and Production Version

### Figma Extraction (Basic):
- Name field only
- Onset date (dual-mode)
- Details textarea
- Documents section

### Production Version (Complete with Safety):
- ✅ **Name** (same as Figma)
- ✅ **Category dropdown** (NEW - 5 options)
- ✅ **Severity radio buttons** (NEW - Severe/Not Severe)
- ✅ **EpiPen radio buttons** (NEW - CRITICAL safety field, conditional)
- ✅ **Onset** (same as Figma - dual-mode date)
- ✅ **Details** (same as Figma)
- ✅ **Documents** (same as Figma)

### Validation Rules:
```typescript
REQUIRED FIELDS:
- Name ✓
- Category ✓
- Severity ✓
- EpiPen (ONLY if Severity = "Severe") ✓

OPTIONAL FIELDS:
- Onset
- Details
- Documents
```

### Visual Warning for Severe + EpiPen = Yes:
```tsx
// In list view, show prominent warning
{allergy.severity === 'severe' && allergy.epipenPrescribed && (
  <View style={styles.warningBanner}>
    <Text style={styles.warningIcon}>⚠️</Text>
    <Text style={styles.warningText}>SEVERE - EPIPEN REQUIRED</Text>
  </View>
)}
```

---

## Comparison Checklist for Figma Review

Use this to verify implementation matches design:

### Allergies List Screen
- [ ] Share button: 58px height, black background
- [ ] Title: "Allergies", 24px, bold, centered
- [ ] Quick Add: Inline input + "Add" button, 48px total height
- [ ] Add with details: 42px height, 1px border #666666
- [ ] Section headers: 12px, uppercase, #666666
- [ ] Allergy cards: 16px padding, 1px border, 10px status dot
- [ ] Empty state: 16px font, #999999, italic

### Edit Allergy Screen (Production)
- [ ] Header: 58px height, back + title + save
- [ ] Name input: 58px height, matches Figma
- [ ] **Category dropdown**: NEW, 58px height, 5 options
- [ ] **Severity radio**: NEW, horizontal layout, 24px gap
- [ ] **EpiPen radio**: NEW, shows only if Severe selected
- [ ] Dual-mode date: 107px mode selector + flexible date picker
- [ ] Details textarea: 90px min height
- [ ] Show more/less: Blue text, chevron icon
- [ ] Delete button: Red text + trash icon

---

This gives you **pixel-perfect specifications** for both a list screen and edit screen, including the complete safety-critical fields that must be in the production version.
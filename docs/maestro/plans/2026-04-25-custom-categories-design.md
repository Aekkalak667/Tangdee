# Design Document: Custom Category System

## 1. Problem Statement
Currently, users are restricted to a fixed set of categories for recording income and expenses. To improve flexibility and personalization, the app should allow users to create and manage their own custom categories.

## 2. Requirements
- Users can add custom categories for both 'income' and 'expense' types.
- Custom categories must persist across sessions (Firestore).
- Custom categories should follow the same UI style as existing ones (Apple-style minimalism).
- Users should be able to select an icon for their custom category.
- The system should seamlessly merge fixed categories with custom ones in the selection grid.

## 3. Architecture

### 3.1 Data Schema
Custom categories will be stored in Firestore under:
`users/{uid}/categories/{categoryId}`

**Document Structure:**
```typescript
{
  id: string;
  uid: string;
  name: string;
  type: 'expense' | 'income';
  group: string; // Defaults to 'custom'
  iconName: string; // Lucide icon name
  isCustom: true;
  createdAt: Timestamp;
}
```

### 3.2 Services
- `categoryService.ts`: New service for CRUD operations on custom categories.
  - `addCustomCategory(uid, categoryData)`
  - `subscribeToCustomCategories(uid, callback)`
  - `deleteCustomCategory(uid, categoryId)`

### 3.3 UI Components
- **`CategoryGrid.tsx` (Updated)**:
  - Fetch custom categories using `subscribeToCustomCategories`.
  - Merge them with fixed categories from `constants/categories.ts`.
  - Add an "Add" button (+ icon) in the grid to trigger the creation flow.
- **`AddCategorySheet.tsx` (New)**:
  - Apple-style bottom sheet (Framer Motion).
  - Form fields: Name (Input), Icon Picker (Grid of selectable icons).

## 4. Design Details
- **Aesthetic**: Use high-radius corners (2rem), subtle shadows, and SF Pro-like typography.
- **Interactions**:
  - Tapping '+' in `CategoryGrid` opens the `AddCategorySheet`.
  - Long-pressing a custom category in `CategoryGrid` (optional) or a separate management UI to delete/edit.

## 5. Alternatives Considered
- **Fixed Categories Only**: Too restrictive for users.
- **Global Custom Categories**: Privacy concerns and naming collisions. User-specific storage is safer and more personal.

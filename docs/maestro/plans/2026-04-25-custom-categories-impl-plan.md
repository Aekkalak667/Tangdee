# Implementation Plan: Custom Category System

## Phase 1: Foundation (Service & Types)
1.  **Types**: Update `src/constants/categories.ts` to support custom categories (add `isCustom` and `name` properties).
2.  **Service**: Create `src/services/categoryService.ts` with Firestore integration for CRUD operations.
3.  **Tests**: Add Unit Tests for `categoryService` in `src/services/__tests__/categoryService.test.ts`.

## Phase 2: UI - Category Creation
1.  **Component**: Create `src/components/transactions/AddCategorySheet.tsx`.
2.  **Component**: Create `src/components/ui/IconPicker.tsx` (reusable from `WalletForm` logic).
3.  **Styling**: Add CSS modules for the new components following the minimalism guidelines.

## Phase 3: UI - Integration
1.  **CategoryGrid**: Update `src/components/transactions/CategoryGrid.tsx` to:
    - Load custom categories from Firestore.
    - Merge and display them.
    - Show the '+' button.
2.  **AddTransaction**: Ensure the main transaction flow correctly stores the `categoryId` and `name` for custom categories.
3.  **Localization**: Add keys for the new "Add Category" UI in `dictionaries/th.json` and `dictionaries/en.json`.

## Phase 4: Verification
1.  **Manual Testing**: Create a custom category and use it in a transaction.
2.  **Smoke Tests**: Run existing smoke tests to ensure no regressions.
3.  **Cleanup**: Final code review and polish.

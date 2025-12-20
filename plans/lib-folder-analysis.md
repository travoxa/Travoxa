# Lib Folder Analysis Report

## Executive Summary

After analyzing the `/lib` folder, I've identified **multiple duplicate functions** across different database implementations (MongoDB and Firebase). The project maintains parallel implementations for different database backends, but some functions have inconsistencies in their usage patterns.

## Duplicate Functions Found

### 1. User Management Functions

#### `checkUserExists`
- **Location**: [`lib/mongodbUtils.ts:39`](lib/mongodbUtils.ts:39), [`lib/userUtils.ts:42`](lib/userUtils.ts:42)
- **MongoDB Version**: Takes `email: string` parameter, returns `Promise<boolean>`
- **Firebase Version**: Takes `uid: string` parameter, returns `Promise<boolean>`
- **Usage**: 
  - MongoDB version: ✅ **USED** in [`app/api/users/route.ts:27`](app/api/users/route.ts:27)
  - Firebase version: ❌ **NOT USED** anywhere in the codebase

#### `checkUserExistsByEmail`
- **Location**: [`lib/mongodbUtils.ts:50`](lib/mongodbUtils.ts:50), [`lib/userUtils.ts:55`](lib/userUtils.ts:55), [`lib/clientUtils.ts:2`](lib/clientUtils.ts:2)
- **MongoDB Version**: Takes `email: string`, returns `{ exists: boolean; userData?: IUser }`
- **Firebase Version**: Takes `email: string`, returns `{ exists: boolean; uid?: string; userData?: User }`
- **Client Version**: Takes `email: string`, returns `{ exists: boolean }`
- **Usage**:
  - MongoDB version: ❌ **NOT USED** anywhere in the codebase
  - Firebase version: ❌ **NOT USED** anywhere in the codebase
  - Client version: ✅ **USED** in [`app/onboarding/page.tsx:113`](app/onboarding/page.tsx:113) and imported in [`app/onboarding/page.tsx:9`](app/onboarding/page.tsx:9)

#### `getUser`
- **Location**: [`lib/mongodbUtils.ts:69`](lib/mongodbUtils.ts:69), [`lib/userUtils.ts:78`](lib/userUtils.ts:78)
- **MongoDB Version**: Takes `email: string`, returns `Promise<IUser | null>`
- **Firebase Version**: Takes `uid: string`, returns `Promise<User | null>`
- **Usage**:
  - MongoDB version: ✅ **USED** in [`app/api/users/route.ts:65`](app/api/users/route.ts:65)
  - Firebase version: ❌ **NOT USED** anywhere in the codebase

#### `createUser`
- **Location**: [`lib/mongodbUtils.ts:80`](lib/mongodbUtils.ts:80), [`lib/userUtils.ts:94`](lib/userUtils.ts:94)
- **MongoDB Version**: Takes `userData: UserFormData`, returns `Promise<IUser>`
- **Firebase Version**: Takes `uid: string, userData: Omit<User, 'createdAt' | 'updatedAt'>`, returns `Promise<void>`
- **Usage**:
  - MongoDB version: ✅ **USED** in [`app/api/users/route.ts:32`](app/api/users/route.ts:32)
  - Firebase version: ❌ **NOT USED** anywhere in the codebase

#### `updateUser`
- **Location**: [`lib/mongodbUtils.ts:102`](lib/mongodbUtils.ts:102), [`lib/userUtils.ts:111`](lib/userUtils.ts:111)
- **MongoDB Version**: Takes `email: string, updates: Partial<UserFormData>`, returns `Promise<IUser | null>`
- **Firebase Version**: Takes `email: string, updates: Partial<User>`, returns `Promise<void>`
- **Usage**:
  - MongoDB version: ✅ **USED** in [`app/api/users/route.ts:30`](app/api/users/route.ts:30)
  - Firebase version: ❌ **NOT USED** anywhere in the codebase

### 2. Database Connection Functions

#### `connectDB`
- **Location**: [`lib/mongodb.ts:12`](lib/mongodb.ts:12)
- **Description**: MongoDB connection function
- **Usage**: ✅ **USED** in all MongoDB utility functions and [`app/api/test-db/route.ts:6`](app/api/test-db/route.ts:6)

#### `getFirebaseAuth`
- **Location**: [`lib/firebaseAuth.ts:17`](lib/firebaseAuth.ts:17)
- **Description**: Firebase authentication initialization
- **Usage**: ✅ **USED** in multiple components and pages for Firebase operations

### 3. Navigation Functions

#### `route`, `goBack`, `getNavigationHistory`, etc.
- **Location**: [`lib/route.ts:56`](lib/route.ts:56)
- **Description**: Client-side navigation utilities
- **Usage**: ✅ **USED** in multiple components including [`components/ui/Header.tsx:6`](components/ui/Header.tsx:6), [`components/backpackers/CreateGroupButton.tsx:5`](components/backpackers/CreateGroupButton.tsx:5), and others

## Usage Analysis Summary

### MongoDB Functions (✅ ACTIVELY USED)
- `checkUserExists` - Used in API routes
- `getUser` - Used in API routes  
- `createUser` - Used in API routes
- `updateUser` - Used in API routes
- `connectDB` - Used throughout MongoDB utilities

### Firebase Functions (❌ UNUSED)
- `checkUserExists` - Not used anywhere
- `getUser` - Not used anywhere
- `createUser` - Not used anywhere
- `updateUser` - Not used anywhere
- `checkUserExistsByEmail` - Not used anywhere

### Client Functions (✅ ACTIVELY USED)
- `checkUserExistsByEmail` - Used in onboarding flow
- `route`, `goBack`, etc. - Used in multiple components

## Recommendations

### High Priority

1. **Remove Unused Firebase User Functions**
   - Remove unused Firebase versions of `checkUserExists`, `getUser`, `createUser`, `updateUser`, and `checkUserExistsByEmail` from [`lib/userUtils.ts`](lib/userUtils.ts)
   - These functions are not being used anywhere in the codebase
   - **Impact**: Reduces code duplication and maintenance burden

2. **Clean Up Unused MongoDB Functions**
   - Remove unused MongoDB version of `checkUserExistsByEmail` from [`lib/mongodbUtils.ts`](lib/mongodbUtils.ts)
   - This function is not being used anywhere
   - **Impact**: Reduces unnecessary code

### Medium Priority

3. **Consolidate Client-Side User Functions**
   - The client-side `checkUserExistsByEmail` in [`lib/clientUtils.ts`](lib/clientUtils.ts) is a simple wrapper around the API
   - Consider if this abstraction is necessary or if direct API calls would be cleaner
   - **Impact**: Potential simplification of client-side code

4. **Review Firebase Integration**
   - The project has Firebase setup but doesn't use Firebase user management functions
   - Consider if Firebase user management is planned for future use or if it should be completely removed
   - **Impact**: Clarifies the project's database strategy

### Low Priority

5. **Documentation**
   - Add clear documentation about which database implementation is the primary one
   - Document the purpose of each utility file
   - **Impact**: Improves code maintainability

## Files to Modify

### Remove Functions From:
- [`lib/userUtils.ts`](lib/userUtils.ts) - Remove unused Firebase user management functions
- [`lib/mongodbUtils.ts`](lib/mongodbUtils.ts) - Remove unused `checkUserExistsByEmail`

### Keep As-Is:
- [`lib/mongodbUtils.ts`](lib/mongodbUtils.ts) - Keep MongoDB user functions (actively used)
- [`lib/clientUtils.ts`](lib/clientUtils.ts) - Keep client-side functions (actively used)
- [`lib/route.ts`](lib/route.ts) - Keep navigation utilities (actively used)
- [`lib/mongodb.ts`](lib/mongodb.ts) - Keep MongoDB connection (actively used)
- [`lib/firebaseAuth.ts`](lib/firebaseAuth.ts) - Keep Firebase auth (actively used)

## Conclusion

The project has a clear preference for MongoDB as the primary database backend, with Firebase serving authentication purposes only. The unused Firebase user management functions should be removed to eliminate code duplication and reduce maintenance overhead.

The client-side utilities and navigation functions are actively used and should be preserved. The MongoDB utilities are the core of the application's data layer and are properly utilized throughout the codebase.
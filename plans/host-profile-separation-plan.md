# Host Profile Separation Plan

## Problem Statement
Currently, the `hostProfile` is being fetched directly from the group data in MongoDB (line 42: `hostProfile: group.hostProfile`). This approach couples the host profile data with the group data, making it difficult to maintain and update user information independently.

## Solution Overview
Create a helper function that fetches user details separately using the `getUser` function and constructs the host profile object. This will decouple user data from group data and allow for more flexible user management.

## Implementation Plan

### 1. Create Helper Function
Create a `createHostProfile` function in `app/api/groups/route.ts` that:
- Takes a `creatorId` as parameter
- Fetches user details using `getUser(creatorId)`
- Constructs a host profile object with the user's information
- Includes error handling with fallback values

### 2. Update GET Endpoint
Modify the GET endpoint to:
- Use `createHostProfile` function instead of directly accessing `group.hostProfile`
- Fetch user details for each group's creator
- Handle potential errors gracefully

### 3. Update POST Endpoint
Modify the POST endpoint to:
- Use `createHostProfile` function when creating new groups
- Ensure consistency between the helper function and direct host profile creation
- Maintain backward compatibility

### 4. Error Handling
- Implement proper error handling for user fetch failures
- Provide fallback host profile data when user details are unavailable
- Log errors for debugging purposes

## Code Changes Required

### Helper Function Structure
```typescript
async function createHostProfile(creatorId: string): Promise<any> {
  try {
    const user = await getUser(creatorId);
    if (!user) {
      throw new Error(`User not found for creatorId: ${creatorId}`);
    }
    
    const actualUserName = user?.name || creatorId.replace("user_", "").replace(/(^|-)?\w/g, (c) => c.toUpperCase());
    
    return {
      id: creatorId,
      name: actualUserName,
      handle: `@${actualUserName.toLowerCase().replace(/\s+/g, "")}`,
      verificationLevel: "Pending verification",
      pastTripsHosted: 0,
      testimonials: [],
      bio: "Host will update their bio soon.",
      avatarColor: "#34d399",
    };
  } catch (error) {
    console.error("Failed to create host profile:", error);
    // Return fallback host profile
    return {
      id: creatorId,
      name: creatorId.replace("user_", "").replace(/(^|-)?\w/g, (c) => c.toUpperCase()),
      handle: `@${creatorId.replace("user_", "")}`,
      verificationLevel: "Pending verification",
      pastTripsHosted: 0,
      testimonials: [],
      bio: "Host will update their bio soon.",
      avatarColor: "#34d399",
    };
  }
}
```

### GET Endpoint Changes
Replace:
```typescript
hostProfile: group.hostProfile,
```

With:
```typescript
hostProfile: await createHostProfile(group.creatorId),
```

### POST Endpoint Changes
Replace the direct host profile creation with:
```typescript
const hostProfile = await createHostProfile(creatorId);
```

## Benefits
1. **Decoupling**: User data is now separate from group data
2. **Consistency**: Single source of truth for host profile creation
3. **Maintainability**: Easier to update host profile logic in one place
4. **Error Handling**: Better error handling and fallback mechanisms
5. **Flexibility**: Can easily modify host profile structure without affecting group data

## Testing Considerations
1. Test with existing groups that have hostProfile data
2. Test with new groups created after the change
3. Test error scenarios (user not found, database errors)
4. Verify that the host profile structure remains consistent
5. Ensure backward compatibility with existing frontend code

## Migration Strategy
Since this is a read-only change for existing data, no migration is required. The helper function will:
- Use existing hostProfile data if available (for backward compatibility)
- Fetch fresh user data when needed
- Provide fallback values for any missing user information
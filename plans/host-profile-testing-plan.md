# Host Profile Separation - Testing Plan

## Test Scenarios

### 1. Existing Groups with Stored HostProfile
**Scenario**: Groups that already have hostProfile data in MongoDB
**Expected Behavior**: 
- Should use the existing hostProfile data for backward compatibility
- Should not break existing functionality
- Should maintain the same host profile structure

**Test Cases**:
- [ ] Fetch groups with existing hostProfile data
- [ ] Verify hostProfile structure matches expected format
- [ ] Ensure no errors occur during data retrieval

### 2. New Groups Created After Changes
**Scenario**: Groups created after implementing the new host profile separation
**Expected Behavior**:
- Should fetch user details using getUser function
- Should construct host profile from user data
- Should maintain consistent host profile structure

**Test Cases**:
- [ ] Create new group with valid creatorId
- [ ] Verify host profile is created from user data
- [ ] Check that user name, handle, and other fields are correctly populated

### 3. User Not Found Scenarios
**Scenario**: When getUser returns null or throws an error
**Expected Behavior**:
- Should use fallback host profile data
- Should log error for debugging
- Should not break the API response

**Test Cases**:
- [ ] Create group with non-existent creatorId
- [ ] Verify fallback host profile is used
- [ ] Check error logging functionality

### 4. Database Connection Issues
**Scenario**: MongoDB connection problems or getUser function failures
**Expected Behavior**:
- Should handle errors gracefully
- Should provide meaningful error messages
- Should not crash the application

**Test Cases**:
- [ ] Test with MongoDB connection down
- [ ] Verify error handling in getUser function
- [ ] Check that API returns appropriate error responses

### 5. Host Profile Structure Consistency
**Scenario**: Ensuring host profile structure remains consistent across all scenarios
**Expected Behavior**:
- All host profiles should have the same structure
- Required fields should always be present
- Optional fields should have appropriate defaults

**Test Cases**:
- [ ] Verify all host profiles have required fields (id, name, handle, etc.)
- [ ] Check that optional fields have default values
- [ ] Ensure structure matches frontend expectations

### 6. Performance Testing
**Scenario**: Multiple groups with host profile fetching
**Expected Behavior**:
- Should handle multiple concurrent requests
- Should not cause performance degradation
- Should efficiently fetch user data

**Test Cases**:
- [ ] Fetch multiple groups simultaneously
- [ ] Measure response times for GET requests
- [ ] Test with large number of groups

## Implementation Notes

### Error Handling Strategy
```typescript
// Example error handling pattern
try {
  const user = await getUser(creatorId);
  if (!user) {
    throw new Error(`User not found for creatorId: ${creatorId}`);
  }
  // Create host profile from user data
} catch (error) {
  console.error("Failed to create host profile:", error);
  // Return fallback host profile
  return createFallbackHostProfile(creatorId);
}
```

### Fallback Host Profile Structure
```typescript
function createFallbackHostProfile(creatorId: string) {
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
```

### Testing Commands
```bash
# Test GET endpoint
curl http://localhost:3000/api/groups

# Test POST endpoint
curl -X POST http://localhost:3000/api/groups \
  -H "Content-Type: application/json" \
  -d '{
    "groupName": "Test Group",
    "destination": "Test Destination",
    "startDate": "2024-01-01",
    "endDate": "2024-01-07",
    "creatorId": "test_user_id"
  }'
```

## Success Criteria
- [ ] All existing groups continue to work without changes
- [ ] New groups correctly fetch user details for host profile
- [ ] Error scenarios are handled gracefully with fallback data
- [ ] Host profile structure is consistent across all scenarios
- [ ] Performance remains acceptable with multiple concurrent requests
- [ ] No breaking changes to frontend API consumers
// @/lib/clientMongodbUtils.ts
export const upsertUser = async (userData: any) => {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to save user data');
    }

    return await response.json();
  } catch (error) {
    console.error("Error upserting user:", error);
    throw error;
  }
};
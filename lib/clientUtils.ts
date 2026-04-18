// @/lib/clientUtils.ts
export const checkUserExistsByEmail = async (email: string) => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/users/check?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
      throw new Error('Failed to check user');
    }
    return await response.json();
  } catch (error) {
    console.error("Error checking user exists:", error);
    return { exists: false };
  }
};
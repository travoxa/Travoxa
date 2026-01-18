// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

// OPTION 2: Using Firebase REST API (No Admin SDK needed)
// This is simpler and doesn't require service account setup


export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {

        if (!credentials?.email || !credentials?.password) {
          console.error("❌ Missing email or password");
          return null;
        }

        try {
          // Use Firebase REST API to verify credentials
          const FIREBASE_AUTH_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`;

          const response = await fetch(FIREBASE_AUTH_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              returnSecureToken: true,
            }),
          });

          const data = await response.json();

          // Check if authentication failed
          if (!response.ok) {
            console.error("❌ Firebase REST API error:", data.error?.message);

            // Log specific error types
            if (data.error?.message?.includes('INVALID_PASSWORD')) {
              console.error("❌ Invalid password");
            } else if (data.error?.message?.includes('EMAIL_NOT_FOUND')) {
              console.error("❌ Email not found");
            } else if (data.error?.message?.includes('USER_DISABLED')) {
              console.error("❌ User account disabled");
            }

            return null;
          }



          // Optionally fetch additional user data from Firestore
          // You can use your existing getUser function here if needed

          // Return user object that will be stored in JWT
          return {
            id: data.localId,
            email: data.email,
            name: data.displayName || data.email,
            // Add any other user data you need
          };

        } catch (error: any) {
          console.error("❌ Unexpected error during authentication:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.id = token.id || token.sub!;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug mode to see detailed logs
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
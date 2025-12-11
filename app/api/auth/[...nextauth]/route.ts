import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { signInWithEmailAndPassword } from "firebase/auth"
import { getFirebaseAuth } from "@/lib/firebaseAuth"

const handler = NextAuth({
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
          return null
        }

        try {
          const auth = getFirebaseAuth();
          
          // Check if auth is available
          if (!auth) {
            console.error("Firebase Auth is not available");
            return null;
          }

          // Sign in with Firebase Auth
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          )

          if (userCredential.user) {
            // Return user object that will be stored in JWT
            return {
              id: userCredential.user.uid,
              email: userCredential.user.email,
              name: userCredential.user.displayName,
            }
          }
          return null
        } catch (error) {
          console.error("Firebase auth error:", error)
          // Return null if authentication fails
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // When user signs in, add user id to token
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      // Add user id to session from token
      if (session?.user) {
        session.user.id = token.id || token.sub!
      }
      return session
    },
  },
  pages: {
    signIn: '/login', // Your custom login page path
  },
  session: {
    strategy: "jwt", // Use JWT for sessions
  },
})

export { handler as GET, handler as POST }
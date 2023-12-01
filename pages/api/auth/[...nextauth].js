import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
const options = {
  providers: [
    CredentialsProvider({
      name: 'credentials',

      async authorize(credentials) {
        const { user } = credentials;

        // Parse the user data from the JSON string
        const userData = JSON.parse(user);

        // Check if user exists and return user data with token
        if (userData) {
          return {
            name: {
              ...userData,
            },
          };
        } else {
          // Handle error case
          console.error('User data is missing or invalid');
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async session({ session }) {
      // Simplify the session object by only including the user's name
      session.user = session.user.name;
      return session;
    },

    jwt({ token, trigger, session }) {
      // Update the token with the session data
      if (trigger === 'update' && session) {
        token.name = session;
      }
      return token;
    },
  },
  secret: process.env.JWT_SIGNING_PRIVATE_KEY,
  pages: {
    signIn: '/login',
  },
};

// Define the authentication handler for NextAuth
const authHandler = (req, res) => NextAuth(req, res, options);

export default authHandler;
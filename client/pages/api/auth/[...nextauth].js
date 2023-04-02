import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: "credentials",
      async authorize(credentials) {
        const { user } = credentials;
        return JSON.parse(user);
      },
    }),
  ],
  callbacks: {
    redirect: async (url, baseUrl) => {
      return baseUrl;
    },
    async session(session, token) {
      session.user = token.user;
      return { ...session };
    },
    async jwt(token, user) {
      if (user) token.user = user;
      return token;
    },
  },
  secret: process.env.JWT_SIGNING_PRIVATE_KEY,
  jwt: {
    secret: process.env.JWT_SIGNING_PRIVATE_KEY,
    encryption: true,
  },
  pages: {
    signIn: "/pages/auth",
    // signOut: "/auth/signin",
  },
});

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
const options = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            async authorize(credentials) {
                const { user } = credentials;
                const userData = JSON.parse(user);
                // Check if user exists and return user data with token
                if (userData) {
                    return {
                        name: {
                            ...userData.user,
                            token: userData.token,
                        }

                    };
                } else {
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async session({ session }) {
            session.user = session.user.name;
            return session;
        },
    },
    session: {
        jwt: true,
    },
    jwt: {
        // eslint-disable-next-line no-undef
        secret: process.env.JWT_SIGNING_PRIVATE_KEY,
        encryption: true,
    },
    pages: {
        signIn: "/login",
    },
};

// Auth handler for NextAuth
const authHandler = (req, res) => NextAuth(req, res, options);

export default authHandler;
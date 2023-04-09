import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const options = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            async authorize(credentials) {
                const { user } = credentials;
                let data = JSON.parse(user);
                if (user) {
                    return {
                        name: {
                            ...data.user,
                            token: data.token,
                        },
                    };
                } else {
                    return null;
                }
            },
        }),
    ],
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
    secret: process.env.JWT_SIGNING_PRIVATE_KEY,
    jwt: {
        secret: process.env.JWT_SIGNING_PRIVATE_KEY,
        encryption: true,
    },
    pages: {
        signIn: "/login",
    },
};

const authHandler = (req, res) => NextAuth(req, res, options);

export default authHandler;

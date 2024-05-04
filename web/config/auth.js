import NextAuth, { getServerSession } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";

import { API } from "./api";

export const authOptions = {
    pages: {
        signIn: '/account/login',
        error: '/auth/error', // Error code passed in query string as ?error=
        verifyRequest: '/auth/verify-request', // (used for check email message)
    },
    callbacks: {
        async jwt({ token, user }) {
            return {...token,...user}
        },
        async session({ session: defaultSession, token }) {

            if (token) {
                defaultSession.user.username = token.username
                defaultSession.user.email = token.email
            }
            
            const session = {
                ...token,
                expires: defaultSession.expires,
            };

            return session
        },
    },
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: { label: "username", type: "text", placeholder: "jsmith" },
                password: { label: "password", type: "password" }
            },
            async authorize(credentials) {
                return await API.post('/login', credentials).catch((error) => { throw error })
            }
        })
    ],
    session: {
        strategy: 'jwt',
    },
}

export function auth(...args) {
    return getServerSession(...args, authOptions)
}

export const handler = NextAuth(authOptions)
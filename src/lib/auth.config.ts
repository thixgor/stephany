import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
        error: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id ?? '';
                token.role = (user as { role: string }).role;
                token.tempProtocol = (user as any).tempProtocol;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                (session.user as any).tempProtocol = token.tempProtocol as string;
            }
            return session;
        },
    },
    providers: [], // Added in auth.ts
} satisfies NextAuthConfig;

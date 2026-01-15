import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from './db';
import User from '@/models/User';
import { generateSecurePassword, generateUsername } from './utils';
import { authConfig } from './auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Senha', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                await dbConnect();

                const user = await User.findOne({ email: credentials.email }).select('+password');

                if (!user) {
                    return null;
                }

                const isPasswordValid = await user.comparePassword(credentials.password as string);

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name || user.username,
                    role: user.role,
                    tempProtocol: (user as any).tempProtocol,
                };
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    logger: {
        error(code, ...message) {
            if (code.name === 'CredentialsSignin') {
                return;
            }
            console.error(code, ...message);
        },
    },
});

// Admin seed function
export async function seedAdminUser() {
    await dbConnect();

    const adminEmail = 'stehrodrig@gmail.com';
    const adminPassword = 'Admin@123';

    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
        await User.create({
            email: adminEmail,
            password: adminPassword,
            name: 'Dra. Stephany Rodrigues',
            username: 'dra.stephany',
            role: 'admin',
            isTemporary: false,
        });

        console.log('\n🔐 ════════════════════════════════════════════════════════════');
        console.log('   CONTA ADMIN CRIADA COM SUCESSO!');
        console.log('   ────────────────────────────────────────────────────────────');
        console.log(`   📧 Email: ${adminEmail}`);
        console.log(`   🔑 Senha: ${adminPassword}`);
        console.log('   ────────────────────────────────────────────────────────────');
        console.log('════════════════════════════════════════════════════════════\n');

        return adminPassword;
    } else {
        // Force update password for the requested change
        admin.password = adminPassword;
        admin.markModified('password');
        await admin.save();
        return adminPassword;
    }
}

// Create temporary user with protocol
export async function createTemporaryUser(protocol: string, name?: string) {
    await dbConnect();

    const tempPassword = generateSecurePassword(12);
    const tempUsername = generateUsername();

    const tempUser = await User.create({
        email: `temp_${protocol.toLowerCase()}@stephanyrodriguesVET.temp`,
        password: tempPassword,
        name: name || tempUsername,
        username: tempUsername,
        role: 'temp',
        isTemporary: true,
        tempProtocol: protocol,
    });

    return {
        user: tempUser,
        password: tempPassword,
        protocol,
    };
}

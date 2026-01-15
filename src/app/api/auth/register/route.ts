import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { registerSchema } from '@/lib/validators';
import { generateUsername } from '@/lib/utils';

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();

        // Validate input
        const validationResult = registerSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: validationResult.error.issues[0].message },
                { status: 400 }
            );
        }

        const { email, password, name, username: providedUsername, phone } = validationResult.data;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: 'Este email já está cadastrado' },
                { status: 400 }
            );
        }

        // Generate username if not provided
        const username = providedUsername || generateUsername();

        // Check if username is taken
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return NextResponse.json(
                { error: 'Este nome de usuário já está em uso' },
                { status: 400 }
            );
        }

        // Create user (password will be hashed by the model pre-save hook)
        const user = await User.create({
            email,
            password,
            name,
            username,
            phone,
            role: 'client',
            isTemporary: false,
        });

        return NextResponse.json(
            {
                message: 'Conta criada com sucesso!',
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    username: user.username,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}

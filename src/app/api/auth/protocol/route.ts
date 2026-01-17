import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Appointment from '@/models/Appointment';
import User from '@/models/User';
import Patient from '@/models/Patient';
import { createTemporaryUser } from '@/lib/auth';
import { generateSecurePassword } from '@/lib/utils';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { protocol } = body;

        if (!protocol) {
            return NextResponse.json({ error: 'Protocolo é obrigatório' }, { status: 400 });
        }

        await dbConnect();

        // 1. Validate Protocol
        const appointment = await Appointment.findOne({
            protocol: protocol.toUpperCase().trim()
        }).populate('patientId');

        if (!appointment) {
            return NextResponse.json({ error: 'Protocolo não encontrado' }, { status: 404 });
        }

        const patient = appointment.patientId as any;
        const tutorName = patient?.tutorName || 'Tutor';

        // 2. Check if temp user exists
        const existingUser = await User.findOne({
            tempProtocol: protocol.toUpperCase().trim(),
            role: 'temp'
        });

        // 3. Create or update temp user
        let finalUser;
        let finalPassword;

        if (existingUser) {
            const newPassword = generateSecurePassword(12);
            existingUser.set('password', newPassword);
            if (!existingUser.name || existingUser.name.startsWith('user_')) {
                existingUser.set('name', tutorName);
            }
            await existingUser.save();
            finalUser = existingUser;
            finalPassword = newPassword;
        } else {
            const { user, password } = await createTemporaryUser(protocol.toUpperCase().trim(), tutorName);
            finalUser = user;
            finalPassword = password;
        }

        // 4. Link appointment and patient to this user ID
        // This ensures they are correctly associated even if the protocol-based query fails
        const userId = (finalUser as any)._id;

        if (!appointment.userId) {
            appointment.userId = userId;
            await appointment.save();
        }

        await Patient.findByIdAndUpdate(appointment.patientId, {
            $set: { tutorId: userId }
        });

        return NextResponse.json({
            email: (finalUser as any).email,
            password: finalPassword
        });

    } catch (error) {
        console.error('Error in protocol auth:', error);
        return NextResponse.json({ error: 'Erro interno ao processar protocolo' }, { status: 500 });
    }
}

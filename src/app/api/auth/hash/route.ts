import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import '@/models';
import Appointment from '@/models/Appointment';
import User from '@/models/User';
import Patient from '@/models/Patient';
import { createTemporaryUser } from '@/lib/auth';
import { generateSecurePassword } from '@/lib/utils';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { hash } = body;

        if (!hash) {
            return NextResponse.json({ error: 'Hash é obrigatório' }, { status: 400 });
        }

        await dbConnect();

        const appointment = await Appointment.findOne({
            hash: hash.trim()
        }).populate('patientId');

        if (!appointment) {
            return NextResponse.json({ error: 'Link de acesso não encontrado' }, { status: 404 });
        }

        const patient = appointment.patientId as { tutorName?: string };
        const tutorName = patient?.tutorName || 'Tutor';
        const protocol = (appointment as { protocol: string }).protocol;

        const existingUser = await User.findOne({
            tempProtocol: protocol,
            role: 'temp'
        });

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
            const { user, password } = await createTemporaryUser(protocol, tutorName);
            finalUser = user;
            finalPassword = password;
        }

        const userId = (finalUser as any)._id;

        if (!appointment.userId) {
            appointment.userId = userId;
            await appointment.save();
        }

        await Patient.findByIdAndUpdate(appointment.patientId, {
            $set: { tutorId: userId }
        });

        return NextResponse.json({
            email: (finalUser as { email: string }).email,
            password: finalPassword
        });

    } catch (error) {
        console.error('Error in hash auth:', error);
        return NextResponse.json({ error: 'Erro interno ao processar acesso' }, { status: 500 });
    }
}

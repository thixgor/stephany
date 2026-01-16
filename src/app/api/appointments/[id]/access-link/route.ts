import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Appointment from '@/models/Appointment';
import { generateAccessHash } from '@/lib/utils';

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    try {
        await dbConnect();

        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return NextResponse.json({ error: 'Atendimento não encontrado' }, { status: 404 });
        }

        const appointmentData = appointment as { protocol: string; hash?: string };
        let accessHash = appointmentData.hash;

        if (!accessHash) {
            accessHash = generateAccessHash(appointmentData.protocol);
            appointmentData.hash = accessHash;
            await appointment.save();
        }

        const baseUrl = request.nextUrl.origin;
        const accessLink = `${baseUrl}/acesso/${accessHash}`;

        return NextResponse.json({
            accessHash,
            accessLink,
            protocol: appointmentData.protocol
        });

    } catch (error) {
        console.error('Error generating access link:', error);
        return NextResponse.json({ error: 'Erro ao gerar link de acesso' }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Appointment from '@/models/Appointment';
import Report from '@/models/Report';
import { auth } from '@/lib/auth';

type RouteContext = {
    params: Promise<{ id: string }>;
};

// GET single appointment
export async function GET(
    request: NextRequest,
    context: RouteContext
) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        await dbConnect();

        const { id } = await context.params;
        const appointment = await Appointment.findById(id)
            .populate('patientId')
            .populate('services')
            .lean();

        if (!appointment) {
            return NextResponse.json({ error: 'Atendimento não encontrado' }, { status: 404 });
        }

        return NextResponse.json({ appointment });
    } catch (error) {
        console.error('Error fetching appointment:', error);
        return NextResponse.json({ error: 'Erro ao buscar atendimento' }, { status: 500 });
    }
}

// PUT update appointment
export async function PUT(
    request: NextRequest,
    context: RouteContext
) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        await dbConnect();

        const { id } = await context.params;
        const body = await request.json();

        const appointment = await Appointment.findByIdAndUpdate(
            id,
            body,
            { new: true }
        ).populate(['patientId', 'services']);

        if (!appointment) {
            return NextResponse.json({ error: 'Atendimento não encontrado' }, { status: 404 });
        }

        return NextResponse.json({ appointment });
    } catch (error) {
        console.error('Error updating appointment:', error);
        return NextResponse.json({ error: 'Erro ao atualizar atendimento' }, { status: 500 });
    }
}

// DELETE appointment
export async function DELETE(
    request: NextRequest,
    context: RouteContext
) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        await dbConnect();

        const { id } = await context.params;

        // 1. Delete associated reports
        await Report.deleteMany({ appointmentId: id });

        // 2. Delete the appointment
        const appointment = await Appointment.findByIdAndDelete(id);

        if (!appointment) {
            return NextResponse.json({ error: 'Atendimento não encontrado' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Atendimento e laudos associados excluídos com sucesso' });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        return NextResponse.json({ error: 'Erro ao excluir atendimento' }, { status: 500 });
    }
}

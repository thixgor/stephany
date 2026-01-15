import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Patient from '@/models/Patient';
import Appointment from '@/models/Appointment';
import Report from '@/models/Report';
import { auth } from '@/lib/auth';
import { patientSchema } from '@/lib/validators';

// GET Single Patient
export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        await dbConnect();
        const patient = await Patient.findById(params.id);

        if (!patient) {
            return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 });
        }

        return NextResponse.json({ patient });
    } catch (error) {
        console.error('Error fetching patient:', error);
        return NextResponse.json({ error: 'Erro ao buscar paciente' }, { status: 500 });
    }
}

// PUT Update Patient
export async function PUT(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const session = await auth();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();

        // Validate partial update? For now full validation
        // Zod schema might be strict, so maybe recreate partial schema or use safeParse with care
        // Using same schema for now
        const validationResult = patientSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: validationResult.error.issues[0].message },
                { status: 400 }
            );
        }

        const patient = await Patient.findByIdAndUpdate(params.id, validationResult.data, { new: true });

        if (!patient) {
            return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 });
        }

        return NextResponse.json({ patient });
    } catch (error) {
        console.error('Error updating patient:', error);
        return NextResponse.json({ error: 'Erro ao atualizar paciente' }, { status: 500 });
    }
}

// DELETE Patient
export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const session = await auth();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        console.log(`[DELETE-PATIENT] ID received: ${params.id}`);

        await dbConnect();

        // Check for related data before deleting?
        // Ideally yes, but for MVP soft delete or cascade. 
        // Let's check appointments count.
        const appointmentsCount = await Appointment.countDocuments({ patientId: params.id });
        if (appointmentsCount > 0) {
            return NextResponse.json({
                error: `Não é possível excluir: Este paciente possui ${appointmentsCount} atendimentos registrados.`
            }, { status: 400 });
        }

        const deleted = await Patient.findByIdAndDelete(params.id);

        if (!deleted) {
            console.log(`[DELETE-PATIENT] Not found for ID: ${params.id}`);
            return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 });
        }

        console.log(`[DELETE-PATIENT] Success: ${params.id}`);
        return NextResponse.json({ message: 'Paciente removido com sucesso' });
    } catch (error) {
        console.error('Error deleting patient:', error);
        return NextResponse.json({ error: 'Erro ao remover paciente' }, { status: 500 });
    }
}

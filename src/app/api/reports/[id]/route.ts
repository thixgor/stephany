import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Report from '@/models/Report';
import Patient from '@/models/Patient';
import Appointment from '@/models/Appointment';
import { auth } from '@/lib/auth';
import { reportSchema } from '@/lib/validators';
import { generateReportHash } from '@/lib/utils';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        await dbConnect();
        const { id } = await context.params;

        const report = await Report.findById(id).populate('patientId').populate('appointmentId');
        if (!report) {
            return NextResponse.json({ error: 'Relatório não encontrado' }, { status: 404 });
        }

        return NextResponse.json({ report });
    } catch (error) {
        console.error('Error fetching report:', error);
        return NextResponse.json({ error: 'Erro ao buscar relatório' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        await dbConnect();
        const { id } = await context.params;
        const body = await request.json();

        // Validate
        const validationResult = reportSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: validationResult.error.issues[0].message },
                { status: 400 }
            );
        }

        const report = await Report.findById(id);
        if (!report) {
            return NextResponse.json({ error: 'Relatório não encontrado' }, { status: 404 });
        }

        // If transitioning from draft to published, or if published and content changed, regenerate hash
        let reportHash = report.reportHash;
        if (body.status === 'published') {
            reportHash = generateReportHash({
                appointmentId: body.appointmentId,
                patientId: body.patientId,
                type: body.type,
                title: body.title,
                content: body.content,
                prescription: body.prescription,
                physicalExam: body.physicalExam,
                examDetails: body.examDetails,
                atestadoDetails: body.atestadoDetails,
                timestamp: Date.now()
            });
        }

        const updatedReport = await Report.findByIdAndUpdate(
            id,
            {
                ...validationResult.data,
                reportHash,
            },
            { new: true }
        ).populate(['patientId', 'appointmentId']);

        return NextResponse.json({ report: updatedReport });
    } catch (error) {
        console.error('Error updating report:', error);
        return NextResponse.json({ error: 'Erro ao atualizar relatório' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        await dbConnect();
        const { id } = await context.params;

        const deleted = await Report.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ error: 'Relatório não encontrado' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Relatório excluído com sucesso' });
    } catch (error) {
        console.error('Error deleting report:', error);
        return NextResponse.json({ error: 'Erro ao excluir relatório' }, { status: 500 });
    }
}

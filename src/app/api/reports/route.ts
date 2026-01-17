import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import '@/models';
import Report from '@/models/Report';
import Patient from '@/models/Patient';
import Appointment from '@/models/Appointment';
import { auth } from '@/lib/auth';
import { reportSchema } from '@/lib/validators';
import { generateProtocol, generateReportHash } from '@/lib/utils';

// GET all reports
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const patientId = searchParams.get('patientId');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;

        const query: Record<string, unknown> = {};

        // If client, only show their reports
        if (session.user.role === 'client') {
            query.userId = session.user.id;
        } else if (session.user.role === 'temp') {
            const tempAppt = await Appointment.findOne({ protocol: (session.user as any).tempProtocol });
            if (!tempAppt) {
                return NextResponse.json({ reports: [], pagination: { page, limit, total: 0, pages: 0 } });
            }
            query.appointmentId = tempAppt._id;
        }

        if (type) query.type = type;
        if (patientId) query.patientId = patientId;

        const [reports, total] = await Promise.all([
            Report.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('patientId')
                .populate('appointmentId')
                .lean(),
            Report.countDocuments(query),
        ]);

        return NextResponse.json({
            reports,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching reports:', error);
        return NextResponse.json({ error: 'Erro ao buscar relatórios' }, { status: 500 });
    }
}

// POST create new report
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        await dbConnect();

        const body = await request.json();

        const validationResult = reportSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: validationResult.error.issues[0].message },
                { status: 400 }
            );
        }

        // Generate hash only if published
        let reportHash = undefined;
        if (body.status === 'published') {
            const hashPayload = {
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
            };
            reportHash = generateReportHash(hashPayload);
        }

        const report = await Report.create({
            ...validationResult.data,
            reportHash,
            accessToken: generateProtocol(),
        });

        await report.populate(['patientId', 'appointmentId']);

        return NextResponse.json({ report }, { status: 201 });
    } catch (error) {
        console.error('Error creating report:', error);
        return NextResponse.json({ error: 'Erro ao criar relatório' }, { status: 500 });
    }
}

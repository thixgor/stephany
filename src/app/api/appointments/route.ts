import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Appointment from '@/models/Appointment';
import Patient from '@/models/Patient';
import Service from '@/models/Service';
import { auth } from '@/lib/auth';
import { appointmentSchema } from '@/lib/validators';
import { generateProtocol } from '@/lib/utils';

// GET all appointments
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const skip = (page - 1) * limit;

        // Build query
        const query: Record<string, unknown> = {};

        // If client, only show their appointments
        if (session.user.role === 'client') {
            query.userId = session.user.id;
        } else if (session.user.role === 'temp') {
            query.protocol = (session.user as any).tempProtocol;
        }

        if (status) {
            query.status = status;
        }

        if (startDate || endDate) {
            query.scheduledDate = {};
            if (startDate) {
                (query.scheduledDate as Record<string, Date>).$gte = new Date(startDate);
            }
            if (endDate) {
                (query.scheduledDate as Record<string, Date>).$lte = new Date(endDate);
            }
        }

        const [appointments, total] = await Promise.all([
            Appointment.find(query)
                .sort({ scheduledDate: -1 })
                .skip(skip)
                .limit(limit)
                .populate('patientId')
                .populate('services')
                .lean(),
            Appointment.countDocuments(query),
        ]);

        const response = NextResponse.json({
            appointments,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });

        // Add cache headers to reduce request flooding
        response.headers.set('Cache-Control', 'private, max-age=30, stale-while-revalidate=60');
        
        return response;
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return NextResponse.json({ error: 'Erro ao buscar atendimentos' }, { status: 500 });
    }
}

// POST create new appointment
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        await dbConnect();

        const body = await request.json();

        // Validate input
        const validationResult = appointmentSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: validationResult.error.issues[0].message },
                { status: 400 }
            );
        }

        const { services: serviceIds, ...appointmentData } = validationResult.data;

        // Calculate total value from services
        const services = await Service.find({ _id: { $in: serviceIds } });
        const totalValue = services.reduce((sum, service) => sum + service.price, 0);

        // Generate unique protocol
        const protocol = generateProtocol();

        const appointment = await Appointment.create({
            ...appointmentData,
            services: serviceIds,
            totalValue,
            protocol,
            status: 'agendado',
            paymentStatus: 'pendente',
        });

        // Populate and return
        await appointment.populate(['patientId', 'services']);

        return NextResponse.json({ appointment }, { status: 201 });
    } catch (error) {
        console.error('Error creating appointment:', error);
        return NextResponse.json({ error: 'Erro ao criar atendimento' }, { status: 500 });
    }
}

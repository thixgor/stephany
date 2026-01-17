import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import '@/models';
import Patient from '@/models/Patient';
import Appointment from '@/models/Appointment';
import { auth } from '@/lib/auth';
import { patientSchema } from '@/lib/validators';

// GET all patients or search
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const species = searchParams.get('species');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;

        // Build query
        const query: Record<string, unknown> = {};

        if (session.user.role === 'client') {
            query.tutorId = session.user.id;
        } else if (session.user.role === 'temp') {
            const tempAppt = await Appointment.findOne({ protocol: (session.user as any).tempProtocol });
            if (!tempAppt) {
                return NextResponse.json({ patients: [], pagination: { page, limit, total: 0, pages: 0 } });
            }
            query._id = tempAppt.patientId;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { tutorName: { $regex: search, $options: 'i' } },
                { tutorCpf: { $regex: search, $options: 'i' } },
                { tutorPhone: { $regex: search, $options: 'i' } },
            ];
        }

        if (species) {
            query.species = species;
        }

        const [patients, total] = await Promise.all([
            Patient.find(query)
                .sort({ name: 1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Patient.countDocuments(query),
        ]);

        const response = NextResponse.json({
            patients,
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
        console.error('Error fetching patients:', error);
        return NextResponse.json({ error: 'Erro ao buscar pacientes' }, { status: 500 });
    }
}

// POST create new patient
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        await dbConnect();

        const body = await request.json();

        // Validate input
        const validationResult = patientSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: validationResult.error.issues[0].message },
                { status: 400 }
            );
        }

        const patient = await Patient.create(validationResult.data);

        return NextResponse.json({ patient }, { status: 201 });
    } catch (error) {
        console.error('Error creating patient:', error);
        return NextResponse.json({ error: 'Erro ao criar paciente' }, { status: 500 });
    }
}

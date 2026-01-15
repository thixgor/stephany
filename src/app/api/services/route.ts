import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Service from '@/models/Service';
import { auth } from '@/lib/auth';
import { serviceSchema } from '@/lib/validators';

// GET all services
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const activeOnly = searchParams.get('active') !== 'false';

        const query: Record<string, unknown> = {};
        if (activeOnly) query.isActive = true;
        if (category) query.category = category;

        const services = await Service.find(query).sort({ category: 1, name: 1 }).lean();

        const response = NextResponse.json({ services });
        
        // Add cache headers - services don't change frequently
        response.headers.set('Cache-Control', 'private, max-age=300, stale-while-revalidate=600');
        
        return response;
    } catch (error) {
        console.error('Error fetching services:', error);
        return NextResponse.json({ error: 'Erro ao buscar serviços' }, { status: 500 });
    }
}

// POST create new service
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        await dbConnect();

        const body = await request.json();

        const validationResult = serviceSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: validationResult.error.issues[0].message },
                { status: 400 }
            );
        }

        const service = await Service.create(validationResult.data);

        return NextResponse.json({ service }, { status: 201 });
    } catch (error) {
        console.error('Error creating service:', error);
        return NextResponse.json({ error: 'Erro ao criar serviço' }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Service from '@/models/Service';
import { auth } from '@/lib/auth';
import { serviceSchema } from '@/lib/validators';

type RouteContext = {
    params: Promise<{ id: string }>;
};

// PUT update service
export async function PUT(request: NextRequest, context: RouteContext) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const { id } = await context.params;
        await dbConnect();

        const body = await request.json();
        const validationResult = serviceSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: validationResult.error.issues[0].message },
                { status: 400 }
            );
        }

        const service = await Service.findByIdAndUpdate(id, validationResult.data, {
            new: true,
            runValidators: true,
        });

        if (!service) {
            return NextResponse.json({ error: 'Serviço não encontrado' }, { status: 404 });
        }

        return NextResponse.json({ service });
    } catch (error) {
        console.error('Error updating service:', error);
        return NextResponse.json({ error: 'Erro ao atualizar serviço' }, { status: 500 });
    }
}

// DELETE delete service (or deactivate)
export async function DELETE(request: NextRequest, context: RouteContext) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const { id } = await context.params;
        await dbConnect();

        // Check if service is used in appointments? For now, just delete or soft delete.
        // Let's implement active toggle instead of hard delete usually, but user asked for CRUD.
        // Hard delete for now.

        const service = await Service.findByIdAndDelete(id);

        if (!service) {
            return NextResponse.json({ error: 'Serviço não encontrado' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Serviço removido' });
    } catch (error) {
        console.error('Error deleting service:', error);
        return NextResponse.json({ error: 'Erro ao remover serviço' }, { status: 500 });
    }
}

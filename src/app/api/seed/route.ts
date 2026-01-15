import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { seedAdminUser } from '@/lib/auth';
import Service from '@/models/Service';
import { DEFAULT_SERVICES } from '@/types';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        // Seed admin user
        const adminPassword = await seedAdminUser();

        // Seed default services if none exist
        const existingServices = await Service.countDocuments();
        if (existingServices === 0) {
            await Service.insertMany(
                DEFAULT_SERVICES.map((service) => ({
                    ...service,
                    isActive: true,
                }))
            );
            console.log('✅ Serviços padrão criados com sucesso!');
        }

        return NextResponse.json({
            message: 'Seed completed',
            adminCreated: !!adminPassword,
        });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json(
            { error: 'Erro ao executar seed' },
            { status: 500 }
        );
    }
}

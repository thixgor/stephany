import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Appointment from '@/models/Appointment';
import Report from '@/models/Report';
import Patient from '@/models/Patient';
import Service from '@/models/Service';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ hash: string }> }
) {
    let { hash } = await context.params;

    // Clean hash (remove any trailing/leading slashes or spaces just in case)
    hash = hash.trim().replace(/\//g, '');

    console.log(`[VERIFY] Checking clean hash: ${hash}`);

    try {
        await dbConnect();

        // Ensure all models are registered for population
        const _models = { Patient, Appointment, Report, Service };

        // 1. Try finding in Reports (Case-insensitive just in case)
        let data: any = await Report.findOne({
            reportHash: { $regex: new RegExp(`^${hash}$`, 'i') }
        })
            .populate('patientId')
            .lean();

        let type = 'report';

        // 2. Try finding in Appointments if not found in Reports
        if (!data) {
            console.log(`[VERIFY] Not found in Reports, checking Appointments...`);
            data = await Appointment.findOne({
                hash: { $regex: new RegExp(`^${hash}$`, 'i') }
            })
                .populate('patientId')
                .populate('services')
                .lean();
            type = 'appointment';
        }

        if (!data) {
            console.warn(`[VERIFY] Hash not found in any collection: ${hash}`);
            return NextResponse.json({ error: 'Documento não encontrado' }, { status: 404 });
        }

        console.log(`[VERIFY] Success! Found ${type} for hash ${hash}`);
        return NextResponse.json({ report: data, type });
    } catch (error) {
        console.error('[VERIFY] Error verifying document:', error);
        return NextResponse.json({ error: 'Erro ao verificar documento' }, { status: 500 });
    }
}

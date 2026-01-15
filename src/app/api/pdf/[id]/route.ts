
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Appointment from '@/models/Appointment';
import Report from '@/models/Report';
import Patient from '@/models/Patient';
import User from '@/models/User';
import Service from '@/models/Service';
import { generateReportHash } from '@/lib/utils';
import { renderToStream } from '@react-pdf/renderer';
import React from 'react';
import PdfDocument from '@/components/PdfDocument';
import QRCode from 'qrcode';
import CryptoJS from 'crypto-js';

// Register Models
const _ = { Patient, User, Service };

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        await dbConnect();
        const { id } = params;
        const { searchParams } = new URL(request.url);
        const isBlank = searchParams.get('blank') === 'true';

        let data = null;
        let type: 'appointment' | 'report' = 'report';

        // 1. Validar ID
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return new NextResponse('Invalid ID', { status: 400 });
        }

        // 2. Buscar
        let report = await Report.findById(id).populate('patientId');
        if (report) {
            data = report;
            type = 'report';

            // Gerar hash para laudo se for publicado e não tiver hash
            if (report.status === 'published' && !report.reportHash) {
                const hashPayload = {
                    appointmentId: report.appointmentId,
                    patientId: typeof report.patientId === 'object' ? (report.patientId as any)._id : report.patientId,
                    type: report.type,
                    title: report.title,
                    content: report.content,
                    prescription: report.prescription,
                    physicalExam: report.physicalExam,
                    examDetails: report.examDetails,
                    atestadoDetails: report.atestadoDetails,
                    timestamp: report.createdAt.getTime()
                };
                const hash = generateReportHash(hashPayload);
                await Report.findByIdAndUpdate(id, { reportHash: hash });
                report.reportHash = hash;
            }
        } else {
            const appt = await Appointment.findById(id).populate('patientId').populate('services');
            if (appt) {
                data = appt;
                type = 'appointment';

                // Gerar hash para atendimento se não existir
                if (!appt.hash) {
                    const dataToHash = JSON.stringify({
                        protocol: appt.protocol,
                        patientId: typeof appt.patientId === 'object' ? (appt.patientId as any)._id : appt.patientId,
                        scheduledDate: appt.scheduledDate,
                    });
                    const hash = CryptoJS.SHA256(dataToHash).toString();
                    await Appointment.findByIdAndUpdate(id, { hash });
                    appt.hash = hash;
                }
            }
        }

        if (!data) {
            return new NextResponse('Document not found', { status: 404 });
        }

        // 3. Generate QR Code for verification
        let qrCodeData = '';
        const hashToUse = report?.reportHash || (data as any).hash;

        if (hashToUse) {
            const baseUrl = process.env.NEXTAUTH_URL || 'https://stephanyrodrigues.vet.br';
            const verifyUrl = `${baseUrl}/verifica/${hashToUse}`;
            qrCodeData = await QRCode.toDataURL(verifyUrl);
        }

        // 4. Renderizar
        const docType = isBlank ? 'blank_form' : type;
        const stream = await renderToStream(PdfDocument({ data, type: docType, qrCode: qrCodeData }));

        const download = searchParams.get('download') === 'true';

        return new NextResponse(stream as unknown as BodyInit, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="${isBlank ? 'ficha-clinica' : type}-${id}.pdf"`,
            },
        });

    } catch (error) {
        console.error('Error generating PDF:', error);
        return new NextResponse('Error generating PDF', { status: 500 });
    }
}

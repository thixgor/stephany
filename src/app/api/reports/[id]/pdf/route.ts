import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import '@/models';
import Report from '@/models/Report';
import Patient from '@/models/Patient';
import Appointment from '@/models/Appointment';
import { auth } from '@/lib/auth';
import { jsPDF } from 'jspdf';
import { stripHtml } from 'string-strip-html';
import { getClinicalConstants, isOutOfRange } from '@/lib/clinicalConstants';

type RouteParams = {
    params: {
        id: string;
    };
};

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await props.params;
        const { searchParams } = new URL(request.url);
        const download = searchParams.get('download') === 'true';

        const session = await auth();
        // Allow access if admin, or if it's the client's report, or if a temporary protocol user
        if (!session) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        await dbConnect();

        const report = await Report.findById(id)
            .populate('patientId')
            .populate('appointmentId');

        if (!report) {
            return NextResponse.json({ error: 'Relatório não encontrado' }, { status: 404 });
        }

        // TODO: Add ownership check logic here if needed beyond simple session check

        // Generate PDF
        const doc = new jsPDF();
        const margin = 20;
        let y = 20;

        // Header
        doc.setFontSize(20);
        doc.setTextColor(6, 105, 92); // #06695C
        doc.text('Dra. Stephany Rodrigues', margin, y);
        y += 10;
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('Médica Veterinária CRMV-RJ: 22404', margin, y);
        y += 15;

        // Title
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(report.title.toUpperCase(), margin, y);
        y += 10;
        doc.setLineWidth(0.5);
        doc.line(margin, y, 190, y);
        y += 10;

        // Patient/Tutor Info
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const patient = report.patientId as any;
        doc.text(`Paciente: ${patient?.name || 'N/A'}`, margin, y);
        doc.text(`Espécie: ${patient?.species || 'N/A'}`, 100, y);
        y += 6;
        doc.text(`Idade: ${patient?.age || 'N/A'}`, margin, y);
        doc.text(`Tutor: ${patient?.tutorName || 'N/A'}`, 100, y);
        y += 12;

        // Clinical Exam
        if (report.physicalExam) {
            const species = patient?.species || '';
            const clinicalConstants = getClinicalConstants(species);

            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(6, 105, 92);
            doc.text('EXAME CLÍNICO:', margin, y);
            y += 8;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);

            const exam = report.physicalExam;
            const items = [
                { label: 'Temp:', value: exam.temp, unit: '°C', range: clinicalConstants.temp },
                { label: 'FC:', value: exam.fc, unit: 'bpm', range: clinicalConstants.fc },
                { label: 'FR:', value: exam.fr, unit: 'mpm', range: clinicalConstants.fr },
                { label: 'Mucosas:', value: exam.mucosas },
                { label: 'TPC:', value: exam.tpc },
                { label: 'Linfonodos:', value: exam.linfonodos },
            ];

            const col1 = margin;
            const col2 = margin + 60;
            const col3 = margin + 120;

            let currentItem = 0;
            for (let row = 0; row < 2; row++) {
                for (let col = 0; col < 3; col++) {
                    const item = items[currentItem++];
                    if (!item) break;

                    const x = col === 0 ? col1 : (col === 1 ? col2 : col3);
                    doc.setFont('helvetica', 'bold');
                    doc.text(item.label, x, y);

                    const valX = x + (doc.getTextWidth(item.label) + 2);
                    const isAlert = item.range && item.value && isOutOfRange(item.value, item.range);

                    if (isAlert) {
                        doc.setTextColor(200, 0, 0);
                        doc.setFont('helvetica', 'bold');
                    } else {
                        doc.setTextColor(0, 0, 0);
                        doc.setFont('helvetica', 'normal');
                    }

                    doc.text(`${item.value || '-'} ${item.unit || ''}`, valX, y);

                    if (item.range && species) {
                        doc.setFontSize(7);
                        doc.setTextColor(120, 120, 120);
                        doc.setFont('helvetica', 'italic');
                        doc.text(` (VR: ${item.range.label})`, valX + doc.getTextWidth(`${item.value || '-'} ${item.unit || ''}`) + 1, y);
                        doc.setFontSize(10);
                    }

                    doc.setTextColor(0, 0, 0);
                    doc.setFont('helvetica', 'normal');
                }
                y += 6;
            }

            // Systems if they exist
            if (exam.systems) {
                doc.setFont('helvetica', 'bold');
                doc.text('Aparelhos/Sistemas:', margin, y + 2);
                y += 8;
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(9);
                const systems = [];
                if (exam.systems.cardiovascular) systems.push(`Cardio: ${exam.systems.cardiovascular}`);
                if (exam.systems.respiratorio) systems.push(`Resp: ${exam.systems.respiratorio}`);
                if (exam.systems.digestorio) systems.push(`Dig: ${exam.systems.digestorio}`);
                if (exam.systems.neurologico) systems.push(`Neuro: ${exam.systems.neurologico}`);
                if (exam.systems.tegumentar) systems.push(`Tegum: ${exam.systems.tegumentar}`);
                if (exam.systems.locomotor) systems.push(`Locom: ${exam.systems.locomotor}`);

                const sysText = systems.join(' | ');
                const splitSys = doc.splitTextToSize(sysText, 170);
                doc.text(splitSys, margin, y);
                y += (splitSys.length * 5) + 5;
            }

            y += 5;
            doc.setFontSize(11);
        }

        // Report Content
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Descrição / Conteúdo:', margin, y);
        y += 8;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const cleanContent = stripHtml(report.content).result;
        const splitContent = doc.splitTextToSize(cleanContent, 170);
        doc.text(splitContent, margin, y);
        y += (splitContent.length * 6) + 10;

        // Diagnosis if exists
        if (report.diagnosis) {
            doc.setFont('helvetica', 'bold');
            doc.text('Diagnóstico:', margin, y);
            y += 7;
            doc.setFont('helvetica', 'normal');
            const splitDiag = doc.splitTextToSize(report.diagnosis, 170);
            doc.text(splitDiag, margin, y);
            y += (splitDiag.length * 6) + 10;
        }

        // Prescription if exists
        if (report.prescription) {
            doc.setFont('helvetica', 'bold');
            doc.text('Prescrição:', margin, y);
            y += 7;
            doc.setFont('helvetica', 'normal');

            let prescStr = '';
            if (Array.isArray(report.prescription)) {
                prescStr = report.prescription.map((p: any) =>
                    `${p.medication} - ${p.dosage} (${p.frequency}) - ${p.duration}${p.notes ? `\nObs: ${p.notes}` : ''}`
                ).join('\n\n');
            } else {
                prescStr = String(report.prescription);
            }

            const splitPresc = doc.splitTextToSize(prescStr, 170);
            doc.text(splitPresc, margin, y);
            y += (splitPresc.length * 6) + 10;
        }

        // Footer / Signature Area
        y = 260;
        doc.setLineWidth(0.2);
        doc.line(70, y, 140, y);
        y += 5;
        doc.setFontSize(9);
        doc.text('Dra. Stephany Rodrigues', 105, y, { align: 'center' });
        y += 4;
        doc.text('Médica Veterinária', 105, y, { align: 'center' });

        const pdfOutput = doc.output('arraybuffer');

        const headers = new Headers();
        headers.set('Content-Type', 'application/pdf');
        if (download) {
            headers.set('Content-Disposition', `attachment; filename="relatorio-${report.accessToken}.pdf"`);
        } else {
            headers.set('Content-Disposition', 'inline');
        }

        return new Response(pdfOutput, {
            status: 200,
            headers,
        });

    } catch (error) {
        console.error('Error generating PDF:', error);
        return NextResponse.json({ error: 'Erro ao gerar PDF' }, { status: 500 });
    }
}

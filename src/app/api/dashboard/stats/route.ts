import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Appointment from '@/models/Appointment';
import Patient from '@/models/Patient';
import Report from '@/models/Report';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        await dbConnect();

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // Parallel queries
        const [
            totalPatients,
            appointmentsToday,
            appointmentsPending,
            monthlyRevenue,
            recentAppointments
        ] = await Promise.all([
            Patient.countDocuments(),

            Appointment.countDocuments({
                scheduledDate: { $gte: today, $lt: tomorrow }
            }),

            Appointment.countDocuments({
                status: 'agendado'
            }),

            Appointment.aggregate([
                {
                    $match: {
                        scheduledDate: { $gte: firstDayOfMonth },
                        status: 'concluido', // ou pago
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$totalValue' }
                    }
                }
            ]),

            Appointment.find({ scheduledDate: { $gte: today } })
                .sort({ scheduledDate: 1 })
                .limit(5)
                .populate('patientId', 'name species tutorName')
                .lean()
        ]);

        return NextResponse.json({
            stats: {
                totalPatients,
                todayAppointments: appointmentsToday,
                pendingAppointments: appointmentsPending,
                monthlyRevenue: monthlyRevenue[0]?.total || 0,
            },
            recentAppointments
        });
    } catch (error) {
        console.error('Stats error:', error);
        return NextResponse.json({ error: 'Erro ao buscar estatísticas' }, { status: 500 });
    }
}

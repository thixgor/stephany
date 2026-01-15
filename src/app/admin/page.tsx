'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { FiCalendar, FiUsers, FiFileText, FiDollarSign, FiCalendar as FiAgenda } from 'react-icons/fi';
import { FaPaw } from 'react-icons/fa';
import { StatCard } from '@/components/ui/Card';
import Card from '@/components/ui/Card';
import { PawSkeleton } from '@/components/ui/PawLoader';
import Link from 'next/link';

interface DashboardStats {
    totalPatients: number;
    todayAppointments: number;
    pendingAppointments: number;
    monthlyRevenue: number;
}

interface Appointment {
    _id: string;
    scheduledDate: string;
    patientId: { name: string; species: string; tutorName: string };
    status: string;
}

export default function AdminDashboard() {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats>({
        totalPatients: 0,
        todayAppointments: 0,
        pendingAppointments: 0,
        monthlyRevenue: 0,
    });
    const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/dashboard/stats');
                const data = await res.json();
                if (data.stats) {
                    setStats(data.stats);
                    setRecentAppointments(data.recentAppointments || []);
                }
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    const todayDate = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-[#00231F]">
                    Olá, {session?.user?.name?.split(' ')[0] || 'Doutora'}! 👋
                </h1>
                <p className="text-gray-600 mt-1 capitalize">{todayDate}</p>
            </div>

            {/* Stats Grid */}
            <PawSkeleton isLoading={isLoading}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={<FiCalendar />}
                        value={stats.todayAppointments}
                        label="Agendados hoje"
                        variant="primary"
                    />
                    <StatCard
                        icon={<FaPaw />}
                        value={stats.totalPatients}
                        label="Total de pacientes"
                        variant="info"
                    />
                    <StatCard
                        icon={<FiAgenda />}
                        value={stats.pendingAppointments}
                        label="Pendentes"
                        variant="warning"
                    />
                    <StatCard
                        icon={<FiDollarSign />}
                        value={`R$ ${stats.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                        label="Receita do mês"
                        variant="success"
                    />
                </div>
            </PawSkeleton>

            {/* Quick Actions & Recent Appointments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Recent Appointments */}
                <Card hover={false}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-[#00231F]">Próximos Agendamentos</h2>
                        <Link href="/admin/atendimentos" className="text-[#06695C] text-sm font-medium hover:underline">
                            Ver todos
                        </Link>
                    </div>

                    <PawSkeleton isLoading={isLoading}>
                        <div className="space-y-4">
                            {recentAppointments.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">Nenhum agendamento futuro.</p>
                            ) : (
                                recentAppointments.map((appointment) => {
                                    const date = new Date(appointment.scheduledDate);
                                    return (
                                        <div
                                            key={appointment._id}
                                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="text-center w-14">
                                                <span className="text-sm font-bold text-[#06695C]">{date.getDate()}/{date.getMonth() + 1}</span>
                                                <span className="block text-xs text-gray-500">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-[#00231F]">
                                                    {appointment.patientId?.name} <span className="font-normal text-gray-500">({appointment.patientId?.species})</span>
                                                </p>
                                                <p className="text-sm text-gray-600">{appointment.patientId?.tutorName}</p>
                                            </div>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${appointment.status === 'agendado' ? 'bg-blue-100 text-blue-700' :
                                                        appointment.status === 'confirmado' ? 'bg-green-100 text-green-700' :
                                                            'bg-gray-100 text-gray-700'
                                                    }`}
                                            >
                                                {appointment.status}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </PawSkeleton>
                </Card>

                {/* Quick Actions */}
                <Card hover={false}>
                    <h2 className="text-lg font-bold text-[#00231F] mb-6">Ações Rápidas</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Link
                            href="/admin/atendimentos/novo"
                            className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-[#06695C] to-[#0A8B7A] rounded-xl text-white hover:shadow-lg transition-all"
                        >
                            <FiCalendar size={28} />
                            <span className="font-semibold text-center">Novo Atendimento</span>
                        </Link>
                        <Link
                            href="/admin/pacientes/novo"
                            className="flex flex-col items-center gap-3 p-6 bg-white border-2 border-[#06695C] rounded-xl text-[#06695C] hover:bg-[#06695C] hover:text-white transition-all"
                        >
                            <FaPaw size={28} />
                            <span className="font-semibold text-center">Novo Paciente</span>
                        </Link>
                        <Link
                            href="/admin/laudos/novo"
                            className="flex flex-col items-center gap-3 p-6 bg-white border-2 border-[#06695C] rounded-xl text-[#06695C] hover:bg-[#06695C] hover:text-white transition-all"
                        >
                            <FiFileText size={28} />
                            <span className="font-semibold text-center">Novo Laudo</span>
                        </Link>
                        <Link
                            href="/admin/pacientes"
                            className="flex flex-col items-center gap-3 p-6 bg-white border-2 border-[#06695C] rounded-xl text-[#06695C] hover:bg-[#06695C] hover:text-white transition-all"
                        >
                            <FiUsers size={28} />
                            <span className="font-semibold text-center">Buscar Paciente</span>
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
}

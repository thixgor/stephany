'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FiCalendar, FiFileText, FiClock } from 'react-icons/fi';
import { FaPaw } from 'react-icons/fa';
import Card, { StatCard } from '@/components/ui/Card';
import { PawSkeleton } from '@/components/ui/PawLoader';

export default function ClienteDashboard() {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        pets: 0,
        appointments: 0,
        reports: 0,
        nextAppointment: 0
    });
    const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
    const [recentReports, setRecentReports] = useState<any[]>([]);
    const [myPets, setMyPets] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resPets, resAppts, resReports] = await Promise.all([
                    fetch('/api/patients'),
                    fetch('/api/appointments?limit=5'),
                    fetch('/api/reports?limit=5')
                ]);

                const dataPets = await resPets.json();
                const dataAppts = await resAppts.json();
                const dataReports = await resReports.json();

                if (dataPets.patients) setMyPets(dataPets.patients);
                if (dataAppts.appointments) setRecentAppointments(dataAppts.appointments);
                if (dataReports.reports) setRecentReports(dataReports.reports);

                setStats({
                    pets: dataPets.pagination?.total || 0,
                    appointments: dataAppts.pagination?.total || 0,
                    reports: dataReports.pagination?.total || 0,
                    nextAppointment: dataAppts.appointments?.filter((a: any) => new Date(a.scheduledDate) > new Date()).length || 0
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (session) {
            fetchData();
        }
    }, [session]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#06695C] to-[#0A8B7A] rounded-2xl p-6 lg:p-8 text-white">
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                    Olá, {session?.user?.name?.split(' ')[0] || 'Cliente'}! 👋
                </h1>
                <p className="text-white/80">
                    Bem-vindo(a) à sua área exclusiva. Aqui você pode acompanhar os atendimentos e laudos dos seus pets.
                </p>
            </div>

            {/* Stats */}
            <PawSkeleton isLoading={isLoading}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={<FaPaw />}
                        value={stats.pets}
                        label="Pets cadastrados"
                        variant="primary"
                    />
                    <StatCard
                        icon={<FiCalendar />}
                        value={stats.appointments}
                        label="Atendimentos"
                        variant="info"
                    />
                    <StatCard
                        icon={<FiFileText />}
                        value={stats.reports}
                        label="Laudos disponíveis"
                        variant="success"
                    />
                    <StatCard
                        icon={<FiClock />}
                        value={stats.nextAppointment}
                        label="Próximos atendimentos"
                        variant="warning"
                    />
                </div>
            </PawSkeleton>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Appointments */}
                <Card hover={false}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-[#00231F]">Últimos Atendimentos</h2>
                        <Link href="/cliente/atendimentos" className="text-[#06695C] text-sm font-medium hover:underline">
                            Ver todos
                        </Link>
                    </div>

                    <PawSkeleton isLoading={isLoading}>
                        <div className="space-y-4">
                            {recentAppointments.length === 0 ? (
                                <p className="text-center text-gray-500 py-4">Nenhum atendimento encontrado.</p>
                            ) : (
                                recentAppointments.map((appointment, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                    >
                                        <div>
                                            <p className="font-semibold text-[#00231F]">{appointment.patientId?.name || 'Pet'}</p>
                                            <p className="text-sm text-gray-600">
                                                {appointment.services?.map((s: any) => s.name).join(', ') || 'Consulta'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">
                                                {new Date(appointment.scheduledDate).toLocaleDateString()}
                                            </p>
                                            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${appointment.status === 'concluido' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {appointment.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </PawSkeleton>
                </Card>

                {/* Recent Reports */}
                <Card hover={false}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-[#00231F]">Laudos Recentes</h2>
                        <Link href="/cliente/laudos" className="text-[#06695C] text-sm font-medium hover:underline">
                            Ver todos
                        </Link>
                    </div>

                    <PawSkeleton isLoading={isLoading}>
                        <div className="space-y-4">
                            {recentReports.length === 0 ? (
                                <p className="text-center text-gray-500 py-4">Nenhum laudo encontrado.</p>
                            ) : (
                                recentReports.map((report, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#06695C]/10 rounded-lg flex items-center justify-center text-[#06695C]">
                                                <FiFileText size={20} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-[#00231F]">{report.title}</p>
                                                <p className="text-sm text-gray-600">
                                                    {report.patientId?.name} • {new Date(report.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <button className="text-[#06695C] hover:underline text-sm font-medium">
                                            Ver PDF
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </PawSkeleton>
                </Card>
            </div>

            {/* My Pets */}
            <Card hover={false}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-[#00231F]">Meus Pets</h2>
                    <Link href="/cliente/pets" className="text-[#06695C] text-sm font-medium hover:underline">
                        Ver todos
                    </Link>
                </div>

                <PawSkeleton isLoading={isLoading}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {myPets.length === 0 ? (
                            <p className="text-center text-gray-500 py-4 col-span-full">Nenhum pet cadastrado.</p>
                        ) : (
                            myPets.map((pet, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#06695C]/5 to-[#06695C]/10 rounded-xl border border-[#06695C]/10"
                                >
                                    <div className="w-14 h-14 bg-[#06695C] rounded-full flex items-center justify-center text-white text-xl">
                                        <FaPaw />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#00231F]">{pet.name}</p>
                                        <p className="text-sm text-gray-600 font-medium capitalize">{pet.species} {pet.breed ? `• ${pet.breed}` : ''}</p>
                                        <p className="text-xs text-gray-500">{pet.age || 'Idade não informada'}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </PawSkeleton>
            </Card>

            {/* Contact CTA */}
            <Card hover={false} className="bg-gradient-to-r from-[#06695C] to-[#00231F] text-white">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Precisa de atendimento?</h3>
                        <p className="text-white/80">Entre em contato pelo WhatsApp para agendar.</p>
                    </div>
                    <a
                        href="https://wa.me/5521975787940"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-white text-[#06695C] font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        Agendar Consulta
                    </a>
                </div>
            </Card>
        </div>
    );
}

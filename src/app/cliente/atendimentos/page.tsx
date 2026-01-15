'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import { PawSkeleton } from '@/components/ui/PawLoader';
import { FiCalendar, FiMapPin, FiClock } from 'react-icons/fi';

interface Appointment {
    id: string;
    date: string;
    time: string;
    pet: string;
    species: string;
    service: string;
    status: 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado';
    location: string;
    protocol: string;
}

export default function ClienteAtendimentos() {
    const [isLoading, setIsLoading] = useState(true);
    const [appointments, setAppointments] = useState<any[]>([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await fetch('/api/appointments');
                const data = await res.json();
                if (data.appointments) {
                    setAppointments(data.appointments);
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            agendado: 'bg-blue-100 text-blue-700',
            confirmado: 'bg-green-100 text-green-700',
            em_andamento: 'bg-yellow-100 text-yellow-700',
            concluido: 'bg-gray-100 text-gray-700',
            cancelado: 'bg-red-100 text-red-700',
        };
        const labels: Record<string, string> = {
            agendado: 'Agendado',
            confirmado: 'Confirmado',
            em_andamento: 'Em andamento',
            concluido: 'Concluído',
            cancelado: 'Cancelado',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.agendado}`}>
                {labels[status] || status}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#00231F]">Meus Atendimentos</h1>
                <p className="text-gray-600 mt-1">Histórico completo de consultas e procedimentos</p>
            </div>

            <PawSkeleton isLoading={isLoading}>
                <div className="space-y-4">
                    {appointments.map((appointment) => (
                        <Card key={appointment._id} className="p-0" hover={true}>
                            <div className="p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-[#00231F]">
                                                {appointment.services?.map((s: any) => typeof s === 'string' ? s : s.name).join(', ') || 'Consulta'}
                                            </h3>
                                            {getStatusBadge(appointment.status)}
                                        </div>
                                        <p className="text-gray-600 mb-3 font-medium">
                                            {appointment.patientId?.name || 'Pet'}
                                        </p>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <FiCalendar className="text-[#06695C]" />
                                                {new Date(appointment.scheduledDate).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FiClock className="text-[#06695C]" />
                                                {new Date(appointment.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {appointment.location && (
                                                <span className="flex items-center gap-1">
                                                    <FiMapPin className="text-[#06695C]" />
                                                    {appointment.location}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="lg:text-right">
                                        <p className="text-xs text-gray-400 mb-1">Protocolo</p>
                                        <p className="font-mono font-bold text-[#06695C]">{appointment.protocol}</p>
                                        {appointment.status === 'concluido' && (
                                            <Link href="/cliente/laudos" className="mt-2 inline-block text-sm text-[#06695C] font-medium hover:underline">
                                                Ver Laudo →
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </PawSkeleton>

            {!isLoading && appointments.length === 0 && (
                <Card className="text-center py-12">
                    <FiCalendar size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600">Nenhum atendimento encontrado</h3>
                    <p className="text-gray-500 mt-1">Você ainda não possui atendimentos registrados.</p>
                </Card>
            )}
        </div>
    );
}

import Link from 'next/link';


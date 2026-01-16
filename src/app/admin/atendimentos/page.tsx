'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import { PawSkeleton } from '@/components/ui/PawLoader';
import Button from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { FiSearch, FiPlus, FiEdit, FiEye, FiFileText, FiDownload, FiTrash2, FiPrinter, FiLink } from 'react-icons/fi';

interface Appointment {
    _id: string;
    protocol: string;
    scheduledDate: string;
    patientId: { name: string; species: string; tutorName: string };
    services: { name: string }[];
    status: string;
    totalValue: number;
    paymentStatus: string;
}

export default function AdminAtendimentos() {
    const [isLoading, setIsLoading] = useState(true);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const fetchAppointments = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (statusFilter) params.append('status', statusFilter);

            const res = await fetch(`/api/appointments?${params.toString()}`);
            const data = await res.json();
            if (data.appointments) {
                setAppointments(data.appointments);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch appointments when status filter changes (no debounce needed for filter changes)
    useEffect(() => {
        fetchAppointments();
    }, [statusFilter]);

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
        return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100'}`}>{labels[status] || status}</span>;
    };

    const getPaymentBadge = (status: string) => {
        const styles: Record<string, string> = {
            pendente: 'bg-red-100 text-red-700',
            pago: 'bg-green-100 text-green-700',
            parcial: 'bg-yellow-100 text-yellow-700',
        };
        const labels: Record<string, string> = { pendente: 'Pendente', pago: 'Pago', parcial: 'Parcial' };
        return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100'}`}>{labels[status] || status}</span>;
    };

    const filteredAppointments = appointments.filter((appointment) => {
        if (!search) return true;
        const s = search.toLowerCase();
        return (
            appointment.patientId?.name.toLowerCase().includes(s) ||
            appointment.patientId?.tutorName.toLowerCase().includes(s) ||
            appointment.protocol.toLowerCase().includes(s)
        );
    });

    const copyAccessLink = async (appointmentId: string) => {
        try {
            const res = await fetch(`/api/appointments/${appointmentId}/access-link`, {
                method: 'POST',
            });

            if (!res.ok) {
                const data = await res.json();
                alert(data.error || 'Erro ao gerar link');
                return;
            }

            const data = await res.json();
            await navigator.clipboard.writeText(data.accessLink);
            alert('Link copiado para a área de transferência!');
        } catch (error) {
            console.error(error);
            alert('Erro ao copiar link');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#00231F]">Atendimentos</h1>
                    <p className="text-gray-600 mt-1">Gerenciar todos os atendimentos</p>
                </div>
                <Link href="/admin/atendimentos/novo">
                    <Button variant="primary" leftIcon={<FiPlus />}>
                        Novo Atendimento
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <Card hover={false}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <Input
                            placeholder="Buscar por pet, tutor ou protocolo..."
                            leftIcon={<FiSearch />}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        options={[
                            { value: '', label: 'Todos os status' },
                            { value: 'agendado', label: 'Agendados' },
                            { value: 'confirmado', label: 'Confirmados' },
                            { value: 'em_andamento', label: 'Em andamento' },
                            { value: 'concluido', label: 'Concluídos' },
                            { value: 'cancelado', label: 'Cancelados' },
                        ]}
                    />
                </div>
            </Card>

            {/* Results */}
            <PawSkeleton isLoading={isLoading}>
                {filteredAppointments.length === 0 ? (
                    <Card hover={false}>
                        <div className="text-center py-12">
                            <p className="text-gray-500">Nenhum atendimento encontrado.</p>
                        </div>
                    </Card>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <Card hover={false} noPadding className="hidden lg:block">
                            <div className="overflow-x-auto min-h-[400px]">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200">
                                            <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">Protocolo</th>
                                            <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">Data/Hora</th>
                                            <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">Paciente</th>
                                            <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">Serviços</th>
                                            <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                                            <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">Valor</th>
                                            <th className="px-4 py-4 text-right text-sm font-semibold text-gray-600">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAppointments.map((appointment) => {
                                            const date = new Date(appointment.scheduledDate);
                                            return (
                                                <tr key={appointment._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-4">
                                                        <span className="font-mono font-bold text-[#06695C]">{appointment.protocol}</span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <p className="font-medium text-[#00231F]">{date.toLocaleDateString()}</p>
                                                        <p className="text-sm text-gray-500">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <p className="font-medium text-[#00231F]">{appointment.patientId?.name}</p>
                                                        <p className="text-xs text-gray-500">{appointment.patientId?.tutorName}</p>
                                                        <p className="text-xs text-gray-400">{appointment.patientId?.species}</p>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-600 max-w-xs truncate">
                                                        {appointment.services?.map(s => s.name).join(', ')}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex flex-col gap-1 items-start">
                                                            {getStatusBadge(appointment.status)}
                                                            {getPaymentBadge(appointment.paymentStatus)}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 font-semibold text-[#00231F]">
                                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(appointment.totalValue)}
                                                    </td>
                                                    <td className="px-4 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <a href={`/api/pdf/${appointment._id}?blank=true`} target="_blank" rel="noopener noreferrer">
                                                                <button className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50" title="Imprimir">
                                                                    <FiPrinter size={18} />
                                                                </button>
                                                            </a>
                                                            {appointment.status === 'concluido' && (
                                                                <Link href="/admin/laudos/novo">
                                                                    <button className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-purple-600 transition-colors rounded-lg hover:bg-purple-50" title="Criar Laudo">
                                                                        <FiFileText size={18} />
                                                                    </button>
                                                                </Link>
                                                            )}
                                                            <a href={`/api/pdf/${appointment._id}`} target="_blank" rel="noopener noreferrer">
                                                                <button className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-green-600 transition-colors rounded-lg hover:bg-green-50" title="Baixar PDF">
                                                                    <FiDownload size={18} />
                                                                </button>
                                                            </a>
                                                            <button
                                                                onClick={() => copyAccessLink(appointment._id)}
                                                                className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-purple-600 transition-colors rounded-lg hover:bg-purple-50"
                                                                title="Copiar link de acesso"
                                                            >
                                                                <FiLink size={18} />
                                                            </button>
                                                            <button
                                                                onClick={async () => {
                                                                    if (confirm('Tem certeza que deseja excluir este atendimento? Todos os laudos associados também serão excluídos.')) {
                                                                        try {
                                                                            const res = await fetch(`/api/appointments/${appointment._id}`, { method: 'DELETE' });
                                                                            if (res.ok) {
                                                                                fetchAppointments();
                                                                            } else {
                                                                                const data = await res.json();
                                                                                alert(data.error || 'Erro ao excluir atendimento');
                                                                            }
                                                                        } catch (error) {
                                                                            alert('Erro ao excluir atendimento');
                                                                        }
                                                                    }
                                                                }}
                                                                className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                                                                title="Excluir"
                                                            >
                                                                <FiTrash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </Card>

                        {/* Mobile Cards */}
                        <div className="lg:hidden space-y-4">
                            {filteredAppointments.map((appointment) => {
                                const date = new Date(appointment.scheduledDate);
                                return (
                                    <Card key={appointment._id} hover={true}>
                                        <div className="mb-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <span className="font-mono font-bold text-lg text-[#06695C]">{appointment.protocol}</span>
                                                    <p className="text-sm text-gray-500 mt-1">{date.toLocaleDateString('pt-BR')} às {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                                <div className="flex flex-col gap-1 items-end">
                                                    {getStatusBadge(appointment.status)}
                                                    {getPaymentBadge(appointment.paymentStatus)}
                                                </div>
                                            </div>
                                            <div className="pt-3 border-t border-gray-100">
                                                <p className="font-semibold text-[#00231F] mb-1">{appointment.patientId?.name}</p>
                                                <p className="text-sm text-gray-600 mb-1">{appointment.patientId?.tutorName}</p>
                                                <p className="text-xs text-gray-500 mb-2">{appointment.patientId?.species}</p>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    <span className="font-medium">Serviços:</span> {appointment.services?.map(s => s.name).join(', ')}
                                                </p>
                                                <p className="text-lg font-bold text-[#00231F]">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(appointment.totalValue)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                                            <a href={`/api/pdf/${appointment._id}?blank=true`} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[120px]">
                                                <Button variant="secondary" size="sm" className="w-full" leftIcon={<FiPrinter />}>
                                                    Imprimir
                                                </Button>
                                            </a>
                                            {appointment.status === 'concluido' && (
                                                <Link href="/admin/laudos/novo" className="flex-1 min-w-[120px]">
                                                    <Button variant="primary" size="sm" className="w-full" leftIcon={<FiFileText />}>
                                                        Laudo
                                                    </Button>
                                                </Link>
                                            )}
                                            <a href={`/api/pdf/${appointment._id}`} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[120px]">
                                                <Button variant="secondary" size="sm" className="w-full" leftIcon={<FiDownload />}>
                                                    PDF
                                                </Button>
                                            </a>
                                            <button
                                                onClick={() => copyAccessLink(appointment._id)}
                                                className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-purple-600 hover:bg-purple-50 transition-colors rounded-xl"
                                                title="Copiar link de acesso"
                                            >
                                                <FiLink size={20} />
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (confirm('Tem certeza que deseja excluir este atendimento? Todos os laudos associados também serão excluídos.')) {
                                                        try {
                                                            const res = await fetch(`/api/appointments/${appointment._id}`, { method: 'DELETE' });
                                                            if (res.ok) {
                                                                fetchAppointments();
                                                            } else {
                                                                const data = await res.json();
                                                                alert(data.error || 'Erro ao excluir atendimento');
                                                            }
                                                        } catch (error) {
                                                            alert('Erro ao excluir atendimento');
                                                        }
                                                    }
                                                }}
                                                className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-red-600 hover:bg-red-50 transition-colors rounded-xl"
                                                title="Excluir"
                                            >
                                                <FiTrash2 size={20} />
                                            </button>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </>
                )}
            </PawSkeleton>
        </div>
    );
}

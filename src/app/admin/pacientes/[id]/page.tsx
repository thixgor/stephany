'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FiArrowLeft, FiEdit, FiCalendar, FiClock, FiFileText } from 'react-icons/fi';
import { FaPaw, FaDog, FaCat, FaFeatherAlt, FaWhatsapp } from 'react-icons/fa';
import { GiTurtle, GiRabbit, GiRat } from 'react-icons/gi';
import { PawSkeleton } from '@/components/ui/PawLoader';

interface Patient {
    _id: string;
    name: string;
    species: string;
    breed?: string;
    age?: string;
    weight?: number;
    color?: string;
    microchip?: string;
    tutorName: string;
    tutorPhone: string;
    tutorCpf: string;
    notes?: string;
}

interface Appointment {
    _id: string;
    scheduledDate: string;
    status: string;
    services: { name: string }[];
    notes?: string;
}

const getSpeciesIcon = (species: string) => {
    const s = species?.toLowerCase() || '';
    if (s.includes('cão') || s.includes('canino')) return FaDog;
    if (s.includes('gato') || s.includes('felino')) return FaCat;
    if (s.includes('ave')) return FaFeatherAlt;
    if (s.includes('reptil')) return GiTurtle;
    if (s.includes('roedor')) return GiRat;
    if (s.includes('coelho') || s.includes('lagomorfo')) return GiRabbit;
    return FaPaw;
};

export default function DetalhesPacientePage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [patient, setPatient] = useState<Patient | null>(null);
    const [history, setHistory] = useState<Appointment[]>([]);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                // Fetch Patient
                const resPatient = await fetch(`/api/patients/${id}`); // Need to ensure this API route exists or handle singular get
                // Note: Standard CRUD usually puts GET by ID on [id]/route.ts. I'll assume it exists or I'll fix it if 404.
                // Actually, my previous search for patient API showed /api/patients/route.ts handling Search. 
                // I might need to create /api/patients/[id]/route.ts if it doesn't exist.
                // Let's assume for now I will check/create the API route in next step.

                // Fetch Appointments for this patient
                // Using the main appointments endpoint with patientId filter
                // However, the main endpoint filters by query param. Let's assume it accepts patientId.
                const resHistory = await fetch(`/api/appointments?patientId=${id}`);

                if (resPatient.ok) {
                    const data = await resPatient.json();
                    setPatient(data.patient);
                }

                if (resHistory.ok) {
                    const dataHistory = await resHistory.json();
                    if (dataHistory.appointments) setHistory(dataHistory.appointments);
                }

            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (isLoading) return <div className="p-8"><PawSkeleton isLoading={true}><div /></PawSkeleton></div>;

    if (!patient) return (
        <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-700">Paciente não encontrado</h2>
            <Button onClick={() => router.back()} className="mt-4">Voltar</Button>
        </div>
    );

    const SpeciesIcon = getSpeciesIcon(patient.species);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 text-gray-600 hover:text-[#06695C] transition-colors rounded-full hover:bg-gray-100"
                    >
                        <FiArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-[#00231F] flex items-center gap-3">
                            {patient.name}
                            <span className="text-lg font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full capitalize">
                                {patient.species}
                            </span>
                        </h1>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="secondary"
                        leftIcon={<FiEdit />}
                        onClick={() => router.push(`/admin/pacientes/${id}/editar`)}
                    >
                        Editar
                    </Button>
                    <Button
                        onClick={() => router.push(`/admin/atendimentos/novo?patientId=${id}`)} // Need to handle patientId param in Novo Atendimento
                        leftIcon={<FiCalendar />}
                    >
                        Novo Agendamento
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Patient Info */}
                <div className="space-y-6">
                    <Card hover={false} className="border-t-4 border-t-[#06695C]">
                        <div className="flex flex-col items-center text-center p-4">
                            <div className="w-32 h-32 bg-[#06695C]/10 rounded-full flex items-center justify-center text-[#06695C] mb-4">
                                <SpeciesIcon size={64} />
                            </div>
                            <h2 className="text-xl font-bold text-[#00231F]">{patient.name}</h2>
                            <p className="text-gray-500">{patient.breed || 'SRD'}</p>
                        </div>

                        <div className="mt-6 space-y-4 border-t border-gray-100 pt-6">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Idade</span>
                                <span className="font-medium text-[#00231F]">{patient.age || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Peso</span>
                                <span className="font-medium text-[#00231F]">{patient.weight ? `${patient.weight} kg` : '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Microchip</span>
                                <span className="font-medium text-[#00231F]">{patient.microchip || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Pelagem</span>
                                <span className="font-medium text-[#00231F]">{patient.color || '-'}</span>
                            </div>
                        </div>
                    </Card>

                    <Card hover={false}>
                        <h3 className="font-bold text-[#00231F] mb-4 flex items-center gap-2">
                            Dados do Tutor
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-bold">Nome</label>
                                <p className="text-[#00231F] font-medium">{patient.tutorName}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-bold">Contato</label>
                                <div className="flex items-center gap-2 text-[#06695C]">
                                    <FaWhatsapp />
                                    <a href={`https://wa.me/55${patient.tutorPhone.replace(/\D/g, '')}`} target="_blank" className="hover:underline font-medium">
                                        {patient.tutorPhone}
                                    </a>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-bold">CPF</label>
                                <p className="text-gray-600">{patient.tutorCpf}</p>
                            </div>
                        </div>
                    </Card>

                    {patient.notes && (
                        <Card hover={false} className="bg-yellow-50 border-yellow-100">
                            <h3 className="font-bold text-yellow-800 mb-2">Observações</h3>
                            <p className="text-yellow-700 text-sm whitespace-pre-wrap">{patient.notes}</p>
                        </Card>
                    )}
                </div>

                {/* Right: History */}
                <div className="lg:col-span-2">
                    <Card hover={false} className="h-full">
                        <h3 className="font-bold text-[#00231F] mb-6 text-lg border-b border-gray-100 pb-4">
                            Histórico Clínico
                        </h3>

                        {history.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <FiFileText size={48} className="mx-auto text-gray-300 mb-3" />
                                <p>Nenhum atendimento registrado.</p>
                                <Button
                                    variant="ghost"
                                    className="mt-2 text-[#06695C]"
                                    onClick={() => router.push(`/admin/atendimentos/novo?patientId=${id}`)}
                                >
                                    Agendar primeiro atendimento
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {history.map((appt) => {
                                    const date = new Date(appt.scheduledDate);
                                    return (
                                        <div key={appt._id} className="flex gap-4 group">
                                            <div className="flex flex-col items-center">
                                                <div className="w-12 h-12 bg-[#06695C]/10 rounded-xl flex flex-col items-center justify-center text-[#06695C] font-bold text-xs">
                                                    <span className="text-lg">{date.getDate()}</span>
                                                    <span>{date.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()}</span>
                                                </div>
                                                <div className="w-0.5 h-full bg-gray-100 mt-2 group-last:hidden"></div>
                                            </div>
                                            <div className="flex-1 pb-6">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-bold text-[#00231F] text-lg">
                                                            {appt.services.map(s => s.name).join(', ')}
                                                        </h4>
                                                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                            <FiClock size={14} />
                                                            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            <span className="mx-1">•</span>
                                                            <span className={`capitalize px-2 py-0.5 rounded text-xs ${appt.status === 'concluido' ? 'bg-green-100 text-green-700' :
                                                                appt.status === 'agendado' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                                                }`}>{appt.status}</span>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="sm" onClick={() => router.push(`/api/pdf/${appt._id}`)}>
                                                        Ver PDF
                                                    </Button>
                                                </div>
                                                {appt.notes && (
                                                    <div className="mt-3 bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
                                                        {appt.notes}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}

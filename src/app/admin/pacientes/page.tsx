'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import { PawSkeleton } from '@/components/ui/PawLoader';
import Button from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { FiSearch, FiPlus, FiEdit, FiEye, FiTrash2 } from 'react-icons/fi';
import { FaPaw } from 'react-icons/fa';

interface Patient {
    _id: string;
    name: string;
    species: string;
    breed: string;
    birthDate: string;
    weight: number;
    tutorName: string;
    tutorPhone: string;
    tutorCpf: string;
    age?: string;
}

// Helper to determine age
function getAgeDisplay(patient: Patient) {
    if (patient.birthDate) {
        const today = new Date();
        const birth = new Date(patient.birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        if (age === 0) {
            const months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
            return `${months} meses`;
        }
        return `${age} anos`;
    }
    return patient.age || 'Idade n/a';
}

export default function AdminPacientes() {
    const [isLoading, setIsLoading] = useState(true);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [search, setSearch] = useState('');
    const [speciesFilter, setSpeciesFilter] = useState('');

    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchPatients = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (speciesFilter) params.append('species', speciesFilter);
            params.append('page', page.toString());
            params.append('limit', '20');

            const res = await fetch(`/api/patients?${params.toString()}`);
            const data = await res.json();

            if (data.patients) {
                setPatients(data.patients);
                setTotalPages(data.pagination?.pages || 1);
            }
        } catch (error) {
            console.error('Error fetching patients:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Debounce search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchPatients();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search, speciesFilter, page]);

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja remover este paciente?')) return;
        try {
            const res = await fetch(`/api/patients/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchPatients();
            } else {
                const data = await res.json();
                alert(data.error || 'Erro ao excluir');
            }
        } catch (e) {
            alert('Erro de conexão ao excluir');
        }
    };

    const getSpeciesLabel = (species: string) => {
        let color = 'bg-gray-100 text-gray-700';
        const lower = species?.toLowerCase() || '';

        if (lower.includes('cão') || lower.includes('canino')) color = 'bg-blue-100 text-blue-700';
        else if (lower.includes('gato') || lower.includes('felino')) color = 'bg-purple-100 text-purple-700';
        else if (lower.includes('ave') || lower.includes('passaro')) color = 'bg-yellow-100 text-yellow-700';
        else if (lower.includes('reptil') || lower.includes('tartaruga')) color = 'bg-green-100 text-green-700';
        else if (lower.includes('roedor') || lower.includes('hamster')) color = 'bg-orange-100 text-orange-700';

        return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>{species}</span>;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#00231F]">Pacientes</h1>
                    <p className="text-gray-600 mt-1">Gerenciar cadastro de pacientes</p>
                </div>
                <Link href="/admin/pacientes/novo">
                    <Button variant="primary" leftIcon={<FiPlus />}>
                        Novo Paciente
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <Card hover={false}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <Input
                            placeholder="Buscar por nome do pet, tutor, CPF ou telefone..."
                            leftIcon={<FiSearch />}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </Card>

            {/* Results */}
            <PawSkeleton isLoading={isLoading}>
                {patients.length === 0 ? (
                    <Card hover={false}>
                        <div className="text-center py-12">
                            <FaPaw size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600">Nenhum paciente encontrado</h3>
                        </div>
                    </Card>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <Card hover={false} noPadding className="hidden md:block">
                            <div className="overflow-x-auto min-h-[300px]">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200">
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Paciente</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Espécie</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Tutor</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Telefone</th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {patients.map((patient) => (
                                            <tr key={patient._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-[#06695C]/10 rounded-full flex items-center justify-center text-[#06695C]">
                                                            <FaPaw />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-[#00231F]">{patient.name}</p>
                                                            <p className="text-sm text-gray-500">{patient.breed} • {getAgeDisplay(patient)}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">{getSpeciesLabel(patient.species)}</td>
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-[#00231F]">{patient.tutorName}</p>
                                                    <p className="text-sm text-gray-500">{patient.tutorCpf}</p>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">{patient.tutorPhone}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={`/admin/pacientes/${patient._id}`}>
                                                            <button className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-[#06695C] transition-colors rounded-lg hover:bg-[#06695C]/10" title="Ver Detalhes">
                                                                <FiEye size={18} />
                                                            </button>
                                                        </Link>
                                                        <Link href={`/admin/pacientes/${patient._id}/editar`}>
                                                            <button className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50" title="Editar">
                                                                <FiEdit size={18} />
                                                            </button>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(patient._id)}
                                                            className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                                                            title="Excluir"
                                                        >
                                                            <FiTrash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>

                        {/* Mobile Cards */}
                        <div className="md:hidden space-y-4">
                            {patients.map((patient) => (
                                <Card key={patient._id} hover={true}>
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-12 h-12 bg-[#06695C]/10 rounded-full flex items-center justify-center text-[#06695C] flex-shrink-0">
                                            <FaPaw size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-lg text-[#00231F] mb-1">{patient.name}</h3>
                                            <p className="text-sm text-gray-600 mb-2">{patient.breed} • {getAgeDisplay(patient)}</p>
                                            {getSpeciesLabel(patient.species)}
                                        </div>
                                    </div>
                                    <div className="space-y-2 mb-4 pt-4 border-t border-gray-100">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Tutor</p>
                                            <p className="font-medium text-[#00231F]">{patient.tutorName}</p>
                                            <p className="text-sm text-gray-500">{patient.tutorCpf}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Telefone</p>
                                            <a href={`tel:${patient.tutorPhone}`} className="text-[#06695C] font-medium">
                                                {patient.tutorPhone}
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                                        <Link href={`/admin/pacientes/${patient._id}`} className="flex-1">
                                            <Button variant="secondary" size="sm" className="w-full" leftIcon={<FiEye />}>
                                                Ver
                                            </Button>
                                        </Link>
                                        <Link href={`/admin/pacientes/${patient._id}/editar`} className="flex-1">
                                            <Button variant="primary" size="sm" className="w-full" leftIcon={<FiEdit />}>
                                                Editar
                                            </Button>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(patient._id)}
                                            className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-red-600 hover:bg-red-50 transition-colors rounded-xl"
                                            title="Excluir"
                                        >
                                            <FiTrash2 size={20} />
                                        </button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </>
                )}
            </PawSkeleton>
        </div>
    );
}

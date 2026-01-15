'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FiPlus, FiSearch, FiFileText, FiEye, FiDownload, FiEdit } from 'react-icons/fi';

interface Report {
    _id: string;
    title: string;
    type: string;
    patientId: { name: string; species: string };
    createdAt: string;
    accessToken: string;
}

export default function LaudosPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('/api/reports')
            .then(res => res.json())
            .then(data => {
                if (data.reports) setReports(data.reports);
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    const filteredReports = reports.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.patientId?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getTypeName = (type: string) => {
        switch (type) {
            case 'laudo': return 'Laudo Médico';
            case 'receita': return 'Receita';
            case 'exame': return 'Resultado de Exame';
            case 'atestado': return 'Atestado';
            default: return type;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#00231F]">Laudos e Documentos</h1>
                    <p className="text-gray-600">Gerencie laudos, receitas e atestados emitidos.</p>
                </div>
                <Link href="/admin/laudos/novo">
                    <Button leftIcon={<FiPlus />}>
                        Novo Documento
                    </Button>
                </Link>
            </div>

            <Card hover={false} className="p-4">
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por título ou paciente..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#06695C]"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </Card>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 text-xs uppercase tracking-wider text-gray-500 font-semibold">Data</th>
                                <th className="p-4 text-xs uppercase tracking-wider text-gray-500 font-semibold">Documento</th>
                                <th className="p-4 text-xs uppercase tracking-wider text-gray-500 font-semibold">Paciente</th>
                                <th className="p-4 text-xs uppercase tracking-wider text-gray-500 font-semibold">Tipo</th>
                                <th className="p-4 text-xs uppercase tracking-wider text-gray-500 font-semibold">Status</th>
                                <th className="p-4 text-xs uppercase tracking-wider text-gray-500 font-semibold text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">Carregando documentos...</td>
                                </tr>
                            ) : filteredReports.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">Nenhum documento encontrado.</td>
                                </tr>
                            ) : (
                                filteredReports.map((report) => (
                                    <tr key={report._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                                            {new Date(report.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-[#06695C]/10 text-[#06695C] flex items-center justify-center">
                                                    <FiFileText />
                                                </div>
                                                <span className="font-medium text-[#00231F]">{report.title}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {report.patientId?.name || 'Não identificado'}
                                            <span className="text-xs text-gray-400 block">{report.patientId?.species}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                                                {getTypeName(report.type)}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {(report as any).status === 'draft' ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-700">
                                                    Rascunho
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                                                    Emitido
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/laudos/${report._id}/editar`}>
                                                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600" title="Editar / Continuar">
                                                        <FiEdit size={16} />
                                                    </Button>
                                                </Link>
                                                {(report as any).status !== 'draft' && (
                                                    <a href={`/api/pdf/${report._id}`} target="_blank" rel="noopener noreferrer">
                                                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-[#06695C]" title="Ver PDF">
                                                            <FiDownload size={16} />
                                                        </Button>
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

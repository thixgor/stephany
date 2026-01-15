'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import { PawSkeleton } from '@/components/ui/PawLoader';
import Button from '@/components/ui/Button';
import { FiFileText, FiDownload, FiExternalLink } from 'react-icons/fi';

interface Report {
    _id: string;
    type: 'laudo' | 'receita' | 'exame' | 'prescricao' | 'atestado';
    title: string;
    accessToken: string;
    createdAt: string;
    patientId?: { name: string };
}

export default function ClienteLaudos() {
    const [isLoading, setIsLoading] = useState(true);
    const [reports, setReports] = useState<any[]>([]);
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await fetch('/api/reports');
                const data = await res.json();
                if (data.reports) {
                    setReports(data.reports);
                }
            } catch (error) {
                console.error('Error fetching reports:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReports();
    }, []);

    const getTypeLabel = (type: string) => {
        const labels: Record<string, { text: string, color: string }> = {
            laudo: { text: 'Laudo', color: 'bg-blue-100 text-blue-700' },
            receita: { text: 'Receita', color: 'bg-purple-100 text-purple-700' },
            exame: { text: 'Exame', color: 'bg-green-100 text-green-700' },
            prescricao: { text: 'Prescrição', color: 'bg-orange-100 text-orange-700' },
            atestado: { text: 'Atestado', color: 'bg-teal-100 text-teal-700' },
            outro: { text: 'Outro', color: 'bg-gray-100 text-gray-700' },
        };
        const activeLabel = labels[type] || labels.outro;
        return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${activeLabel.color}`}>{activeLabel.text}</span>;
    };

    const filteredReports = filter === 'all'
        ? reports
        : reports.filter(r => r.type === filter);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#00231F]">Laudos e Documentos</h1>
                <p className="text-gray-600 mt-1">Acesse todos os laudos, exames e prescrições dos seus pets</p>
            </div>

            {/* Filter */}
            <div className="flex flex-wrap gap-2">
                {[
                    { value: 'all', label: 'Todos' },
                    { value: 'laudo', label: 'Laudos' },
                    { value: 'exame', label: 'Exames' },
                    { value: 'prescricao', label: 'Prescrições' },
                    { value: 'atestado', label: 'Atestados' },
                ].map((option) => (
                    <button
                        key={option.value}
                        onClick={() => setFilter(option.value)}
                        className={`px-4 py-2 rounded-xl font-medium transition-all ${filter === option.value
                            ? 'bg-[#06695C] text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            <PawSkeleton isLoading={isLoading}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredReports.map((report) => (
                        <Card key={report._id} className="p-0" hover={true}>
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-[#06695C]/10 rounded-xl flex items-center justify-center text-[#06695C]">
                                            <FiFileText size={24} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                {getTypeLabel(report.type)}
                                            </div>
                                            <h3 className="font-semibold text-[#00231F]">{report.title}</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500 mb-4">
                                    <span className="font-medium text-[#00231F]">{report.patientId?.name || 'Pet'}</span> • {new Date(report.createdAt).toLocaleDateString()}
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <span className="text-xs text-gray-400">
                                        Ref: <span className="font-mono text-[#06695C]">{report.accessToken?.substring(0, 10).toUpperCase()}</span>
                                    </span>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm" leftIcon={<FiExternalLink size={16} />} onClick={() => window.open(`/api/pdf/${report._id}`, '_blank')}>
                                            Ver
                                        </Button>
                                        <Button variant="primary" size="sm" leftIcon={<FiDownload size={16} />} onClick={() => window.open(`/api/pdf/${report._id}?download=true`, '_blank')}>
                                            PDF
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </PawSkeleton>

            {!isLoading && filteredReports.length === 0 && (
                <Card className="text-center py-12">
                    <FiFileText size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600">Nenhum documento encontrado</h3>
                    <p className="text-gray-500 mt-1">Não há documentos disponíveis com este filtro.</p>
                </Card>
            )}
        </div>
    );
}


'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Card from '@/components/ui/Card';
import { FiCheckCircle, FiAlertCircle, FiShield, FiFileText, FiUser } from 'react-icons/fi';
import PawLoader from '@/components/ui/PawLoader';
import { formatDateTime } from '@/lib/utils';

export default function VerificacaoPage() {
    const params = useParams();
    const hash = params?.hash as string;
    const [report, setReport] = useState<any>(null);
    const [docType, setDocType] = useState<string>('report');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!hash) return;

        const verify = async () => {
            try {
                const res = await fetch(`/api/reports/verify/${hash}`);
                if (res.ok) {
                    const data = await res.json();
                    setReport(data.report);
                    setDocType(data.type);
                } else {
                    setError('Documento não encontrado ou inválido.');
                }
            } catch (err) {
                setError('Erro ao verificar documento.');
            } finally {
                setLoading(false);
            }
        };

        verify();
    }, [hash]);

    if (loading) return <div className="flex justify-center p-12"><PawLoader size="xl" /></div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-2xl w-full space-y-6">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#06695C] text-white mb-4">
                        <FiShield size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-[#00231F]">Verificação de Autenticidade</h1>
                    <p className="text-gray-600 mt-2">Sistema de Documentos Digitais Profissionais</p>
                </div>

                <Card hover={false} className="border-t-4 border-t-[#06695C]">
                    {error ? (
                        <div className="text-center py-8">
                            <FiAlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                            <h2 className="text-xl font-bold text-gray-800">{error}</h2>
                            <p className="text-gray-500 mt-2">Este documento não pôde ser validado em nosso sistema.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 text-green-600 bg-green-50 p-4 rounded-xl">
                                <FiCheckCircle size={24} />
                                <span className="font-bold">Documento Autenticado com Sucesso</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase mb-2 flex items-center gap-2">
                                        <FiFileText /> Dados do Documento
                                    </h3>
                                    <div className="space-y-1">
                                        <p className="text-lg font-bold text-[#00231F]">{report.title || `Atendimento ${report.protocol}`}</p>
                                        <p className="text-sm text-gray-500">Tipo: <span className="capitalize">{report.type || 'Atendimento / Consulta'}</span></p>
                                        <p className="text-sm text-gray-500">Emitido em: {formatDateTime(report.createdAt)}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase mb-2 flex items-center gap-2">
                                        <FiUser /> Paciente e Tutor
                                    </h3>
                                    <div className="space-y-1">
                                        <p className="font-bold text-[#00231F]">{report.patientId?.name || 'N/A'}</p>
                                        <p className="text-sm text-gray-500">{report.patientId?.species} • {report.patientId?.breed}</p>
                                        <p className="text-sm text-gray-500">Tutor: {report.patientId?.tutorName}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <label className="text-xs font-bold text-gray-400 uppercase">Assinatura Digital (SHA-256)</label>
                                <p className="text-xs font-mono text-gray-600 break-all mt-1">{report.reportHash || report.hash}</p>
                            </div>

                            <div className="text-center pt-4 border-t border-gray-100">
                                <p className="text-sm text-gray-500">
                                    Este documento foi assinado por Dra. Stephany Rodrigues (CRMV-RJ 22404)
                                </p>
                            </div>
                        </div>
                    )}
                </Card>

                <p className="text-center text-xs text-gray-400">
                    &copy; {new Date().getFullYear()} Stephany Rodrigues Medicina Veterinária. Todos os direitos reservados.
                </p>
            </div>
        </div>
    );
}

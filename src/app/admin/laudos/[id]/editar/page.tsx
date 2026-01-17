'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { FiArrowLeft, FiSave, FiPlus, FiTrash2, FiActivity, FiFileText, FiPlusCircle, FiXCircle } from 'react-icons/fi';
import SignaturePad from '@/components/ui/SignaturePad';
import { PageLoader } from '@/components/ui/PawLoader';
import { getClinicalConstants, isOutOfRange } from '@/lib/clinicalConstants';

interface Appointment {
    _id: string;
    patientId: { _id: string; name: string; tutorName: string };
    scheduledDate: string;
    protocol: string;
}

export default function EditarLaudoPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [activeTab, setActiveTab] = useState('geral');

    const [formData, setFormData] = useState({
        appointmentId: '',
        patientId: '',
        type: 'laudo',
        title: '',
        content: '',
        anamnese: '',
        diagnosis: '',
        observations: '',
        signatureType: 'electronic' as 'electronic' | 'handwritten',
        signatureImage: '',
        physicalExam: {
            temp: '', fc: '', fr: '', mucosas: '', tpc: '', linfonodos: '',
            systems: {
                cardiovascular: '', respiratorio: '', digestorio: '', neurologico: '',
                tegumentar: '', locomotor: '', outros: ''
            }
        },
        prescription: [] as any[],
        examDetails: { material: '', method: '', results: [] as any[] },
        atestadoDetails: { declaration: '', startDate: '', endDate: '', canTravel: true }
    });
    const [currentSpecies, setCurrentSpecies] = useState('');

    const clinicalConstants = getClinicalConstants(currentSpecies);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [apptRes, reportRes] = await Promise.all([
                    fetch('/api/appointments?limit=50'),
                    fetch(`/api/reports/${id}`)
                ]);

                const apptData = await apptRes.json();
                const reportData = await reportRes.json();

                if (apptData.appointments) setAppointments(apptData.appointments);

                if (reportData.report) {
                    const r = reportData.report;
                    setFormData({
                        appointmentId: r.appointmentId?._id || r.appointmentId || '',
                        patientId: r.patientId?._id || r.patientId || '',
                        type: r.type,
                        title: r.title,
                        content: r.content,
                        anamnese: r.anamnese || '',
                        diagnosis: r.diagnosis || '',
                        observations: r.observations || '',
                        signatureType: r.signatureType || 'electronic',
                        signatureImage: r.signatureImage || '',
                        physicalExam: r.physicalExam || {
                            temp: '', fc: '', fr: '', mucosas: '', tpc: '', linfonodos: '',
                            systems: {
                                cardiovascular: '', respiratorio: '', digestorio: '', neurologico: '',
                                tegumentar: '', locomotor: '', outros: ''
                            }
                        },
                        prescription: r.prescription || [],
                        examDetails: r.examDetails || { results: [] },
                        atestadoDetails: {
                            declaration: r.atestadoDetails?.declaration || '',
                            startDate: r.atestadoDetails?.startDate ? new Date(r.atestadoDetails.startDate).toISOString().split('T')[0] : '',
                            endDate: r.atestadoDetails?.endDate ? new Date(r.atestadoDetails.endDate).toISOString().split('T')[0] : '',
                            canTravel: r.atestadoDetails?.canTravel ?? true
                        }
                    });

                    if (r.patientId?.species) {
                        setCurrentSpecies(r.patientId.species);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handlePrescriptionAdd = () => {
        setFormData(prev => ({
            ...prev,
            prescription: [...prev.prescription, { medication: '', dosage: '', frequency: '', duration: '', activePrinciple: '', concentration: '', route: '', quantity: '', notes: '' }]
        }));
    };

    const handleExamResultAdd = () => {
        setFormData(prev => ({
            ...prev,
            examDetails: {
                ...prev.examDetails,
                results: [...(prev.examDetails.results || []), { parameter: '', value: '', reference: '', unit: '' }]
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'published' = 'published') => {
        if (e) e.preventDefault();
        setIsSaving(true);

        const payload = {
            ...formData,
            status,
            physicalExam: (formData.physicalExam.temp || formData.physicalExam.fc || formData.physicalExam.systems.cardiovascular) ? formData.physicalExam : undefined,
            prescription: formData.prescription.length > 0 ? formData.prescription : undefined,
            examDetails: formData.examDetails.results.length > 0 ? formData.examDetails : undefined,
            atestadoDetails: (formData.atestadoDetails.declaration || formData.atestadoDetails.startDate) ? formData.atestadoDetails : undefined,
        };

        try {
            const response = await fetch(`/api/reports/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                router.push('/admin/laudos');
            } else {
                const data = await response.json();
                alert(data.error || 'Erro ao salvar documento');
            }
        } catch (error) {
            alert('Erro ao salvar documento');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <PageLoader />;

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 text-gray-600 hover:text-[#06695C] transition-colors">
                    <FiArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-[#00231F]">Editar Documento</h1>
                    <p className="text-gray-600">Continue editando seu rascunho ou atualize um documento.</p>
                </div>
            </div>

            <div className="flex bg-white rounded-xl shadow-sm p-1 gap-1 sticky top-0 z-10 border border-gray-100">
                {['geral', 'clinico', 'conteudo', 'assinatura'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all capitalize ${activeTab === tab ? 'bg-[#06695C] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {activeTab === 'geral' && (
                    <Card hover={false} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select
                                label="Atendimento Referência"
                                value={formData.appointmentId}
                                onChange={(e) => setFormData({ ...formData, appointmentId: e.target.value })}
                                options={[
                                    { value: '', label: 'Selecione o atendimento...' },
                                    ...appointments.map(a => ({ value: a._id, label: `${new Date(a.scheduledDate).toLocaleDateString()} - ${a.patientId.name} (${a.patientId.tutorName})` }))
                                ]}
                                required
                            />
                            <Select
                                label="Tipo de Documento"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                options={[
                                    { value: 'laudo', label: 'Laudo Médico / Consulta' },
                                    { value: 'receita', label: 'Receita / Prescrição' },
                                    { value: 'exame', label: 'Resultado de Exame' },
                                    { value: 'atestado', label: 'Atestado Médico' },
                                    { value: 'encaminhamento', label: 'Encaminhamento' },
                                ]}
                                required
                            />
                        </div>
                        <Input
                            label="Título do Documento"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </Card>
                )}

                {activeTab === 'clinico' && (
                    <Card hover={false} className="space-y-8">
                        <div>
                            <h3 className="text-lg font-bold text-[#00231F] flex items-center gap-2 mb-4"><FiActivity className="text-[#06695C]" /> Exame Clínico</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <Input
                                        label="Temperatura (°C)"
                                        value={formData.physicalExam.temp}
                                        onChange={(e) => setFormData({ ...formData, physicalExam: { ...formData.physicalExam, temp: e.target.value } })}
                                        className={isOutOfRange(formData.physicalExam.temp, clinicalConstants.temp) ? 'text-red-600 font-bold border-red-300' : ''}
                                    />
                                    {currentSpecies && <p className="text-[10px] text-gray-500 px-1">VR: {clinicalConstants.temp.label}</p>}
                                </div>
                                <div className="space-y-1">
                                    <Input
                                        label="Freq. Cardíaca (bpm)"
                                        value={formData.physicalExam.fc}
                                        onChange={(e) => setFormData({ ...formData, physicalExam: { ...formData.physicalExam, fc: e.target.value } })}
                                        className={isOutOfRange(formData.physicalExam.fc, clinicalConstants.fc) ? 'text-red-600 font-bold border-red-300' : ''}
                                    />
                                    {currentSpecies && <p className="text-[10px] text-gray-500 px-1">VR: {clinicalConstants.fc.label}</p>}
                                </div>
                                <div className="space-y-1">
                                    <Input
                                        label="Freq. Respiratória (mpm)"
                                        value={formData.physicalExam.fr}
                                        onChange={(e) => setFormData({ ...formData, physicalExam: { ...formData.physicalExam, fr: e.target.value } })}
                                        className={isOutOfRange(formData.physicalExam.fr, clinicalConstants.fr) ? 'text-red-600 font-bold border-red-300' : ''}
                                    />
                                    {currentSpecies && <p className="text-[10px] text-gray-500 px-1">VR: {clinicalConstants.fr.label}</p>}
                                </div>
                                <Input label="Mucosas" value={formData.physicalExam.mucosas} onChange={(e) => setFormData({ ...formData, physicalExam: { ...formData.physicalExam, mucosas: e.target.value } })} />
                                <Input label="TPC" value={formData.physicalExam.tpc} onChange={(e) => setFormData({ ...formData, physicalExam: { ...formData.physicalExam, tpc: e.target.value } })} />
                                <Input label="Linfonodos" value={formData.physicalExam.linfonodos} onChange={(e) => setFormData({ ...formData, physicalExam: { ...formData.physicalExam, linfonodos: e.target.value } })} />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-700 mb-2">Sistemas</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Cardiovascular" value={formData.physicalExam.systems.cardiovascular} onChange={(e) => setFormData({ ...formData, physicalExam: { ...formData.physicalExam, systems: { ...formData.physicalExam.systems, cardiovascular: e.target.value } } })} />
                                <Input label="Respiratório" value={formData.physicalExam.systems.respiratorio} onChange={(e) => setFormData({ ...formData, physicalExam: { ...formData.physicalExam, systems: { ...formData.physicalExam.systems, respiratorio: e.target.value } } })} />
                                <Input label="Digestório" value={formData.physicalExam.systems.digestorio} onChange={(e) => setFormData({ ...formData, physicalExam: { ...formData.physicalExam, systems: { ...formData.physicalExam.systems, digestorio: e.target.value } } })} />
                                <Input label="Neurológico" value={formData.physicalExam.systems.neurologico} onChange={(e) => setFormData({ ...formData, physicalExam: { ...formData.physicalExam, systems: { ...formData.physicalExam.systems, neurologico: e.target.value } } })} />
                                <Input label="Tegumentar" value={formData.physicalExam.systems.tegumentar} onChange={(e) => setFormData({ ...formData, physicalExam: { ...formData.physicalExam, systems: { ...formData.physicalExam.systems, tegumentar: e.target.value } } })} />
                                <Input label="Locomotor" value={formData.physicalExam.systems.locomotor} onChange={(e) => setFormData({ ...formData, physicalExam: { ...formData.physicalExam, systems: { ...formData.physicalExam.systems, locomotor: e.target.value } } })} />
                                <Input label="Outros" value={formData.physicalExam.systems.outros} onChange={(e) => setFormData({ ...formData, physicalExam: { ...formData.physicalExam, systems: { ...formData.physicalExam.systems, outros: e.target.value } } })} />
                            </div>
                        </div>
                    </Card>
                )}

                {activeTab === 'conteudo' && (
                    <div className="space-y-6">
                        {formData.type === 'receita' && (
                            <Card hover={false}>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-[#00231F]">Medicamentos</h3>
                                    <Button type="button" size="sm" onClick={handlePrescriptionAdd} leftIcon={<FiPlusCircle />}>Adicionar Medicamento</Button>
                                </div>
                                <div className="space-y-4">
                                    {formData.prescription.map((p, i) => (
                                        <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-4">
                                            <div className="flex justify-between">
                                                <span className="font-bold text-[#06695C]">Medicamento {i + 1}</span>
                                                <button type="button" onClick={() => setFormData({ ...formData, prescription: formData.prescription.filter((_, idx) => idx !== i) })} className="text-red-500 hover:text-red-700"><FiTrash2 /></button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                <Input label="Medicamento" value={p.medication} onChange={(e) => { const newP = [...formData.prescription]; newP[i].medication = e.target.value; setFormData({ ...formData, prescription: newP }); }} />
                                                <Input label="Princípio Ativo" value={p.activePrinciple} onChange={(e) => { const newP = [...formData.prescription]; newP[i].activePrinciple = e.target.value; setFormData({ ...formData, prescription: newP }); }} />
                                                <Input label="Concentração" value={p.concentration} onChange={(e) => { const newP = [...formData.prescription]; newP[i].concentration = e.target.value; setFormData({ ...formData, prescription: newP }); }} />
                                                <Input label="Posologia (Dose)" value={p.dosage} onChange={(e) => { const newP = [...formData.prescription]; newP[i].dosage = e.target.value; setFormData({ ...formData, prescription: newP }); }} />
                                                <Input label="Frequência" value={p.frequency} onChange={(e) => { const newP = [...formData.prescription]; newP[i].frequency = e.target.value; setFormData({ ...formData, prescription: newP }); }} />
                                                <Input label="Duração" value={p.duration} onChange={(e) => { const newP = [...formData.prescription]; newP[i].duration = e.target.value; setFormData({ ...formData, prescription: newP }); }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {formData.type === 'exame' && (
                            <Card hover={false} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Material"
                                        value={formData.examDetails.material}
                                        onChange={(e) => setFormData({ ...formData, examDetails: { ...formData.examDetails, material: e.target.value } })}
                                        placeholder="Ex: Sangue total, Urina, Fezes..."
                                    />
                                    <Input
                                        label="Método"
                                        value={formData.examDetails.method}
                                        onChange={(e) => setFormData({ ...formData, examDetails: { ...formData.examDetails, method: e.target.value } })}
                                        placeholder="Ex: Colorimétrico, Microscópico, Hematológico..."
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-[#00231F]">Resultados de Exames</h3>
                                        <Button type="button" size="sm" onClick={handleExamResultAdd} leftIcon={<FiPlus />}>Adicionar Parâmetro</Button>
                                    </div>
                                    <div className="space-y-2">
                                        {formData.examDetails.results.map((r: any, i: number) => (
                                            <div key={i} className="flex gap-2 items-end">
                                                <div className="flex-1 lg:flex-[3]"><Input label="Parâmetro" value={r.parameter} onChange={(e) => { const newR = [...formData.examDetails.results]; newR[i].parameter = e.target.value; setFormData({ ...formData, examDetails: { ...formData.examDetails, results: newR } }); }} /></div>
                                                <div className="flex-1 lg:flex-[1]"><Input label="Valor" value={r.value} onChange={(e) => { const newR = [...formData.examDetails.results]; newR[i].value = e.target.value; setFormData({ ...formData, examDetails: { ...formData.examDetails, results: newR } }); }} /></div>
                                                <div className="flex-1 lg:flex-[1]"><Input label="Unidade" value={r.unit} onChange={(e) => { const newR = [...formData.examDetails.results]; newR[i].unit = e.target.value; setFormData({ ...formData, examDetails: { ...formData.examDetails, results: newR } }); }} /></div>
                                                <div className="flex-1 lg:flex-[2]"><Input label="Ref." value={r.reference} onChange={(e) => { const newR = [...formData.examDetails.results]; newR[i].reference = e.target.value; setFormData({ ...formData, examDetails: { ...formData.examDetails, results: newR } }); }} /></div>
                                                <button type="button" onClick={() => setFormData({ ...formData, examDetails: { ...formData.examDetails, results: formData.examDetails.results.filter((_: any, idx: number) => idx !== i) } })} className="mb-3 text-red-500"><FiTrash2 /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        )}

                        <Card hover={false} className="space-y-4">
                            {formData.type === 'laudo' && <Textarea label="Anamnese" value={formData.anamnese} onChange={(e) => setFormData({ ...formData, anamnese: e.target.value })} rows={4} placeholder="Histórico clínico detalhado..." />}
                            <Textarea label={formData.type === 'receita' ? 'Orientações Gerais' : 'Conclusão / Descrição'} value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={10} />
                            <Input label="Diagnóstico Final (Opcional)" value={formData.diagnosis} onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })} />
                        </Card>
                    </div>
                )}

                {activeTab === 'assinatura' && (
                    <Card hover={false} className="space-y-6">
                        <Select
                            label="Escolha o Método de Assinatura"
                            value={formData.signatureType}
                            onChange={(e) => setFormData({ ...formData, signatureType: e.target.value as any })}
                            options={[
                                { value: 'electronic', label: 'Assinatura Eletrônica (Selo Profissional)' },
                                { value: 'handwritten', label: 'Assinatura Manual (Escrever agora)' },
                            ]}
                        />

                        {formData.signatureType === 'handwritten' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Assine no campo abaixo:</label>
                                <SignaturePad onSave={(img) => setFormData({ ...formData, signatureImage: img })} />
                            </div>
                        )}

                        {formData.signatureType === 'electronic' && (
                            <div className="p-12 border-2 border-dashed border-gray-200 rounded-2xl text-center bg-gray-50 flex flex-col items-center">
                                <div className="w-48 border-b border-gray-400 pb-2 mb-2 text-center cursive italic font-serif text-2xl text-gray-700">
                                    Stephany Rodrigues
                                </div>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Selo de Autenticidade Digital</p>
                            </div>
                        )}
                    </Card>
                )}

                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-40 flex justify-end gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                    <Button type="button" variant="ghost" onClick={() => router.back()}>Cancelar</Button>
                    <Button
                        type="button"
                        variant="secondary"
                        isLoading={isSaving}
                        onClick={(e) => handleSubmit(e as any, 'draft')}
                    >
                        Salvar Rascunho
                    </Button>
                    <Button
                        type="button"
                        isLoading={isSaving}
                        className="shadow-xl"
                        leftIcon={<FiSave />}
                        onClick={(e) => handleSubmit(e as any, 'published')}
                    >
                        Emitir Documento Final
                    </Button>
                </div>
            </form>
        </div>
    );
}

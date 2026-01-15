'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import PatientForm from '@/components/forms/PatientForm';
import { PawSkeleton } from '@/components/ui/PawLoader';

export default function EditarPacientePage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [patient, setPatient] = useState<any>(null);

    useEffect(() => {
        if (!id) return;

        const fetchPatient = async () => {
            try {
                const res = await fetch(`/api/patients/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setPatient(data.patient);
                } else {
                    alert('Erro ao carregar paciente');
                    router.back();
                }
            } catch (error) {
                console.error(error);
                alert('Erro ao carregar paciente');
                router.back();
            } finally {
                setIsLoading(false);
            }
        };

        fetchPatient();
    }, [id, router]);

    const handleSubmit = async (formData: any) => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/patients/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push(`/admin/pacientes/${id}`);
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || 'Erro ao salvar alterações');
            }
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar alterações');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-8"><PawSkeleton isLoading={true}><div /></PawSkeleton></div>;

    return (
        <div className="max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => router.back()}
                    className="p-2 text-gray-600 hover:text-[#06695C] transition-colors rounded-full hover:bg-gray-100"
                >
                    <FiArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-[#00231F]">Editar Paciente</h1>
                    <p className="text-gray-600">Altere os dados do animal ou do tutor</p>
                </div>
            </div>

            <PatientForm
                initialData={patient}
                onSubmit={handleSubmit}
                isLoading={isSaving}
                onCancel={() => router.back()}
            />
        </div>
    );
}

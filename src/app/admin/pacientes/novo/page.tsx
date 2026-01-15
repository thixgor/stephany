'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { FiArrowLeft, FiSave, FiCheck } from 'react-icons/fi';
import { FaDog, FaCat, FaFeatherAlt, FaPaw } from 'react-icons/fa';
import { GiTurtle, GiRabbit, GiRat } from 'react-icons/gi';
import PatientForm from '@/components/forms/PatientForm';
import { ANIMAL_SPECIES } from '@/types';

export default function NovoPaciente() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (payload: any) => {
        setIsLoading(true);

        try {
            const response = await fetch('/api/patients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                router.push('/admin/pacientes');
            } else {
                const data = await response.json();
                alert(data.error || 'Erro ao criar paciente');
            }
        } catch (error) {
            alert('Erro ao criar paciente');
        } finally {
            setIsLoading(false);
        }
    };

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
                    <h1 className="text-3xl font-bold text-[#00231F]">Cadastro de Paciente</h1>
                    <p className="text-gray-600">Preencha os dados do animal e do tutor</p>
                </div>
            </div>

            <PatientForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                onCancel={() => router.back()}
            />
        </div>
    );
}

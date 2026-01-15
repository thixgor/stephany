'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { FiSave, FiCheck } from 'react-icons/fi';
import { FaDog, FaCat, FaFeatherAlt, FaPaw } from 'react-icons/fa';
import { GiTurtle, GiRabbit, GiRat } from 'react-icons/gi';
import { ANIMAL_SPECIES } from '@/types';

// Categories mapping to icons and labels
const CATEGORIES = [
    { id: 'canino', label: 'Cão', icon: FaDog, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { id: 'felino', label: 'Gato', icon: FaCat, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    { id: 'ave', label: 'Ave', icon: FaFeatherAlt, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
    { id: 'reptil', label: 'Réptil', icon: GiTurtle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    { id: 'roedor', label: 'Roedor', icon: GiRat, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
    { id: 'lagomorfo', label: 'Coelho', icon: GiRabbit, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-200' },
    { id: 'silvestre', label: 'Silvestre', icon: FaPaw, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' },
    { id: 'outro', label: 'Outro', icon: FiCheck, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
];

const ALL_SPECIES_LIST = Object.values(ANIMAL_SPECIES).sort();

const SPECIFIC_SPECIES: Record<string, string[]> = {
    ave: ['Calopsita', 'Canário', 'Papagaio', 'Periquito', 'Arara', 'Agapornis', 'Cacatua', 'Mandarim', 'Curió'],
    reptil: ['Jabuti', 'Cágado', 'Iguana', 'Teiú', 'Corn Snake', 'Jiboia', 'Gecko', 'Pogona'],
    roedor: ['Hamster Sírio', 'Hamster Anão', 'Porquinho da Índia', 'Chinchila', 'Rato Twister', 'Gerbil', 'Camundongo'],
    lagomorfo: ['Coelho', 'Mini Coelho'],
    silvestre: ['Sagui', 'Gambá', 'Ouriço', 'Ferret (Furão)', 'Mico']
};

interface PatientFormProps {
    initialData?: any;
    onSubmit: (data: any) => Promise<void>;
    isLoading?: boolean;
    onCancel: () => void;
}

export default function PatientForm({ initialData, onSubmit, isLoading = false, onCancel }: PatientFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        species: '',
        breed: '',
        age: '',
        weight: '',
        color: '',
        microchip: '',
        tutorName: '',
        tutorCpf: '',
        tutorPhone: '',
        tutorEmail: '',
        notes: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                species: initialData.species || '',
                breed: initialData.breed || '',
                age: initialData.age || '',
                weight: initialData.weight?.toString() || '',
                color: initialData.color || '',
                microchip: initialData.microchip || '',
                tutorName: initialData.tutorName || '',
                tutorCpf: initialData.tutorCpf || '',
                tutorPhone: initialData.tutorPhone || '',
                tutorEmail: initialData.tutorEmail || '',
                notes: initialData.notes || '',
            });
        }
    }, [initialData]);

    const handleCategorySelect = (id: string) => {
        setFormData(prev => ({ ...prev, species: id }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            weight: formData.weight ? parseFloat(formData.weight) : undefined,
        };
        await onSubmit(payload);
    };

    const showBreedAutocomplete = ['ave', 'reptil', 'roedor', 'silvestre', 'outro'].includes(formData.species);

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Category Selection */}
            <section>
                <h3 className="text-lg font-bold text-[#00231F] mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#06695C] text-white flex items-center justify-center text-sm">1</span>
                    Selecione a Categoria
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleCategorySelect(cat.id)}
                            className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 ${formData.species === cat.id
                                ? `${cat.border} ${cat.bg} ring-2 ring-offset-2 ring-[#06695C]`
                                : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-md'
                                }`}
                        >
                            <cat.icon className={`text-4xl mb-3 ${formData.species === cat.id ? cat.color : 'text-gray-400'}`} />
                            <span className={`font-bold ${formData.species === cat.id ? 'text-[#00231F]' : 'text-gray-600'}`}>
                                {cat.label}
                            </span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Step 2: Animal Details */}
            {formData.species && (
                <section className="animate-fade-in text-left">
                    <h3 className="text-lg font-bold text-[#00231F] mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-[#06695C] text-white flex items-center justify-center text-sm">2</span>
                        Dados do {CATEGORIES.find(c => c.id === formData.species)?.label}
                    </h3>
                    <Card hover={false} className="p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                name="name"
                                label="Nome do Paciente"
                                placeholder="Ex: Rex"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {showBreedAutocomplete ? 'Espécie Específica' : 'Raça'}
                                </label>
                                <input
                                    list="breeds"
                                    name="breed"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#06695C] focus:border-transparent outline-none transition-all"
                                    placeholder={showBreedAutocomplete ? "Ex: Calopsita, Iguana..." : "Ex: Labrador, Siamês..."}
                                    value={formData.breed}
                                    onChange={handleChange}
                                />
                                {showBreedAutocomplete && (
                                    <datalist id="breeds">
                                        {(SPECIFIC_SPECIES[formData.species] || ALL_SPECIES_LIST).map(s => (
                                            <option key={s} value={s} />
                                        ))}
                                    </datalist>
                                )}
                            </div>

                            <Input
                                name="age"
                                label="Idade"
                                placeholder="Ex: 2 anos e 3 meses"
                                value={formData.age}
                                onChange={handleChange}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    name="weight"
                                    label="Peso (kg)"
                                    type="number"
                                    step="0.001"
                                    placeholder="0.000"
                                    value={formData.weight}
                                    onChange={handleChange}
                                />
                                <Input
                                    name="color"
                                    label="Pelagem/Cor"
                                    placeholder="Ex: Tigrado"
                                    value={formData.color}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </Card>
                </section>
            )}

            {/* Step 3: Tutor Details */}
            {formData.species && (
                <section className="animate-fade-in text-left">
                    <h3 className="text-lg font-bold text-[#00231F] mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-[#06695C] text-white flex items-center justify-center text-sm">3</span>
                        Dados do Tutor
                    </h3>
                    <Card hover={false} className="p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                name="tutorName"
                                label="Nome Completo"
                                value={formData.tutorName}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                name="tutorCpf"
                                label="CPF"
                                placeholder="000.000.000-00"
                                value={formData.tutorCpf}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                name="tutorPhone"
                                label="Whatsapp / Telefone"
                                placeholder="(21) 99999-9999"
                                value={formData.tutorPhone}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                name="tutorEmail"
                                label="Email (Opcional)"
                                type="email"
                                value={formData.tutorEmail}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mt-6">
                            <Textarea
                                name="notes"
                                label="Observações / Queixa Principal"
                                placeholder="Histórico clínico breve, comportamento, etc."
                                value={formData.notes}
                                onChange={handleChange}
                            />
                        </div>
                    </Card>
                </section>
            )}

            {/* Submit Action */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-40 flex justify-end gap-4 md:static md:bg-transparent md:border-0 md:p-0">
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    size="lg"
                    isLoading={isLoading}
                    disabled={!formData.species || !formData.name || !formData.tutorName}
                    leftIcon={<FiSave />}
                    className="shadow-xl"
                >
                    {initialData ? 'Salvar Alterações' : 'Salvar Cadastro'}
                </Button>
            </div>
        </form>
    );
}

'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Input, Select, Textarea, Checkbox } from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiSettings } from 'react-icons/fi';
import { FaSyringe, FaStethoscope, FaFlask, FaHome } from 'react-icons/fa';

interface Service {
    _id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    category: string;
    isActive: boolean;
}

const CATEGORIES = [
    { value: 'consulta', label: 'Consulta', icon: FaHome },
    { value: 'vacina', label: 'Vacina', icon: FaSyringe },
    { value: 'exame', label: 'Exame', icon: FaFlask },
    { value: 'procedimento', label: 'Procedimento', icon: FaStethoscope },
    { value: 'outro', label: 'Outro', icon: FiSettings },
];

export default function ServicosAdmin() {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        duration: '30',
        category: 'consulta',
        isActive: true,
    });

    const fetchServices = async () => {
        try {
            const res = await fetch('/api/services');
            const data = await res.json();
            if (data.services) setServices(data.services);
        } catch (error) {
            console.error('Erro ao buscar serviços', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleOpenModal = (service?: Service) => {
        if (service) {
            setEditingId(service._id);
            setFormData({
                name: service.name,
                description: service.description,
                price: service.price.toString(),
                duration: (service.duration || 30).toString(),
                category: service.category,
                isActive: service.isActive,
            });
        } else {
            setEditingId(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                duration: '30',
                category: 'consulta',
                isActive: true,
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const url = editingId ? `/api/services/${editingId}` : '/api/services';
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    duration: parseInt(formData.duration),
                }),
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchServices();
            } else {
                const data = await res.json();
                alert(data.error || 'Erro ao salvar serviço');
            }
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar serviço');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja remover este serviço?')) return;

        try {
            const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchServices();
            } else {
                alert('Erro ao remover serviço');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const filteredServices = services.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#00231F]">Gerenciar Serviços</h1>
                    <p className="text-gray-600">Cadastre e edite os serviços oferecidos.</p>
                </div>
                <Button onClick={() => handleOpenModal()} leftIcon={<FiPlus />}>
                    Novo Serviço
                </Button>
            </div>

            {/* Filters */}
            <Card hover={false} className="p-4">
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar serviço por nome ou categoria..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#06695C] focus:ring-1 focus:ring-[#06695C]/20 transition-all"
                    />
                </div>
            </Card>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <p className="text-gray-500 col-span-full text-center py-10">Carregando serviços...</p>
                ) : filteredServices.length === 0 ? (
                    <p className="text-gray-500 col-span-full text-center py-10">Nenhum serviço encontrado.</p>
                ) : (
                    filteredServices.map(service => {
                        const CatIcon = CATEGORIES.find(c => c.value === service.category)?.icon || FiSettings;
                        return (
                            <div key={service._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                                {!service.isActive && (
                                    <div className="absolute top-0 right-0 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-bl-lg font-bold">
                                        INATIVO
                                    </div>
                                )}
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${service.category === 'vacina' ? 'bg-blue-100 text-blue-600' :
                                        service.category === 'consulta' ? 'bg-green-100 text-green-600' :
                                            'bg-purple-100 text-purple-600'
                                        }`}>
                                        <CatIcon />
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleOpenModal(service)}
                                            className="p-2 text-gray-400 hover:text-[#06695C] hover:bg-[#06695C]/5 rounded-lg"
                                        >
                                            <FiEdit2 />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service._id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-[#00231F] mb-1">{service.name}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{service.description}</p>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <span className="text-sm text-gray-500">{service.duration} min</span>
                                    <span className="text-lg font-bold text-[#06695C]">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.price)}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? 'Editar Serviço' : 'Novo Serviço'}
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave} isLoading={isSaving}>Salvar</Button>
                    </>
                }
            >
                <form id="serviceForm" onSubmit={handleSave} className="space-y-4">
                    <Input
                        label="Nome do Serviço"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="Ex: Consulta Domiciliar"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Categoria"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            options={CATEGORIES}
                        />
                        <Input
                            label="Duração (min)"
                            type="number"
                            value={formData.duration}
                            onChange={e => setFormData({ ...formData, duration: e.target.value })}
                            required
                        />
                    </div>

                    <Input
                        label="Preço (R$)"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                        required
                        placeholder="0.00"
                    />

                    <Textarea
                        label="Descrição"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Descreva o que está incluso no serviço..."
                        rows={3}
                    />

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-4 h-4 text-[#06695C] rounded border-gray-300 focus:ring-[#06695C]"
                        />
                        <span className="text-sm font-medium text-gray-700">Serviço Ativo</span>
                    </label>
                </form>
            </Modal>
        </div>
    );
}

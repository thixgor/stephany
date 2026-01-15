'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { FaPaw } from 'react-icons/fa';
import Card from '@/components/ui/Card';
import { PawSkeleton } from '@/components/ui/PawLoader';

export default function MeusPetsPage() {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [pets, setPets] = useState<any[]>([]);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const res = await fetch('/api/patients');
                const data = await res.json();
                if (data.patients) {
                    setPets(data.patients);
                }
            } catch (error) {
                console.error('Error fetching pets:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (session) {
            fetchPets();
        }
    }, [session]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#00231F]">Meus Pets</h1>
                    <p className="text-gray-600">Confira as informações dos seus companheiros.</p>
                </div>
            </div>

            <PawSkeleton isLoading={isLoading}>
                {pets.length === 0 ? (
                    <Card className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-4">
                            <FaPaw size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Nenhum pet encontrado</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mt-2">
                            Seus pets serão listados aqui assim que forem cadastrados pela Dra. Stephany.
                        </p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pets.map((pet) => (
                            <Card key={pet._id} className="group">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 bg-[#06695C] rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-[#06695C]/20 group-hover:scale-110 transition-transform">
                                        <FaPaw />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-[#00231F] truncate">{pet.name}</h3>
                                        <p className="text-[#06695C] font-medium capitalize">{pet.species} {pet.breed ? `• ${pet.breed}` : ''}</p>
                                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500">Peso</p>
                                                <p className="font-semibold text-[#00231F]">{pet.weight ? `${pet.weight}kg` : '--'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Idade</p>
                                                <p className="font-semibold text-[#00231F]">{pet.age || '--'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Gênero</p>
                                                <p className="font-semibold text-[#00231F]">{pet.gender || '--'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Cor</p>
                                                <p className="font-semibold text-[#00231F] truncate">{pet.color || '--'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {pet.notes && (
                                    <div className="mt-6 pt-4 border-t border-gray-100">
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Observações</p>
                                        <p className="text-sm text-gray-600 line-clamp-2">{pet.notes}</p>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </PawSkeleton>

            {/* Help Card */}
            <Card className="bg-[#06695C]/5 border border-[#06695C]/10">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#06695C]/10 rounded-full flex items-center justify-center text-[#06695C]">
                        <FaPaw />
                    </div>
                    <p className="text-sm text-gray-600">
                        Alguma informação está incorreta? Entre em contato com a Dra. Stephany para solicitar a atualização dos dados do seu pet.
                    </p>
                </div>
            </Card>
        </div>
    );
}

'use client';

import { useSession } from 'next-auth/react';
import { FiUser, FiMail, FiPhone, FiLock, FiCalendar } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function MeuPerfilPage() {
    const { data: session } = useSession();

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-[#00231F]">Meu Perfil</h1>
                <p className="text-gray-600">Gerencie suas informações pessoais e de acesso.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left: Avatar & Info Summary */}
                <div className="space-y-6">
                    <Card className="text-center p-8">
                        <div className="w-24 h-24 bg-gradient-to-br from-[#06695C] to-[#0A8B7A] rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 border-4 border-white shadow-xl">
                            {session?.user?.name?.charAt(0) || 'C'}
                        </div>
                        <h2 className="text-lg font-bold text-[#00231F]">{session?.user?.name}</h2>
                        <p className="text-sm text-gray-500 capitalize">{session?.user?.role === 'temp' ? 'Acesso Temporário' : 'Cliente'}</p>

                        {session?.user?.role === 'temp' && (
                            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                <p className="text-xs text-yellow-700 font-medium leading-relaxed">
                                    Seu acesso é baseado no protocolo de atendimento. Registre-se para manter um histórico permanente.
                                </p>
                            </div>
                        )}
                    </Card>

                    <Card className="p-6">
                        <h3 className="font-bold text-[#00231F] mb-4 flex items-center gap-2">
                            <FiCalendar className="text-[#06695C]" />
                            Resumo da Conta
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Tipo:</span>
                                <span className="font-semibold text-[#00231F] capitalize">{session?.user?.role}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">ID da Conta:</span>
                                <span className="font-semibold text-[#00231F]">#{session?.user?.id?.substring(0, 8)}...</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right: Detailed Form/Info */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="p-8">
                        <h3 className="text-lg font-bold text-[#00231F] mb-6 border-b pb-4">Dados Pessoais</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Nome Completo</label>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                    <FiUser className="text-gray-400" />
                                    <span className="text-[#00231F] font-semibold">{session?.user?.name || 'Não informado'}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">E-mail</label>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                    <FiMail className="text-gray-400" />
                                    <span className="text-[#00231F] font-semibold truncate">{session?.user?.email || 'Não informado'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <h4 className="font-bold text-[#00231F] mb-4 flex items-center gap-2">
                                <FiLock className="text-[#06695C]" />
                                Alterar Senha
                            </h4>
                            <p className="text-sm text-gray-600 mb-6">
                                {session?.user?.role === 'temp'
                                    ? 'Acessos via protocolo possuem senhas temporárias geradas automaticamente.'
                                    : 'Deseja mudar sua senha de acesso?'}
                            </p>

                            {session?.user?.role !== 'temp' && (
                                <Button variant="secondary" className="w-full sm:w-auto">
                                    Solicitar Redefinição de Senha
                                </Button>
                            )}
                        </div>
                    </Card>

                    <Card className="p-8 border-l-4 border-[#06695C]">
                        <h3 className="text-lg font-bold text-[#00231F] mb-4">Privacidade e Suporte</h3>
                        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                            Seus dados estão protegidos e são utilizados exclusivamente para o gerenciamento clínico dos seus pets pela Dra. Stephany Rodrigues.
                        </p>
                        <Link href="/sobre" className="text-[#06695C] font-semibold hover:underline text-sm">
                            Conheça nossa política de privacidade →
                        </Link>
                    </Card>
                </div>
            </div>
        </div>
    );
}

import Link from 'next/link';

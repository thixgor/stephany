'use client';

import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiLoader } from 'react-icons/fi';

interface AccessPageProps {
    params: Promise<{ hash: string }>;
}

export default function AccessPage({ params }: AccessPageProps) {
    const router = useRouter();
    const [hash, setHash] = useState<string>('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        params.then(p => setHash(p.hash));
    }, [params]);

    useEffect(() => {
        if (!hash) return;

        const accessViaHash = async () => {
            try {
                setIsLoading(true);
                setError('');

                const res = await fetch('/api/auth/hash', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ hash }),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Link de acesso inválido ou expirado');
                }

                const result = await signIn('credentials', {
                    email: data.email,
                    password: data.password,
                    redirect: false,
                });

                if (result?.error) {
                    throw new Error('Erro ao autenticar');
                }

                router.push('/dashboard');
                router.refresh();

            } catch (err) {
                setError((err as Error).message || 'Ocorreu um erro ao acessar o atendimento');
                setIsLoading(false);
            }
        };

        accessViaHash();
    }, [hash, router]);

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#FAF8F5] to-white">
            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <Image
                        src="https://i.imgur.com/6LGQ8oY.png"
                        alt="Stephany Rodrigues Medicina Veterinária"
                        width={180}
                        height={60}
                        className="mx-auto drop-shadow-sm object-contain mb-6"
                    />
                    <h1 className="text-3xl font-bold text-[#00231F]">Acesso Automático</h1>
                    <p className="text-gray-600 mt-2">Carregando suas informações...</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-[#06695C] border-t-transparent rounded-full animate-spin"></div>
                                <FiLoader className="absolute inset-0 m-auto w-6 h-6 text-[#06695C] animate-pulse" />
                            </div>
                            <p className="mt-6 text-gray-600 font-medium">Autenticando...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <p className="text-red-600 font-medium mb-6">{error}</p>
                            <a href="/acesso-protocolo" className="inline-block px-6 py-3 bg-[#06695C] text-white rounded-xl font-semibold hover:bg-[#00231F] transition-colors">
                                Voltar para acesso
                            </a>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

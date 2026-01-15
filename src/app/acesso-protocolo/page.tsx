'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiHash, FiArrowRight } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ProtocolAccessPage() {
    const router = useRouter();
    const [protocol, setProtocol] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!protocol.trim()) return;

        setIsLoading(true);
        setError('');

        try {
            // 1. Validate protocol and get temp credentials
            const res = await fetch('/api/auth/protocol', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ protocol }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Erro ao validar protocolo');
            }

            // 2. Sign in with returned credentials
            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                throw new Error('Erro ao autenticar com o protocolo');
            }

            // 3. Redirect
            router.push('/dashboard');
            router.refresh();

        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro. Verifique o protocolo e tente novamente.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#FAF8F5] to-white">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <svg className="absolute top-[10%] right-[10%] w-32 h-32 text-[#06695C] opacity-5 rotate-12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                </svg>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-10">
                    <Link href="/">
                        <Image
                            src="https://i.imgur.com/TS2KcZh.png"
                            alt="Stephany Rodrigues Medicina Veterinária"
                            width={180}
                            height={60}
                            className="mx-auto drop-shadow-sm object-contain mb-6"
                        />
                    </Link>
                    <h1 className="text-3xl font-bold text-[#00231F]">Acesso Rápido</h1>
                    <p className="text-gray-600 mt-2">Visualize seu atendimento com o número do protocolo</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-[#06695C]/5 p-4 rounded-xl border border-[#06695C]/10 mb-6">
                            <p className="text-sm text-[#06695C] text-center">
                                Não precisa de cadastro! Basta digitar o código fornecido no seu atendimento.
                            </p>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center justify-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Input
                                label="Número do Protocolo"
                                placeholder="Ex: P-123456"
                                value={protocol}
                                onChange={(e) => setProtocol(e.target.value)}
                                className="text-center text-lg tracking-wider uppercase font-bold"
                                required
                                leftIcon={<FiHash />}
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full h-14 text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                            isLoading={isLoading}
                        >
                            Acessar Atendimento <FiArrowRight className="ml-2" />
                        </Button>
                    </form>

                    <div className="mt-8 text-center border-t border-gray-100 pt-6">
                        <Link href="/login" className="text-gray-500 hover:text-[#06695C] transition-colors text-sm font-medium">
                            Já tem uma conta? Fazer login
                        </Link>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors text-sm">
                        ← Voltar para o site
                    </Link>
                </div>
            </div>
        </div>
    );
}

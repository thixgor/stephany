'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                if (result.error === 'CredentialsSignin') {
                    setError('Email ou senha incorretos.');
                } else {
                    setError('Ocorreu um erro ao fazer login. Tente novamente.');
                }
            } else {
                // Redirect based on user role (will be handled by middleware)
                router.push('/dashboard');
                router.refresh();
            }
        } catch (err) {
            setError('Erro ao fazer login. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#FAF8F5] to-white">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <svg className="absolute top-[15%] left-[10%] w-20 h-20 text-[#06695C] opacity-5 rotate-[-15deg]" viewBox="0 0 24 24" fill="currentColor">
                    <ellipse cx="12" cy="15" rx="5" ry="4.5" />
                    <ellipse cx="6" cy="8" rx="2.5" ry="3" />
                    <ellipse cx="18" cy="8" rx="2.5" ry="3" />
                    <ellipse cx="7.5" cy="13" rx="2" ry="2.5" transform="rotate(-20 7.5 13)" />
                    <ellipse cx="16.5" cy="13" rx="2" ry="2.5" transform="rotate(20 16.5 13)" />
                </svg>
                <svg className="absolute bottom-[20%] right-[15%] w-24 h-24 text-[#06695C] opacity-5 rotate-[20deg]" viewBox="0 0 24 24" fill="currentColor">
                    <ellipse cx="12" cy="15" rx="5" ry="4.5" />
                    <ellipse cx="6" cy="8" rx="2.5" ry="3" />
                    <ellipse cx="18" cy="8" rx="2.5" ry="3" />
                    <ellipse cx="7.5" cy="13" rx="2" ry="2.5" transform="rotate(-20 7.5 13)" />
                    <ellipse cx="16.5" cy="13" rx="2" ry="2.5" transform="rotate(20 16.5 13)" />
                </svg>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/">
                        <Image
                            src="https://i.imgur.com/TS2KcZh.png"
                            alt="Stephany Rodrigues Medicina Veterinária"
                            width={200}
                            height={70}
                            className="mx-auto drop-shadow-lg object-contain"
                        />
                    </Link>
                    <h1 className="text-2xl font-bold text-[#00231F] mt-4">Bem-vindo(a) de volta!</h1>
                    <p className="text-gray-600 mt-2">Acesse sua conta para continuar</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">

                    {/* Protocol Access Highlight */}
                    <div className="mb-8 bg-[#06695C]/5 rounded-xl p-5 border border-[#06695C]/10 text-center">
                        <h2 className="text-[#06695C] font-bold text-lg mb-2">Acompanhe seu Pet</h2>
                        <p className="text-sm text-gray-600 mb-4">Tem um número de protocolo? Acesse sem cadastro.</p>
                        <Link
                            href="/acesso-protocolo"
                            className="block w-full py-3 px-4 bg-white border-2 border-[#06695C] text-[#06695C] font-bold rounded-lg hover:bg-[#06695C] hover:text-white transition-all shadow-sm"
                        >
                            Acessar com Protocolo
                        </Link>
                    </div>

                    <div className="relative flex items-center gap-4 mb-8">
                        <div className="h-px bg-gray-200 flex-1"></div>
                        <span className="text-gray-400 text-sm font-medium">OU ACESSO LOGADO</span>
                        <div className="h-px bg-gray-200 flex-1"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <Input
                            type="email"
                            label="Email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            leftIcon={<FiMail />}
                            required
                        />

                        <div className="relative">
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                label="Senha"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                leftIcon={<FiLock />}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                            </button>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full"
                            isLoading={isLoading}
                        >
                            Entrar
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Não tem uma conta?{' '}
                            <Link href="/register" className="text-[#06695C] font-semibold hover:underline">
                                Cadastre-se
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to home */}
                <div className="text-center mt-6">
                    <Link href="/" className="text-gray-500 hover:text-[#06695C] transition-colors text-sm">
                        ← Voltar para o site
                    </Link>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiPhone } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem');
            setIsLoading(false);
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Erro ao criar conta');
                return;
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err) {
            setError('Erro ao criar conta. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#FAF8F5] to-white">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <svg className="absolute top-[15%] right-[10%] w-20 h-20 text-[#06695C] opacity-5 rotate-[15deg]" viewBox="0 0 24 24" fill="currentColor">
                    <ellipse cx="12" cy="15" rx="5" ry="4.5" />
                    <ellipse cx="6" cy="8" rx="2.5" ry="3" />
                    <ellipse cx="18" cy="8" rx="2.5" ry="3" />
                    <ellipse cx="7.5" cy="13" rx="2" ry="2.5" transform="rotate(-20 7.5 13)" />
                    <ellipse cx="16.5" cy="13" rx="2" ry="2.5" transform="rotate(20 16.5 13)" />
                </svg>
                <svg className="absolute bottom-[20%] left-[15%] w-24 h-24 text-[#06695C] opacity-5 rotate-[-20deg]" viewBox="0 0 24 24" fill="currentColor">
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
                            src="https://i.imgur.com/6LGQ8oY.png"
                            alt="Stephany Rodrigues Medicina Veterinária"
                            width={200}
                            height={70}
                            className="mx-auto drop-shadow-lg object-contain"
                        />
                    </Link>
                    <h1 className="text-2xl font-bold text-[#00231F] mt-4">Crie sua conta</h1>
                    <p className="text-gray-600 mt-2">Acesse o histórico do seu pet</p>
                </div>

                {/* Register Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {success ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-[#00231F] mb-2">Conta criada com sucesso!</h2>
                            <p className="text-gray-600">Redirecionando para o login...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                    {error}
                                </div>
                            )}

                            <Input
                                type="text"
                                name="name"
                                label="Nome completo"
                                placeholder="Seu nome"
                                value={formData.name}
                                onChange={handleChange}
                                leftIcon={<FiUser />}
                                required
                            />

                            <Input
                                type="email"
                                name="email"
                                label="Email"
                                placeholder="seu@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                leftIcon={<FiMail />}
                                required
                            />

                            <Input
                                type="tel"
                                name="phone"
                                label="Telefone (opcional)"
                                placeholder="(21) 99999-9999"
                                value={formData.phone}
                                onChange={handleChange}
                                leftIcon={<FiPhone />}
                            />

                            <div className="relative">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    label="Senha"
                                    placeholder="Mínimo 6 caracteres"
                                    value={formData.password}
                                    onChange={handleChange}
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

                            <Input
                                type={showPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                label="Confirmar senha"
                                placeholder="Digite a senha novamente"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                leftIcon={<FiLock />}
                                required
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full"
                                isLoading={isLoading}
                            >
                                Criar Conta
                            </Button>
                        </form>
                    )}

                    {!success && (
                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                Já tem uma conta?{' '}
                                <Link href="/login" className="text-[#06695C] font-semibold hover:underline">
                                    Faça login
                                </Link>
                            </p>
                        </div>
                    )}
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

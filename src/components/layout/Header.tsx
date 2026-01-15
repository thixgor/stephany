'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { FaPaw } from 'react-icons/fa';
import Button from '../ui/Button';
import { useSession, signOut } from 'next-auth/react';

const navLinks = [
    { href: '/', label: 'Início', public: true },
    { href: '/servicos', label: 'Serviços', public: true },
    { href: '/sobre', label: 'Sobre', public: true },
];

export default function Header() {
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    // Admin links
    const adminLinks = [
        { href: '/admin', label: 'Dashboard' },
        { href: '/admin/agenda', label: 'Agenda' },
        { href: '/admin/pacientes', label: 'Pacientes' },
        { href: '/admin/atendimentos', label: 'Atendimentos' },
        { href: '/admin/parametros', label: 'Parâmetros' }, // New link
    ];

    const currentLinks = session?.user?.role === 'admin' ? adminLinks : navLinks;

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/95 backdrop-blur-md shadow-md py-3'
                : 'bg-transparent py-4'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <Image
                        src="https://i.imgur.com/6LGQ8oY.png"
                        alt="Stephany Rodrigues Medicina Veterinária"
                        width={140}
                        height={46}
                        className="h-8 w-auto sm:h-9 md:h-10 drop-shadow-sm object-contain"
                        priority
                        onContextMenu={(e) => e.preventDefault()}
                    />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {currentLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`relative font-medium transition-colors duration-300 ${pathname === link.href
                                ? 'text-[#06695C]'
                                : 'text-[#00231F] hover:text-[#06695C]'
                                } after:content-[""] after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:bg-[#06695C] after:transition-all after:duration-300 ${pathname === link.href ? 'after:w-full' : 'after:w-0 hover:after:w-full'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-3">
                    {session ? (
                        <div className="flex items-center gap-4">
                            <div className="text-sm font-medium text-[#00231F]">
                                Olá, {session.user.name?.split(' ')[0]}
                            </div>

                            {session.user.role !== 'admin' && (
                                <Link href="/cliente">
                                    <Button variant="ghost" size="sm" leftIcon={<FaPaw />}>
                                        Minha Área
                                    </Button>
                                </Link>
                            )}

                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                                title="Sair"
                            >
                                <FiLogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" size="sm" leftIcon={<FiUser />}>
                                    Entrar
                                </Button>
                            </Link>

                            <Link href="https://wa.me/5521975787940" target="_blank">
                                <Button variant="whatsapp" size="sm">
                                    Agendar Consulta
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#00231F] hover:text-[#06695C] transition-colors"
                    aria-label="Menu"
                >
                    {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-100">
                    <nav className="flex flex-col py-4">
                        {currentLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-6 py-3 font-medium transition-colors ${pathname === link.href
                                    ? 'text-[#06695C] bg-[#06695C]/5'
                                    : 'text-[#00231F] hover:bg-gray-50'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="px-6 py-4 border-t border-gray-100 mt-2 flex flex-col gap-3">
                            {session ? (
                                <>
                                    {session.user.role !== 'admin' && (
                                        <Link href="/cliente">
                                            <Button variant="secondary" className="w-full" leftIcon={<FaPaw />}>
                                                Minha Área
                                            </Button>
                                        </Link>
                                    )}
                                    <Button
                                        variant="ghost"
                                        className="w-full text-red-600 border border-red-100"
                                        leftIcon={<FiLogOut />}
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                    >
                                        Sair da Conta
                                    </Button>
                                </>
                            ) : (
                                <Link href="/login">
                                    <Button variant="secondary" className="w-full" leftIcon={<FiUser />}>
                                        Entrar
                                    </Button>
                                </Link>
                            )}
                            <Link href="https://wa.me/5521975787940" target="_blank">
                                <Button variant="whatsapp" className="w-full">
                                    Agendar Consulta
                                </Button>
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}

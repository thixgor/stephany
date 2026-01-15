'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import {
    FiHome,
    FiCalendar,
    FiUsers,
    FiFileText,
    FiSettings,
    FiLogOut,
    FiMenu,
    FiX,
    FiGrid,
    FiClipboard,
    FiSearch,
} from 'react-icons/fi';
import { FaCalculator, FaPaw } from 'react-icons/fa';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();
    const { data: session } = useSession();

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: FiGrid },
        { name: 'Agenda', href: '/admin/agenda', icon: FiCalendar },
        { name: 'Atendimentos', href: '/admin/atendimentos', icon: FiClipboard },
        { name: 'Pacientes', href: '/admin/pacientes', icon: FaPaw },
        { name: 'Laudos', href: '/admin/laudos', icon: FiFileText },
        { name: 'Serviços', href: '/admin/servicos', icon: FiSettings },
        { name: 'Parâmetros', href: '/admin/parametros', icon: FaCalculator },
    ];

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/' });
    };

    return (
        <div className="min-h-screen bg-[#FAF8F5]">
            {/* Top Navigation */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4 lg:px-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="lg:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-600 hover:text-[#06695C] transition-colors"
                        aria-label="Menu"
                    >
                        {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                    <Link href="/admin" className="flex items-center">
                        <Image
                            src="https://i.imgur.com/TS2KcZh.png"
                            alt="Logo"
                            width={140}
                            height={45}
                            className="object-contain"
                        />
                    </Link>
                </div>

                {/* Search */}
                <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
                    <div className="relative w-full">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar paciente ou tutor..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#06695C] focus:ring-1 focus:ring-[#06695C]/20"
                        />
                    </div>
                </div>

                {/* User Menu */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="text-sm text-gray-600 hover:text-[#06695C] transition-colors hidden sm:block"
                    >
                        Ver site
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#06695C] to-[#0A8B7A] rounded-full flex items-center justify-center text-white font-semibold">
                            {session?.user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="hidden lg:block">
                            <p className="text-sm font-semibold text-[#00231F]">{session?.user?.name || 'Admin'}</p>
                            <p className="text-xs text-gray-500">{session?.user?.email}</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Sidebar */}
            <aside
                className={`fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-40 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                <nav className="p-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive
                                    ? 'bg-[#06695C] text-white'
                                    : 'text-gray-600 hover:bg-[#06695C]/10 hover:text-[#06695C]'
                                    }`}
                            >
                                <item.icon size={20} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all"
                    >
                        <FiLogOut size={20} />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Mobile sidebar overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="pt-16 lg:pl-64">
                <div className="p-3 sm:p-4 lg:p-8">{children}</div>
            </main>
        </div>
    );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiPhone, FiMapPin, FiMail, FiHeart } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#00231F] text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Section */}
                    <div>
                        <Link href="/" className="inline-block mb-6">
                            <Image
                                src="https://i.imgur.com/6LGQ8oY.png"
                                alt="Stephany Rodrigues Medicina Veterinária"
                                width={180}
                                height={60}
                                className="brightness-0 invert drop-shadow-lg"
                                onContextMenu={(e) => e.preventDefault()}
                            />
                        </Link>
                        <p className="text-white/70 text-sm leading-relaxed">
                            Atendimento veterinário domiciliar com carinho e profissionalismo. Cuidando do seu pet no conforto do lar.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Links Rápidos</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/" className="text-white/70 hover:text-white transition-colors">
                                    Início
                                </Link>
                            </li>
                            <li>
                                <Link href="/sobre" className="text-white/70 hover:text-white transition-colors">
                                    Sobre a Dra. Stephany
                                </Link>
                            </li>
                            <li>
                                <Link href="/login" className="text-white/70 hover:text-white transition-colors">
                                    Área do Cliente
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Serviços</h3>
                        <ul className="space-y-3">
                            <li className="text-white/70">Consultas Domiciliares</li>
                            <li className="text-white/70">Vacinação</li>
                            <li className="text-white/70">Pets Exóticos</li>
                            <li className="text-white/70">Microchipagem</li>
                            <li className="text-white/70">Coleta de Exames</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Contato</h3>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3">
                                <FaWhatsapp className="text-[#25D366] text-xl flex-shrink-0" />
                                <a
                                    href="https://wa.me/5521975787940"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white/70 hover:text-white transition-colors"
                                >
                                    (21) 97578-7940
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <FiPhone className="text-[#0A8B7A] text-xl flex-shrink-0" />
                                <span className="text-white/70">(21) 97578-7940</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FiMapPin className="text-[#0A8B7A] text-xl flex-shrink-0" />
                                <span className="text-white/70">Rio de Janeiro, RJ</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FiMail className="text-[#0A8B7A] text-xl flex-shrink-0" />
                                <span className="text-white/70">stehrodrig@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Professional Info */}
                <div className="mt-12 pt-8 border-t border-white/10">
                    <div className="text-center mb-6">
                        <p className="text-white/90 font-semibold">Dra. Stephany Rodrigues</p>
                        <p className="text-white/60 text-sm">CRMV-RJ: 22404</p>
                        <p className="text-white/60 text-sm">Pós-graduanda em Clínica Médica e Cirúrgica de Animais Selvagens e Exóticos</p>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <p className="text-white/50 text-sm flex items-center justify-center gap-1">
                        © {currentYear} Stephany Rodrigues Medicina Veterinária. Feito com
                        <FiHeart className="text-red-400 animate-pulse" />
                        para os pets.
                    </p>
                </div>
            </div>
        </footer>
    );
}

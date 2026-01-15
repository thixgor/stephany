'use client';

import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppButton() {
    const phoneNumber = '5521975787940';
    const message = encodeURIComponent(
        'Olá, Dra. Stephany! Gostaria de agendar uma consulta domiciliar para o meu pet. 🐾'
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
        fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50
        w-14 h-14 sm:w-16 sm:h-16 rounded-full
        bg-gradient-to-br from-[#25D366] to-[#128C7E]
        flex items-center justify-center
        text-white text-2xl sm:text-3xl
        shadow-xl transition-all duration-300
        active:scale-95 hover:scale-110 hover:shadow-2xl hover:shadow-[#25D366]/30
        group touch-manipulation
      "
            aria-label="Contato via WhatsApp"
        >
            <FaWhatsapp />

            {/* Pulse animation */}
            <span className="absolute w-full h-full rounded-full bg-[#25D366] animate-ping opacity-30" />

            {/* Tooltip - hidden on mobile */}
            <span className="
        hidden sm:block absolute right-full mr-3 px-4 py-2 rounded-lg
        bg-white text-[#00231F] text-sm font-medium
        shadow-lg whitespace-nowrap
        opacity-0 group-hover:opacity-100
        transition-opacity duration-300
        pointer-events-none
      ">
                Agende pelo WhatsApp!
            </span>
        </a>
    );
}

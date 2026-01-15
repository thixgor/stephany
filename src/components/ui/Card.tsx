'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    noPadding?: boolean;
}

export default function Card({ children, className, hover = true, noPadding = false }: CardProps) {
    return (
        <div
            className={cn(
                'bg-white rounded-2xl shadow-md relative overflow-hidden',
                'before:content-[""] before:absolute before:top-0 before:left-0 before:right-0',
                'before:h-1 before:bg-gradient-to-r before:from-[#06695C] before:to-[#0A8B7A]',
                hover && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
                !noPadding && 'p-6',
                className
            )}
        >
            {children}
        </div>
    );
}

// Service card with icon
interface ServiceCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    className?: string;
}

export function ServiceCard({ icon, title, description, className }: ServiceCardProps) {
    return (
        <Card className={cn('text-center', className)}>
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#06695C]/10 to-[#06695C]/5 rounded-full flex items-center justify-center text-3xl text-[#06695C]">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-[#00231F] mb-2">{title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </Card>
    );
}

// Stat card for dashboard
interface StatCardProps {
    icon: ReactNode;
    value: string | number;
    label: string;
    variant?: 'primary' | 'success' | 'warning' | 'info';
    className?: string;
}

export function StatCard({ icon, value, label, variant = 'primary', className }: StatCardProps) {
    const variantStyles = {
        primary: 'bg-[#06695C]/10 text-[#06695C]',
        success: 'bg-emerald-100 text-emerald-600',
        warning: 'bg-amber-100 text-amber-600',
        info: 'bg-blue-100 text-blue-600',
    };

    return (
        <Card className={cn('', className)} hover={false}>
            <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3', variantStyles[variant])}>
                {icon}
            </div>
            <div className="text-3xl font-bold text-[#00231F] mb-1">{value}</div>
            <div className="text-gray-500 text-sm">{label}</div>
        </Card>
    );
}

// Testimonial card
interface TestimonialCardProps {
    text: string;
    author: string;
    pet: string;
    initials: string;
    className?: string;
}

export function TestimonialCard({ text, author, pet, initials, className }: TestimonialCardProps) {
    return (
        <Card className={cn('relative pt-10', className)}>
            <span className="absolute top-4 left-6 text-5xl text-[#06695C]/20 font-serif">&ldquo;</span>
            <p className="text-gray-600 italic mb-6 leading-relaxed">{text}</p>
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#06695C] to-[#0A8B7A] flex items-center justify-center text-white font-bold">
                    {initials}
                </div>
                <div>
                    <h4 className="font-semibold text-[#00231F]">{author}</h4>
                    <p className="text-gray-500 text-sm">Tutor(a) de {pet}</p>
                </div>
            </div>
        </Card>
    );
}

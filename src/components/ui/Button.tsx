'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import PawLoader from './PawLoader';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'whatsapp' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            leftIcon,
            rightIcon,
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-semibold rounded-xl border-none cursor-pointer
      transition-all duration-300 ease-out
      disabled:opacity-50 disabled:cursor-not-allowed
      focus:outline-none focus:ring-2 focus:ring-offset-2
    `;

        const variants = {
            primary: `
        bg-gradient-to-br from-[#06695C] to-[#00231F]
        text-white shadow-md
        hover:shadow-lg hover:-translate-y-0.5
        focus:ring-[#06695C]
      `,
            secondary: `
        bg-white text-[#06695C] border-2 border-[#06695C]
        hover:bg-[#06695C] hover:text-white
        focus:ring-[#06695C]
      `,
            whatsapp: `
        bg-gradient-to-br from-[#25D366] to-[#128C7E]
        text-white shadow-md
        hover:shadow-lg hover:-translate-y-0.5
        focus:ring-[#25D366]
      `,
            danger: `
        bg-gradient-to-br from-[#EF4444] to-[#DC2626]
        text-white shadow-md
        hover:shadow-lg hover:-translate-y-0.5
        focus:ring-[#EF4444]
      `,
            ghost: `
        bg-transparent text-[#06695C]
        hover:bg-[#06695C]/10
        focus:ring-[#06695C]
      `,
        };

        const sizes = {
            sm: 'px-4 py-2.5 text-sm min-h-[44px]', // Minimum touch target 44x44px
            md: 'px-6 py-3 text-base min-h-[44px]',
            lg: 'px-8 py-4 text-lg min-h-[48px]',
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <PawLoader size="sm" />
                ) : (
                    <>
                        {leftIcon}
                        {children}
                        {rightIcon}
                    </>
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;

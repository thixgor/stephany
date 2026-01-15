'use client';

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, leftIcon, rightIcon, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block mb-2 font-semibold text-[#00231F]">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {leftIcon}
                        </span>
                    )}
                    <input
                        ref={ref}
                        className={cn(
                            'w-full px-4 py-3.5 text-base min-h-[44px]',
                            'border-2 border-gray-200 rounded-xl',
                            'bg-white transition-all duration-300',
                            'focus:outline-none focus:border-[#06695C] focus:ring-2 focus:ring-[#06695C]/10',
                            'disabled:bg-gray-100 disabled:cursor-not-allowed',
                            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
                            leftIcon && 'pl-10',
                            rightIcon && 'pr-10',
                            className
                        )}
                        {...props}
                    />
                    {rightIcon && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {rightIcon}
                        </span>
                    )}
                </div>
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';

// Textarea component
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block mb-2 font-semibold text-[#00231F]">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className={cn(
                        'w-full px-4 py-3.5 text-base min-h-[120px] resize-y',
                        'border-2 border-gray-200 rounded-xl',
                        'bg-white transition-all duration-300',
                        'focus:outline-none focus:border-[#06695C] focus:ring-2 focus:ring-[#06695C]/10',
                        'disabled:bg-gray-100 disabled:cursor-not-allowed',
                        error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
                        className
                    )}
                    {...props}
                />
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

// Select component
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, options, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block mb-2 font-semibold text-[#00231F]">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <select
                    ref={ref}
                    className={cn(
                        'w-full px-4 py-3.5 text-base appearance-none min-h-[44px]',
                        'border-2 border-gray-200 rounded-xl',
                        'bg-white transition-all duration-300',
                        'focus:outline-none focus:border-[#06695C] focus:ring-2 focus:ring-[#06695C]/10',
                        'disabled:bg-gray-100 disabled:cursor-not-allowed',
                        'bg-[url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")] bg-[length:1.5em_1.5em] bg-[right_0.5rem_center] bg-no-repeat pr-10',
                        error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
                        className
                    )}
                    {...props}
                >
                    <option value="">Selecione...</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        );
    }
);

Select.displayName = 'Select';

// Checkbox component
interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, label, ...props }, ref) => {
        return (
            <label className="flex items-center gap-3 cursor-pointer group">
                <input
                    ref={ref}
                    type="checkbox"
                    className={cn(
                        'w-5 h-5 rounded border-2 border-gray-300',
                        'text-[#06695C] focus:ring-[#06695C] focus:ring-offset-0',
                        'cursor-pointer transition-all duration-200',
                        'checked:bg-[#06695C] checked:border-[#06695C]',
                        className
                    )}
                    {...props}
                />
                <span className="text-gray-700 group-hover:text-[#00231F] transition-colors">
                    {label}
                </span>
            </label>
        );
    }
);

Checkbox.displayName = 'Checkbox';

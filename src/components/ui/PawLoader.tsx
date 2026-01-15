'use client';

// Paw Icon SVG
const PawIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <ellipse cx="12" cy="15" rx="5" ry="4.5" />
        <ellipse cx="6" cy="8" rx="2.5" ry="3" />
        <ellipse cx="18" cy="8" rx="2.5" ry="3" />
        <ellipse cx="7.5" cy="13" rx="2" ry="2.5" transform="rotate(-20 7.5 13)" />
        <ellipse cx="16.5" cy="13" rx="2" ry="2.5" transform="rotate(20 16.5 13)" />
    </svg>
);

interface PawLoaderProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export default function PawLoader({ size = 'md', className = '' }: PawLoaderProps) {
    const sizeMap = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    const s = sizeMap[size];

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <PawIcon className={`${s} text-[#06695C] animate-[bounce_1s_infinite]`} />
            <PawIcon className={`${s} text-[#06695C]/60 animate-[bounce_1s_infinite_100ms]`} />
            <PawIcon className={`${s} text-[#06695C]/40 animate-[bounce_1s_infinite_200ms]`} />
        </div>
    );
}

// Skeleton wrapper
export function PawSkeleton({ children, isLoading, className = '' }: { children: React.ReactNode; isLoading: boolean; className?: string }) {
    if (isLoading) {
        return (
            <div className={`flex flex-col items-center justify-center p-12 min-h-[300px] ${className}`}>
                <PawLoader size="lg" />
                <p className="mt-4 text-gray-400 font-medium animate-pulse">Carregando...</p>
            </div>
        );
    }
    return <>{children}</>;
}

// Full screen loader
export function PageLoader() {
    return (
        <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center">
                <PawLoader size="xl" />
                <p className="mt-6 text-[#06695C] font-bold text-lg animate-pulse">Dra. Pet...</p>
            </div>
        </div>
    );
}

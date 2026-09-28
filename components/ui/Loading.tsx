'use client';

export interface LoadingProps {
    message?: string;
    fullScreen?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizeConfig = {
    sm: {
        text: 'text-xs',
        spacing: 'gap-2',
    },
    md: {
        text: 'text-sm',
        spacing: 'gap-3.5',
    },
    lg: {
        text: 'text-base',
        spacing: 'gap-4',
    },
};

export const Loading = ({
    message = 'Looping your stitches...',
    fullScreen = true,
    size = 'md',
    className = '',
}: LoadingProps) => {
    const config = sizeConfig[size];

    return (
        <div
            role="status"
            aria-live="polite"
            className={`flex flex-col items-center justify-center antialiased ${
                fullScreen
                    ? `fixed inset-0 h-screen w-screen overflow-hidden
                        backdrop-blur-lg`
                    : 'w-full py-8'
                } ${config.spacing} ${className}`}
        >
            <div className="loader" />
            <p className="font-comfortaa text-2xl! mb-0! font-black">
                loopo<span className="loopo-dot"></span>
            </p>
            {message && <p className={`lead ${config.text}`}>{message}</p>}
        </div>
    );
};

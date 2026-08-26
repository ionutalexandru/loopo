import React from 'react';

type CardVariant = 'elevated' | 'flat' | 'bordered';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: CardVariant;
    width?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    children: React.ReactNode;
}

export const Card = ({
    variant = 'elevated',
    children,
    className = '',
    width = 'full',
    ...props
}: CardProps) => {
    const variantStyles: Record<CardVariant, string> = {
        elevated: 'bg-pure-wool shadow-md hover:shadow-lg',
        flat: 'bg-pure-wool',
        bordered: 'bg-pure-wool border-2 border-chalk-gray',
    };

    return (
        <section
            className={`w-${width} rounded-2xl px-4 py-5 transition-all md:px-6
                md:py-8 ${variantStyles[variant]} ${className}`}
            {...props}
        >
            {children}
        </section>
    );
};

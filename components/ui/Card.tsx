import React from 'react';

type CardVariant = 'elevated' | 'flat' | 'bordered';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: React.ReactNode;
}

export const Card = ({
  variant = 'elevated',
  children,
  className = '',
  ...props
}: CardProps) => {
  const variantStyles: Record<CardVariant, string> = {
    elevated: 'bg-pure-wool shadow-xs',
    flat: 'bg-pure-wool',
    bordered: 'bg-pure-wool border-2 border-chalk-gray',
  };

  return (
    <div
      className={`rounded-2xl px-4 py-5 transition-all md:px-6 md:py-8 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

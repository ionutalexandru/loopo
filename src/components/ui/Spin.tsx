import { LoaderCircle } from 'lucide-react';

interface SpinProps {
    color?: string;
    size?: number;
    className?: string;
}

export const Spin = ({
    color = 'deep-coral',
    size = 15,
    className = '',
}: SpinProps) => {
    return (
        <LoaderCircle
            className={`animate-spin text-${color} ${className}`}
            size={size}
        />
    );
};

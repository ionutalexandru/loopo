import { useId } from 'react';

export type ProgressBarShape = 'linear' | 'circular';

interface ProgressBarProps {
    shape?: ProgressBarShape;
    value: number;
    max?: number;
    disabled?: boolean;
    className?: string;
    radius?: number;
    hideStats?: boolean;
}

export const ProgressBar = ({
    shape = 'linear',
    value,
    max = 0,
    disabled = false,
    className = '',
    hideStats = false,
}: ProgressBarProps) => {
    const generatedId = useId();
    const percentage =
        max > 0
            ? Math.round(Math.min(Math.max((value / max) * 100, 0), 100))
            : 0;

    if (shape === 'circular') {
        const trackStyles = disabled
            ? 'stroke-chalk-gray group-hover:stroke-chalk-gray'
            : 'stroke-chalk-gray group-hover:stroke-steel-needle/40';

        const barStyles = disabled
            ? 'stroke-charcoal/70 group-hover:stroke-charcoal/70'
            : 'stroke-vibrant-coral group-hover:stroke-deep-coral';
        const radius = 40;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset =
            circumference - (percentage / 100) * circumference;
        return (
            <div
                id={generatedId}
                className={`group relative inline-flex flex-col items-center
                    justify-center ${className}`}
            >
                <svg className="h-24 w-24 -rotate-90 transform">
                    <circle
                        cx="48"
                        cy="48"
                        r={radius}
                        className={`transition-colors duration-200
                            ${trackStyles}`}
                        strokeWidth="6"
                        fill="transparent"
                    />
                    <circle
                        cx="48"
                        cy="48"
                        r={radius}
                        strokeWidth="6"
                        strokeLinecap="round"
                        fill="transparent"
                        className={`transition-all duration-300 ease-out
                            ${barStyles}`}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                    />
                </svg>
                {!hideStats && (
                    <div
                        className="font-inter absolute flex flex-col
                            items-center justify-center select-none"
                    >
                        <span
                            className={`${disabled ? 'text-misty-gray' : 'text-charcoal'}
                            text-2xl leading-none font-bold`}
                        >
                            {value}
                        </span>
                        <span className="text-misty-gray text-xs font-medium">
                            {max}
                        </span>
                    </div>
                )}
            </div>
        );
    }

    const trackStyles = disabled
        ? 'bg-chalk-gray group-hover:bg-chalk-gray'
        : 'bg-chalk-gray group-hover:bg-steel-needle/40';

    const barStyles = disabled
        ? 'bg-charcoal/70 group-hover:bg-charcoal/70'
        : 'bg-vibrant-coral group-hover:bg-deep-coral';

    return (
        <div
            id={generatedId}
            className={`group flex w-full flex-col ${className}`}
        >
            {!hideStats && (
                <span
                    className={`${disabled ? 'text-misty-gray' : 'text-charcoal'}
                    font-inter text-xs font-semibold`}
                >
                    {value}/{max}
                </span>
            )}
            <div
                className={`h-2.5 w-full overflow-hidden rounded-full
                    transition-colors duration-150 ${trackStyles}`}
            >
                <div
                    className={`h-full rounded-full transition-all duration-300
                        ease-out ${barStyles}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

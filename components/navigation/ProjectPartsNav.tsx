'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface NavItemProps {
    id: string;
    label: string;
    href?: string;
}

export interface NavProps {
    parts: NavItemProps[];
    activePartId?: string;
    onSelectPart?: (partId: string) => void;
    className?: string;
}

export const ProjectPartsNav = ({
    parts,
    activePartId: controlledActivePartId = '',
    onSelectPart,
    className = '',
}: NavProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isFirstRender = useRef(true);
    const pathname = usePathname();
    const activePartId = controlledActivePartId
        ? controlledActivePartId
        : parts.find((p) => p.href && pathname === p.href)?.id;

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const activeElement = container.querySelector<HTMLElement>(
            '[data-active="true"]'
        );
        if (activeElement) {
            const containerWidth = container.clientWidth;
            const elementOffsetLeft = activeElement.offsetLeft;
            const elementWidth = activeElement.clientWidth;

            const targetScrollLeft =
                elementOffsetLeft - containerWidth / 2 + elementWidth / 2;

            container.scrollTo({
                left: targetScrollLeft,
                behavior: isFirstRender.current ? 'instant' : 'smooth',
            });
            isFirstRender.current = false;
        }
    }, [activePartId]);

    return (
        <div className={`relative ${className}`}>
            <div
                className="absolute left-0 top-0 bottom-0 w-16 bg-linear-to-r
                    from-bone-white to-transparent pointer-events-none z-10"
            />
            <div
                className="absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l
                    from-bone-white to-transparent pointer-events-none z-10"
            />
            <div
                ref={containerRef}
                className="w-full overflow-x-auto [scrollbar-none]
                    [&::-webkit-scrollbar]:hidden scroll-smooth"
            >
                <div
                    className="flex w-max min-w-full items-center justify-center
                        gap-2 px-16"
                >
                    {parts.map((part) => {
                        const isActive = part.id === activePartId;

                        const baseStyles = `text-xs font-bold px-5 py-3 rounded-full cursor-pointer ${isActive ? 'font-wool bg-vibrant-coral text-white shadow-xs' : 'bg-chalk-gray'}`;

                        if (part.href && !controlledActivePartId) {
                            return (
                                <Link
                                    key={part.id}
                                    href={part.href}
                                    data-active={isActive}
                                    className={baseStyles}
                                    onClick={() => onSelectPart?.(part.id)}
                                >
                                    {part.label}
                                </Link>
                            );
                        }
                        return (
                            <button
                                key={part.id}
                                type="button"
                                data-active={isActive}
                                onClick={() => onSelectPart?.(part.id)}
                                className={baseStyles}
                            >
                                {part.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

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
            <div className="from-bone-white pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-16 bg-linear-to-r to-transparent" />
            <div className="from-bone-white pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-16 bg-linear-to-l to-transparent" />
            <div
                ref={containerRef}
                className="[scrollbar-none] w-full overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden"
            >
                <div className="flex w-max min-w-full items-center justify-center gap-2 px-16">
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

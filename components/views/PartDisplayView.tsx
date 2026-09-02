'use client';

import { useHydratedStore } from '@/hooks/useHydratedStore';
import { useProjectStore } from '@/store/useProjectStore';
import { notFound } from 'next/navigation';
import { Button } from '../ui/Button';
import { ArrowLeft, EllipsisVertical } from 'lucide-react';
import { Loading } from '../ui/Loading';

interface PageDisplayProps {
    slug: string;
    partSlug: string;
}

export default function PartDisplayView({ slug, partSlug }: PageDisplayProps) {
    const { data: projects, isHydrated } = useHydratedStore(
        useProjectStore,
        (state) => state.projects
    );

    if (!projects || !isHydrated) {
        return <Loading message="Loading your part..." />;
    }

    const project = projects.find((p) => p.slug === slug);

    if (!project) {
        notFound();
    }

    const part = project.parts.find((p) => p.slug === partSlug);
    if (!part) {
        notFound();
    }

    return (
        <main className="page">
            <header
                className="w-full relative flex items-center justify-between
                    py-3"
            >
                <Button
                    href="/"
                    icon={<ArrowLeft />}
                    variant="text"
                    size="small"
                />
                <h1 className="text-2xl! mb-0!">{project.name}</h1>
                <Button
                    icon={<EllipsisVertical />}
                    variant="text"
                    size="small"
                    color="secondary"
                />
            </header>
        </main>
    );
}

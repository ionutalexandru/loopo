'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CircleUser } from 'lucide-react';
import { Plus } from 'lucide-react';

import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Toggle } from '../ui/Toggle';
import { useProjectStore } from '@/store/useProjectStore';
import { ProjectCard } from '../widgets/ProjectCard';
import { getProjectProgressSummary } from '@/utils/projectProgress';
import { useHydratedStore } from '@/hooks/useHydratedStore';

export default function MyBasketView() {
    const [activeOnly, setActiveOnly] = useState<boolean>(true);
    const { data: projects } = useHydratedStore(
        useProjectStore,
        (state) => state.projects
    );

    const filteredProjects = useMemo(() => {
        if (!projects) return [];
        if (!activeOnly) return projects;

        return projects.filter(({ status }) => status === 'active');
    }, [projects, activeOnly]);

    return (
        <main className="page">
            {/* Header Bar */}
            <header className="flex items-center justify-between">
                <Link href="/">
                    <Image
                        src="/logo.svg"
                        alt="Loopo Logo"
                        width={40}
                        height={40}
                        priority
                    />
                </Link>
                <Button
                    variant="squared"
                    color="secondary"
                    aria-label="User profile and settings"
                    icon={<CircleUser />}
                    href="/account"
                />
            </header>

            {/* Hero Action Card */}
            <Card
                variant="bordered"
                aria-labelledby="Hero heading"
                className="flex flex-col gap-3 items-center"
            >
                <h2 className="font-comfortaa text-lg! text-center">
                    Hey, what are we crafting today?
                </h2>

                <Button
                    variant="pill"
                    color="primary"
                    icon={<Plus />}
                    className="w-fit!"
                    href="projects/new"
                >
                    Start a new project
                </Button>
            </Card>
            <div className="flex justify-between items-center p-4">
                <h1 className="mb-0!">My Basket</h1>
                <Toggle
                    defaultChecked={activeOnly}
                    onChange={({ target: { checked } }) =>
                        setActiveOnly(checked)
                    }
                    label="Active only"
                    aria-label="Filter active projects only"
                />
            </div>
            {filteredProjects && (
                <div className="flex flex-col gap-6">
                    {filteredProjects.map((p) => {
                        const summary = getProjectProgressSummary(p);
                        return (
                            <ProjectCard
                                key={p.id}
                                title={p.name}
                                currentRow={summary.currentRow}
                                totalRows={summary.totalRows}
                                url={summary.url}
                                activePart={summary.activePartName}
                                lastUpdated={summary.lastUpdated}
                            />
                        );
                    })}
                </div>
            )}
        </main>
    );
}

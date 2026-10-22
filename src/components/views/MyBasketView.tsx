import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CircleUser } from 'lucide-react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';
import { ProjectCard } from '@/components/widgets/ProjectCard';
import { getProjectProgressSummary } from '@/utils/projectProgress';
import { useHydratedStore } from '@/hooks/useHydratedStore';
import { useAuthStore } from '@/store/useAuthStore';

export default function MyBasketView() {
    const [activeOnly, setActiveOnly] = useState<boolean>(true);
    const { data: projects } = useHydratedStore((state) => state.projects);
    const openAuthModal = useAuthStore((state) => state.openAuthModal);

    const filteredProjects = useMemo(() => {
        if (!projects) return [];
        if (!activeOnly) return projects.filter(({ deletedAt }) => !deletedAt);

        return projects.filter(
            ({ status, deletedAt }) => status === 'active' && !deletedAt
        );
    }, [projects, activeOnly]);

    return (
        <main className="page">
            {/* Header Bar */}
            <header className="justify-between!">
                <Link to="/">
                    <img
                        src="/logo.svg"
                        alt="Loopo Logo"
                        width={40}
                        height={40}
                    />
                </Link>
                <Button
                    variant="squared"
                    color="secondary"
                    aria-label="User profile and settings"
                    icon={<CircleUser />}
                    onClick={openAuthModal}
                />
            </header>

            {/* Hero Action Card */}
            <Card
                variant="bordered"
                aria-labelledby="Hero heading"
                className="flex flex-col items-center gap-3"
            >
                <h2 className="font-comfortaa text-center text-lg!">
                    Hey, what are we crafting today?
                </h2>

                <Button
                    variant="pill"
                    color="primary"
                    icon={<Plus />}
                    className="w-fit!"
                    to="projects/new"
                >
                    Start a new project
                </Button>
            </Card>
            <div className="flex items-center justify-between p-4">
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
                    {filteredProjects
                        .sort(
                            (a, b) =>
                                new Date(b.updatedAt).getTime() -
                                new Date(a.updatedAt).getTime()
                        )
                        .map((p) => {
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

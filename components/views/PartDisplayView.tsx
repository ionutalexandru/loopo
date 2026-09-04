'use client';

import { notFound } from 'next/navigation';
import { ArrowLeft, EllipsisVertical, Icon } from 'lucide-react';
import { yarnBall } from '@lucide/lab';

import { useHydratedStore } from '@/hooks/useHydratedStore';
import { useProjectStore } from '@/store/useProjectStore';
import {
    getActiveSecondaryCounter,
    getSecondaryCounterProgress,
} from '@/utils/counter';
import { EditSecondaryCounterDTO } from '@/schemas/secondaryCounterSchema';
import { Button } from '../ui/Button';
import { Loading } from '../ui/Loading';
import { ProjectPartsNav } from '../navigation/ProjectPartsNav';
import { Tag } from '../ui/Tag';
import { GlobalCounter } from '../widgets/GlobalCounter';
import { NeedleIcon } from '../icons/NeedleIcon';
import { SecondaryCounter } from '../widgets/SecondaryCounter';
import { SecondaryCounterSettingsModal } from '../widgets/SecondaryCounterSettingsModal';

interface PageDisplayProps {
    slug: string;
    partSlug: string;
}

export default function PartDisplayView({ slug, partSlug }: PageDisplayProps) {
    const { data: projects, isHydrated } = useHydratedStore(
        useProjectStore,
        (state) => state.projects
    );
    const setRow = useProjectStore((state) => state.setRow);
    const incrementRow = useProjectStore((state) => state.incrementRow);
    const decrementRow = useProjectStore((state) => state.decrementRow);
    const updatedSecondaryCounter = useProjectStore(
        (state) => state.updatedSecondaryCounter
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

    const activeCounter = getActiveSecondaryCounter(
        part.secondaryCounters,
        part.currentRow
    );

    // add active counter at index 0
    const counters = activeCounter
        ? [
              activeCounter,
              ...part.secondaryCounters.filter(
                  (c) => c.id !== activeCounter.id
              ),
          ]
        : part.secondaryCounters;

    const handleSetRow = (row: number): void => {
        setRow(project.id, part.id, row);
    };
    const handleIncrementRow = (): void => {
        incrementRow(project.id, part.id);
    };
    const handledDcrementRow = (): void => {
        decrementRow(project.id, part.id);
    };
    const handleUpdateSecondaryCounter = (
        counterId: string,
        data: EditSecondaryCounterDTO
    ) => {
        updatedSecondaryCounter(project.id, part.id, counterId, data);
    };

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
            <section aria-label="Parts navigator" className="w-full">
                <ProjectPartsNav
                    parts={project.parts.map((p) => ({
                        id: p.id,
                        href: `/projects/${project.slug}/parts/${p.slug}`,
                        label: p.name,
                    }))}
                />
            </section>
            {(part.needleSize || part.yarnDetails) && (
                <section
                    aria-label="Needle and yarn details"
                    className="w-full flex justify-center gap-3"
                >
                    {part.needleSize && (
                        <Tag
                            label={part.needleSize}
                            variant="highlight"
                            icon={<NeedleIcon />}
                        />
                    )}
                    {part.yarnDetails && (
                        <Tag
                            label={part.yarnDetails}
                            variant="muted"
                            icon={<Icon iconNode={yarnBall} />}
                        />
                    )}
                </section>
            )}
            <section
                aria-label="Main row counter"
                className="w-full flex justify-center"
            >
                <GlobalCounter
                    row={part.currentRow}
                    totalRows={part.totalRows}
                    setRow={handleSetRow}
                />
            </section>
            {counters && (
                <section
                    aria-label="Secondary counters"
                    className="w-full flex justify-center"
                >
                    <div
                        className="w-full max-w-sm grid grid-cols-2 gap-3
                            sm:gap-4 items-stretch justify-items-center"
                    >
                        {counters.map((i) => {
                            const isActive = i.id === activeCounter?.id;
                            const progress = getSecondaryCounterProgress(
                                i,
                                part.currentRow
                            );
                            return (
                                <SecondaryCounter
                                    key={i.id}
                                    title={i.name}
                                    totalRows={i.rowsPerRepeat}
                                    absoluteTotalRows={progress.totalRows}
                                    row={progress.rowInCurrentRepeat}
                                    tagLabel={i.notes}
                                    isInactive={!isActive}
                                    {...(isActive && {
                                        settingsHref: `?counter=${i.id}`,
                                        onIncrement: handleIncrementRow,
                                        onDecrement: handledDcrementRow,
                                    })}
                                />
                            );
                        })}
                    </div>
                </section>
            )}
            {activeCounter && (
                <SecondaryCounterSettingsModal
                    key={`counter-settings-${activeCounter.id}`}
                    initialData={activeCounter}
                    paramName="counter"
                    paramValue={activeCounter.id}
                    onSave={(data) => {
                        handleUpdateSecondaryCounter(activeCounter.id, data);
                    }}
                    currentGlobalRow={part.currentRow}
                    existingCounters={part.secondaryCounters}
                />
            )}
        </main>
    );
}

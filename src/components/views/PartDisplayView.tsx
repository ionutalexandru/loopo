import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, EllipsisVertical, Icon } from 'lucide-react';
import { yarnBall } from '@lucide/lab';

import { useHydratedStore } from '@/hooks/useHydratedStore';
import { useProjectStore } from '@/store/useProjectStore';
import {
    getActiveSecondaryCounter,
    getSecondaryCounterProgress,
} from '@/utils/counter';
import { UpdatePartDTO } from '@/schemas/partSchema';
import {
    BaseSecondaryCounterDTO,
    EditSecondaryCounterDTO,
} from '@/schemas/secondaryCounterSchema';
import { ProjectPart } from '@/types/project';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { Tag } from '@/components/ui/Tag';
import { ProjectPartsNav } from '@/components/navigation/ProjectPartsNav';
import { GlobalCounter } from '@/components/widgets/GlobalCounter';
import { SecondaryCounter } from '@/components/widgets/SecondaryCounter';
import { SecondaryCounterSettingsModal } from '@/components/widgets/SecondaryCounterSettingsModal';
import { PartSettingsModal } from '@/components/widgets/PartSettingsModal';
import { NeedleIcon } from '@/components/icons/NeedleIcon';
import { Link } from 'react-router-dom';
import { ProjectSettingsModal } from '../widgets/ProjectSettingsModal';
import { UpdateProjectDTO } from '@/schemas/projectSchema';
import { Footer } from '@/components/navigation/Footer';

import NotFoundView from '@/components/views/NotFoundView';

export default function PartDisplayView() {
    const { slug, partSlug } = useParams<{ slug: string; partSlug: string }>();
    const navigate = useNavigate();

    const { data: projects, isHydrated } = useHydratedStore(
        (state) => state.projects
    );
    const setRow = useProjectStore((state) => state.setRow);
    const incrementRow = useProjectStore((state) => state.incrementRow);
    const decrementRow = useProjectStore((state) => state.decrementRow);
    const updateProject = useProjectStore((state) => state.updateProject);
    const deleteProject = useProjectStore((state) => state.deleteProject);
    const addSecondaryCounter = useProjectStore(
        (state) => state.addSecondaryCounter
    );
    const updatedSecondaryCounter = useProjectStore(
        (state) => state.updatedSecondaryCounter
    );
    const deleteSecondaryCounter = useProjectStore(
        (state) => state.deleteSecondaryCounter
    );
    const duplicatePart = useProjectStore((state) => state.duplicatePart);
    const updatePart = useProjectStore((state) => state.updatePart);
    const deletePart = useProjectStore((state) => state.deletePart);

    if (!projects || !isHydrated) {
        return <Loading message="Loading your part..." />;
    }

    const project = projects
        .filter(({ deletedAt }) => !deletedAt)
        .find((p) => p.slug === slug);
    if (!project) {
        return <NotFoundView />;
    }

    const part = project.parts.find((p) => p.slug === partSlug);
    if (!part) {
        return <NotFoundView />;
    }

    const activeCounter = getActiveSecondaryCounter(
        part.secondaryCounters,
        part.currentRows
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

    // rows handlers
    const handleSetRow = (row: number): void => {
        setRow(project.id, part.id, row);
    };
    const handleIncrementRow = (): void => {
        incrementRow(project.id, part.id);
    };
    const handledDcrementRow = (): void => {
        decrementRow(project.id, part.id);
    };

    // secondary counter handlers
    const handleCreateSecondaryCounter = (data: BaseSecondaryCounterDTO) => {
        addSecondaryCounter(project.id, part.id, data);
    };

    const handleUpdateSecondaryCounter = (
        counterId: string,
        data: EditSecondaryCounterDTO
    ) => {
        updatedSecondaryCounter(project.id, part.id, counterId, data);
    };
    const handleDeleteSecondaryCounter = (counterId: string) => {
        deleteSecondaryCounter(project.id, part.id, counterId);
    };

    // part handlers
    const handleDuplicatePart = () => {
        const newSlug = duplicatePart(project.id, part.id);
        if (newSlug) {
            navigate(`/projects/${project.slug}/parts/${newSlug}`);
        }
    };
    const handleSavePart = (data: UpdatePartDTO) => {
        updatePart(project.id, part.id, data);
    };
    const handleDeletePart = () => {
        deletePart(project.id, part.id);
        const parts = project.parts.filter(({ id }) => id !== part.id);
        const slug = parts.length
            ? parts.sort(
                  (a: ProjectPart, b: ProjectPart): number =>
                      new Date(b.updatedAt).getTime() -
                      new Date(a.updatedAt).getTime()
              )[0].slug
            : 'new';
        const url = `/projects/${project.slug}/parts/${slug}`;
        navigate(url);
    };

    // project handlers
    const handleUpdateProject = (data: UpdateProjectDTO) => {
        updateProject(project.id, data);
    };
    const handleDeleteProject = () => {
        deleteProject(project.id);
        navigate('/');
    };

    return (
        <main className="page">
            <header className="justify-between!">
                <Button
                    to="/"
                    icon={<ArrowLeft />}
                    variant="text"
                    size="small"
                />
                <Link
                    to="?settings=project"
                    className="cursor-pointer text-center transition-colors select-none"
                    title="Project settings"
                >
                    <h1 className="hover:text-vibrant-coral! mb-0! text-2xl! transition-colors">
                        {project.name}
                    </h1>
                </Link>
                <Button
                    icon={<EllipsisVertical />}
                    variant="text"
                    size="small"
                    color="secondary"
                    to="?settings=part"
                />
            </header>
            <section aria-label="Parts navigator" className="w-full">
                <ProjectPartsNav
                    parts={project.parts
                        .filter(({ deletedAt }) => !deletedAt)
                        .sort(
                            (a, b) =>
                                new Date(a.createdAt).getTime() -
                                new Date(b.createdAt).getTime()
                        )
                        .map((p) => ({
                            id: p.id,
                            href: `/projects/${project.slug}/parts/${p.slug}`,
                            label: p.name,
                        }))}
                />
            </section>
            {(part.needleSize || part.yarnDetails) && (
                <section
                    aria-label="Needle and yarn details"
                    className="flex w-full justify-center gap-3"
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
                className="flex w-full justify-center"
            >
                <GlobalCounter
                    row={part.currentRows}
                    totalRows={part.totalRows}
                    setRow={handleSetRow}
                />
            </section>
            {counters && (
                <section
                    aria-label="Secondary counters"
                    className="flex w-full justify-center"
                >
                    <div className="grid w-full max-w-sm grid-cols-2 items-stretch justify-items-center gap-3 sm:gap-4">
                        {counters.map((i) => {
                            const isActive = i.id === activeCounter?.id;
                            const progress = getSecondaryCounterProgress(
                                i,
                                part.currentRows
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
                                        onIncrement: handleIncrementRow,
                                        onDecrement: handledDcrementRow,
                                    })}
                                    {...(!progress.isCompleted && {
                                        settingsHref: `?counter=${i.id}`,
                                    })}
                                />
                            );
                        })}
                    </div>
                </section>
            )}
            <SecondaryCounterSettingsModal
                paramName="counter"
                currentGlobalRow={part.currentRows}
                existingCounters={part.secondaryCounters}
                onCreate={handleCreateSecondaryCounter}
                onUpdate={handleUpdateSecondaryCounter}
                onDelete={handleDeleteSecondaryCounter}
            />
            <PartSettingsModal
                key={`part-${part.id}-${part.updatedAt}`}
                project={project}
                part={part}
                onDuplicate={handleDuplicatePart}
                onSave={handleSavePart}
                onDelete={handleDeletePart}
            />
            <ProjectSettingsModal
                key={`project-${project.id}-${project.updatedAt}`}
                project={project}
                onSave={handleUpdateProject}
                onDelete={handleDeleteProject}
            />
            <Footer />
        </main>
    );
}

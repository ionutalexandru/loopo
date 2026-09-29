'use client';

import { ArrowLeft, Check } from 'lucide-react';
import { notFound, useRouter, useSearchParams } from 'next/navigation';

import { useProjectStore } from '@/store/useProjectStore';
import { useHydratedStore } from '@/hooks/useHydratedStore';
import { useZodForm } from '@/hooks/useZodForm';
import { generateUniqueSlug } from '@/utils/slugify';
import { createPartSchema } from '@/schemas/partSchema';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { FormAlert } from '../ui/FormAlert';
import { Input } from '../ui/Input';
import { Loading } from '../ui/Loading';

interface CreatePartViewProps {
    slug: string;
}

export default function CreatePartView({ slug }: CreatePartViewProps) {
    const { data: projects, isHydrated } = useHydratedStore(
        useProjectStore,
        (state) => state.projects
    );
    const router = useRouter();
    const addPart = useProjectStore((state) => state.addPart);

    const {
        formData,
        errors,
        isSubmitting,
        handleFieldChange,
        handleBlur,
        isFieldValid,
        handleSubmit,
    } = useZodForm({
        schema: createPartSchema,
        initialValues: {
            name: '',
            currentRow: 0,
            totalRows: 0,
            needleSize: '',
            yarnDetails: '',
            notes: '',
        },
        onSubmit: async (validatedData) => {
            const currentProjects = useProjectStore.getState().projects;
            const currentProject = currentProjects.find((p) => p.slug === slug);

            if (!currentProject) return;

            const partSlug = generateUniqueSlug(
                validatedData.name,
                currentProject.parts.map(({ slug }) => slug)
            );

            addPart(currentProject.id, {
                name: validatedData.name,
                slug: partSlug,
                currentRow: validatedData.currentRow,
                totalRows: validatedData.totalRows,
                needleSize: validatedData.needleSize,
                yarnDetails: validatedData.yarnDetails,
                notes: validatedData.notes,
            });
            router.push(`/projects/${currentProject.slug}/parts/${partSlug}`);
        },
    });
    const searchParams = useSearchParams();

    if (!isHydrated || !projects) {
        return <Loading message="Loading your part..." />;
    }

    const project = projects.find((p) => p.slug === slug);

    if (!project) {
        notFound();
    }

    return (
        <main className="page">
            <header>
                <Button
                    href={searchParams.get('from') || '/'}
                    icon={<ArrowLeft />}
                    variant="text"
                    size="small"
                    className="back"
                />
                <h1 className="text-2xl!">Create a part</h1>
            </header>
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <Card variant="elevated" className="flex flex-col gap-6">
                    {errors.general && (
                        <FormAlert variant="error" message={errors.general} />
                    )}
                    <Input
                        label="Part Name"
                        value={formData.name}
                        onChange={handleFieldChange}
                        error={errors.name}
                        name="name"
                        placeholder="e.g. Front part, Left Sleeve"
                        onBlur={handleBlur}
                        success={isFieldValid('name')}
                    />
                    <div className="flex flex-row gap-6">
                        <Input
                            label="Current Row"
                            value={formData.currentRow}
                            onChange={handleFieldChange}
                            error={errors.currentRow}
                            name="currentRow"
                            onBlur={handleBlur}
                            success={isFieldValid('currentRow')}
                            type="number"
                            inputMode="numeric"
                        />
                        <Input
                            label="Total Rows"
                            value={formData.totalRows}
                            onChange={handleFieldChange}
                            error={errors.totalRows}
                            name="totalRows"
                            placeholder="e.g., 120"
                            onBlur={handleBlur}
                            success={isFieldValid('totalRows')}
                            type="number"
                            inputMode="numeric"
                        />
                    </div>
                    <Input
                        label="Needle/Hook Size"
                        value={formData.needleSize}
                        onChange={handleFieldChange}
                        error={errors.needleSize}
                        name="needleSize"
                        placeholder="e.g., 4.5mm"
                        onBlur={handleBlur}
                        success={isFieldValid('needleSize')}
                    />
                    <Input
                        label="Yarn Details"
                        value={formData.yarnDetails}
                        onChange={handleFieldChange}
                        error={errors.yarnDetails}
                        name="yarnDetails"
                        placeholder="e.g., Merino Wool - Color #04"
                        onBlur={handleBlur}
                        success={isFieldValid('yarnDetails')}
                    />
                    <Input
                        label="Notes"
                        value={formData.notes}
                        onChange={handleFieldChange}
                        error={errors.notes}
                        name="notes"
                        onBlur={handleBlur}
                        success={isFieldValid('notes')}
                    />
                </Card>
                <div className="flex flex-col gap-5">
                    <Button
                        type="submit"
                        variant="squared"
                        color="primary"
                        disabled={isSubmitting}
                        className="mt-5 w-fit!"
                        icon={!isSubmitting ? <Check /> : null}
                    >
                        {isSubmitting ? 'Creating part...' : 'Start crafting'}
                    </Button>
                    <Button
                        variant="text"
                        color="secondary"
                        href="/"
                        className="w-fit!"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
            {isSubmitting && <Loading message="Creating part..." />}
        </main>
    );
}

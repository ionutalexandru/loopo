'use client';

import { ArrowLeft, Check } from 'lucide-react';
import { notFound, useRouter } from 'next/navigation';

import { useProjectStore } from '@/store/useProjectStore';
import { useHydratedStore } from '@/hooks/useHydratedStore';
import { useZodForm } from '@/hooks/useZodForm';
import { slugify } from '@/utils/slugify';
import { createPartSchema } from '@/schemas/partSchema';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { FormAlert } from '../ui/FormAlert';
import { Input } from '../ui/Input';

interface CreatePartViewProps {
    slug: string;
}

export default function CreatePartView({ slug }: CreatePartViewProps) {
    const { data: projects, isHydrated } = useHydratedStore(
        useProjectStore,
        (state) => state.projects
    );

    if (!projects || !isHydrated) {
        notFound();
    }

    const project = projects.find((p) => p.slug === slug);

    if (!project) {
        notFound();
    }
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
            totalRows: undefined as number | undefined,
            needleSize: '',
            yarnDetails: '',
            notes: '',
        },
        onSubmit: (validatedData) => {
            const baseSlug = slugify(validatedData.name);

            const duplicates = (project.parts || []).filter((p) =>
                p.slug.startsWith(baseSlug)
            ).length;
            const partSlug =
                duplicates > 0 ? `${baseSlug}-${duplicates + 1}` : baseSlug;

            addPart(project.id, {
                name: validatedData.name,
                slug: partSlug,
                currentRow: validatedData.currentRow,
                totalRows: validatedData.totalRows,
                needleSize: validatedData.needleSize,
                yarnDetails: validatedData.yarnDetails,
                notes: validatedData.notes,
            });

            router.push(`/projects/${project.slug}/parts/${partSlug}`);
        },
    });

    return (
        <main className="page">
            <header
                className="w-full relative flex items-center justify-center
                    py-3"
            >
                <Button
                    href={
                        project.parts.length ? `/projects/${project.slug}` : '/'
                    }
                    icon={<ArrowLeft />}
                    variant="text"
                    size="small"
                    className="absolute left-0"
                />
                <h1 className="text-2xl!">Create a part</h1>
            </header>
            <Card variant="elevated">
                <form
                    action={handleSubmit}
                    noValidate
                    className="flex flex-col gap-5"
                >
                    {errors.general && (
                        <FormAlert variant="error" message="errors.general" />
                    )}
                    <Input
                        label="Part Name"
                        value={formData.name}
                        onChange={handleFieldChange}
                        error={errors.name}
                        name="name"
                        placeholder="Front"
                        onBlur={handleBlur}
                        success={isFieldValid('name')}
                    />
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
                    <Button
                        type="submit"
                        variant="squared"
                        color="primary"
                        disabled={isSubmitting}
                        className="mt-5"
                        icon={!isSubmitting ? <Check /> : null}
                    >
                        {isSubmitting ? 'Creating part...' : 'Start crafting'}
                    </Button>
                    <Button variant="text" color="secondary" href="/">
                        Cancel
                    </Button>
                </form>
            </Card>
        </main>
    );
}

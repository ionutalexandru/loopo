'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { createProjectSchema } from '@/schemas/projectSchema';
import { useProjectStore } from '@/store/useProjectStore';
import { slugify } from '@/utils/slugify';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { FormAlert } from '../ui/FormAlert';
import { useZodForm } from '@/hooks/useZodForm';
import { Loading } from '../ui/Loading';

export default function CreateProjectView() {
    const router = useRouter();
    const addProject = useProjectStore((state) => state.addProject);
    const existingProjects = useProjectStore((state) => state.projects);

    const {
        formData,
        errors,
        isSubmitting,
        handleFieldChange,
        handleBlur,
        isFieldValid,
        handleSubmit,
    } = useZodForm({
        schema: createProjectSchema,
        initialValues: {
            name: '',
            patternName: '',
            craftType: 'knit',
            notes: '',
        },
        onSubmit: (validData) => {
            const baseSlug = slugify(validData.name);

            const duplicates = existingProjects.filter((p) =>
                p.slug.startsWith(baseSlug)
            ).length;
            const projectSlug =
                duplicates > 0 ? `${baseSlug}-${duplicates + 1}` : baseSlug;

            addProject({
                userId: 'user-local',
                name: validData.name,
                slug: projectSlug,
                patternName: validData.patternName,
                craftType: validData.craftType,
                status: 'active',
                parts: [],
            });

            router.push(`/projects/${projectSlug}/parts/new`);
        },
    });

    return (
        <main className="page">
            {/* Header Bar */}
            <header
                className="w-full relative flex items-center justify-center
                    py-3"
            >
                <Button
                    href="/"
                    icon={<ArrowLeft />}
                    variant="text"
                    size="small"
                    className="absolute left-0"
                />
                <h1 className="text-2xl!">Create a project</h1>
            </header>
            <Card variant="elevated">
                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="flex flex-col gap-5"
                >
                    {errors.general && (
                        <FormAlert variant="error" message="errors.general" />
                    )}
                    <Input
                        label="Project Name"
                        value={formData.name}
                        onChange={handleFieldChange}
                        error={errors.name}
                        name="name"
                        placeholder="Winter Wool Sweater"
                        onBlur={handleBlur}
                        success={isFieldValid('name')}
                    />
                    <Input
                        label="Pattern Name"
                        value={formData.patternName}
                        onChange={handleFieldChange}
                        error={errors.patternName}
                        name="patternName"
                        placeholder="Nordic Winter Pullover by DROPS Design"
                        onBlur={handleBlur}
                        success={isFieldValid('patternName')}
                    />
                    <Select
                        label="Craft type"
                        defaultValue={formData.craftType}
                        onChange={handleFieldChange}
                        error={errors.craftType}
                        name="craftType"
                        onBlur={handleBlur}
                    >
                        <option value="" disabled>
                            Select an option
                        </option>
                        <option value="knit">Knit</option>
                        <option value="crochet">Crochet</option>
                    </Select>
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
                    >
                        {isSubmitting ? 'Creating...' : 'Continue'}
                    </Button>
                    <Button variant="text" color="secondary" href="/">
                        Cancel
                    </Button>
                </form>
            </Card>
            {isSubmitting && <Loading message="Creating project..." />}
        </main>
    );
}

'use client';

import { ArrowLeft } from 'lucide-react';

import { Project } from '@/types/project';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import React, { useState } from 'react';
import { createProjectSchema } from '@/schemas/projectSchema';
import { useRouter } from 'next/navigation';
import { useProjectStore } from '@/store/useProjectStore';
import { FormAlert } from '../ui/FormAlert';
import { slugify } from '@/utils/slugify';

type ProjectFormState = Pick<
    Project,
    'name' | 'patternName' | 'craftType' | 'notes'
>;

type FieldErrors = Partial<Record<keyof ProjectFormState | 'general', string>>;

export default function CreateProjectView() {
    const router = useRouter();
    const addProject = useProjectStore((state) => state.addProject);
    const existingProjects = useProjectStore((state) => state.projects);

    const [formData, setFormData] = useState<ProjectFormState>({
        name: '',
        patternName: '',
        craftType: 'knit',
        notes: '',
    });
    const [errors, setErrors] = useState<FieldErrors>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleFormChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const {
            target: { name, value },
        } = e;
        const field = name as keyof ProjectFormState;
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = createProjectSchema.safeParse(formData);

        if (!result.success) {
            const formattedError: FieldErrors = {};
            result.error.issues.forEach((iss) => {
                const fieldName = iss.path[0] as keyof ProjectFormState;
                if (fieldName && !formattedError[fieldName]) {
                    formattedError[fieldName] = iss.message;
                }
            });
            setErrors(formattedError);
            return;
        }

        setIsSubmitting(true);

        try {
            const validData = result.data;
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
        } catch {
            setErrors({
                general:
                    'Failed to create the project. Please check your data and try again.',
            });
            setIsSubmitting(false);
        }
    };

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
            <Card variant="bordered">
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
                        onChange={handleFormChange}
                        error={errors.name}
                        name="name"
                    />
                    <Input
                        label="Pattern Name"
                        value={formData.patternName}
                        onChange={handleFormChange}
                        error={errors.patternName}
                        name="patternName"
                    />
                    <Select
                        label="Craft type"
                        defaultValue={formData.craftType}
                        onChange={handleFormChange}
                        error={errors.craftType}
                        name="craftType"
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
                        onChange={handleFormChange}
                        error={errors.notes}
                        name="notes"
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
        </main>
    );
}

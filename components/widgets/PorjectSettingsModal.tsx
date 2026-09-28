'use client';

import { useUrlModal } from '@/hooks/useUrlModal';
import { useZodForm } from '@/hooks/useZodForm';
import { UpdateProjectDTO, updateProjectSchema } from '@/schemas/projectSchema';
import { Project } from '@/types/project';
import { useState } from 'react';
import { Loading } from '../ui/Loading';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { Check, X } from 'lucide-react';
import { FormAlert } from '../ui/FormAlert';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

export interface ProjectSettingsModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    paramName?: string;
    paramValue?: string;
    project: Project;
    onSave?: (data: UpdateProjectDTO) => void;
    onDelete?: () => void;
}

export const ProjectSettingsModal = ({
    isOpen: controlledIsOpen,
    onClose: controlledOnClose,
    paramName = 'settings',
    paramValue = 'project',
    project,
    onSave,
    onDelete,
}: ProjectSettingsModalProps) => {
    const { isOpen: isUrlModalOpen, close: urlModalClose } = useUrlModal(
        paramName,
        paramValue
    );
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const isControlled = controlledIsOpen !== undefined;
    const isOpen = isControlled ? controlledIsOpen : isUrlModalOpen;

    const handleClose = () => {
        setIsConfirmingDelete(false);
        if (isControlled) {
            controlledOnClose?.();
        } else {
            urlModalClose();
        }

        restart();
    };

    const initialData: UpdateProjectDTO = {
        name: project.name,
        craftType: project.craftType,
        status: project.status,
        patternName: project.patternName ?? '',
        notes: project.notes ?? '',
    };

    const {
        formData,
        errors,
        isSubmitting,
        handleFieldChange,
        handleBlur,
        isFieldValid,
        handleSubmit,
        restart,
    } = useZodForm<UpdateProjectDTO>({
        schema: updateProjectSchema,
        initialValues: initialData,
        onSubmit: (data) => {
            onSave?.(data);
            handleClose();
        },
    });

    const handleDelete = () => {
        if (!isConfirmingDelete) {
            setIsConfirmingDelete(true);
            return;
        }
        onDelete?.();
    };

    return (
        <>
            <Modal
                maxWidth="lg"
                onClose={handleClose}
                isOpen={isOpen}
                cartProps={{ variant: 'ghost' }}
                showCloseButton={false}
                containerClassName="backdrop-blur-xl"
            >
                <div className="flex w-full items-center justify-between">
                    <span className="text-misty-gray text-base font-black uppercase">
                        Project Settings
                    </span>
                    <Button
                        variant="squared"
                        color="secondary"
                        onClick={handleClose}
                        icon={<X />}
                    />
                </div>
                <h3 className="my-2">
                    {project.name} <em>Settings</em>
                </h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="mt-4 flex flex-col gap-4">
                        {errors.general && (
                            <FormAlert
                                variant="error"
                                message="errors.general"
                            />
                        )}
                        <Card
                            variant="elevated"
                            className="flex flex-col gap-6"
                        >
                            <Input
                                label="Name"
                                value={formData.name}
                                name="name"
                                error={errors.name}
                                onChange={handleFieldChange}
                                onBlur={handleBlur}
                                placeholder="e.g. Winter Raglan Sweater"
                                success={isFieldValid('name')}
                            />
                            <Input
                                label="Pattern Name"
                                value={formData.patternName}
                                name="patternName"
                                error={errors.patternName}
                                onChange={handleFieldChange}
                                onBlur={handleBlur}
                                placeholder="e.g. Nordic Pullover by PetiteKnit"
                                success={isFieldValid('patternName')}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Select
                                    label="Craft Type"
                                    value={formData.craftType}
                                    name="craftType"
                                    error={errors.craftType}
                                    onChange={handleFieldChange}
                                    onBlur={handleBlur}
                                >
                                    <option value="knit">Knit</option>
                                    <option value="crochet">Crochet</option>
                                </Select>
                                <Select
                                    label="Status"
                                    value={formData.status}
                                    name="status"
                                    error={errors.status}
                                    onChange={handleFieldChange}
                                    onBlur={handleBlur}
                                >
                                    <option value="active">Active</option>
                                    <option value="paused">Paused</option>
                                    <option value="completed">Completed</option>
                                    <option value="archived">Archived</option>
                                </Select>
                            </div>
                            <Input
                                label="Notes"
                                value={formData.notes}
                                name="notes"
                                error={errors.notes}
                                onChange={handleFieldChange}
                                onBlur={handleBlur}
                                placeholder="e.g. Gauge: 21 sts x 28 rows on 4.0 mm"
                                success={isFieldValid('notes')}
                            />
                        </Card>

                        <Card
                            variant="elevated"
                            className="flex flex-col gap-6"
                        >
                            <h4 className="text-crimson! mb-0!">Danger zone</h4>
                            <blockquote>
                                Deleting this project will remove all its parts,
                                counters, and row history permanently.
                            </blockquote>
                            <Button
                                variant="squared"
                                color="danger"
                                type="button"
                                size="small"
                                onClick={handleDelete}
                                className="w-fit!"
                            >
                                {!isConfirmingDelete
                                    ? 'Delete part?'
                                    : 'Confirm delete?'}
                            </Button>
                        </Card>
                        <Button
                            type="submit"
                            className="w-fit!"
                            variant="squared"
                            icon={<Check />}
                        >
                            {isSubmitting
                                ? 'Saving changes...'
                                : 'Save changes'}
                        </Button>
                    </div>
                </form>
            </Modal>
            {isSubmitting && <Loading message="Updating project..." />}
        </>
    );
};

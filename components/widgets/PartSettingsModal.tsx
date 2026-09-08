'use client';

import { useUrlModal } from '@/hooks/useUrlModal';
import { Project, ProjectPart } from '@/types/project';
import { Modal } from '../ui/Modal';
import { Loading } from '../ui/Loading';
import { BellRing, Check, ChevronRight, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { UpdatePartDTO, updatePartSchema } from '@/schemas/partSchema';
import { useZodForm } from '@/hooks/useZodForm';
import { FormAlert } from '../ui/FormAlert';
import { Input } from '../ui/Input';
import { useState } from 'react';

export interface PartSettingsModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    paramName?: string;
    paramValue?: string;
    onSave?: (data: UpdatePartDTO) => void;
    onDelete?: () => void;
    part: ProjectPart;
    project: Project;
}

export const PartSettingsModal = ({
    isOpen: controlledIsOpen,
    onClose: controlledOnClose,
    paramName = 'settings',
    paramValue = 'part',
    part,
    project,
    onSave,
    onDelete,
}: PartSettingsModalProps) => {
    const { isOpen: isUrlModalOpen, close: urlModalClose } = useUrlModal(
        paramName,
        paramValue
    );
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const isControlled = controlledIsOpen !== undefined;
    const isOpen = isControlled ? controlledIsOpen : isUrlModalOpen;

    const restart = () => {
        _restart();
        setIsConfirmingDelete(false);
    };

    const handleClose = () => {
        if (isControlled) {
            controlledOnClose?.();
        } else {
            urlModalClose();
        }
        restart();
    };

    const initialData: UpdatePartDTO = {
        name: part.name,
        currentRow: part.currentRow,
        totalRows: part.totalRows,
        needleSize: part.needleSize,
        yarnDetails: part.yarnDetails,
        notes: part.notes,
    };

    const {
        formData,
        errors,
        isSubmitting,
        handleFieldChange,
        handleBlur,
        isFieldValid,
        handleSubmit,
        restart: _restart,
    } = useZodForm<UpdatePartDTO>({
        schema: updatePartSchema,
        initialValues: initialData,
        onSubmit: (data) => {
            onSave?.(data);
            handleClose();
        },
    });

    const handleDelete = () => {
        if (project.parts.length <= 1) return;
        if (!isConfirmingDelete) {
            setIsConfirmingDelete(true);
            return;
        }
        onDelete?.();
        handleClose();
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
                <div className="w-full flex justify-between items-center">
                    <span
                        className="uppercase text-misty-gray text-base
                            font-black"
                    >
                        {project.name}
                    </span>
                    <Button
                        variant="squared"
                        color="secondary"
                        onClick={handleClose}
                        icon={<X />}
                    />
                </div>
                <h3 className="my-2">
                    {part.name} <em>Settings</em>
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
                                placeholder="e.g. Front part, Left Sleeve"
                                success={isFieldValid('name')}
                            />
                            <Input
                                label="Needle/Hook Size"
                                value={formData.needleSize}
                                name="needleSize"
                                error={errors.needleSize}
                                onChange={handleFieldChange}
                                onBlur={handleBlur}
                                placeholder="e.g., 4.5mm"
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
                        <Card
                            variant="elevated"
                            className="flex flex-col gap-6"
                        >
                            <h4 className="text-misty-gray! mb-0!">
                                Timeline & Targets
                            </h4>
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
                            <Button
                                variant="squared"
                                color="secondary"
                                type="button"
                                size="small"
                                className="w-fit!"
                                icon={<BellRing />}
                            >
                                View alerts
                            </Button>
                        </Card>
                        <Card
                            variant="elevated"
                            className="flex flex-col gap-6"
                        >
                            <h4 className="text-misty-gray! mb-0!">
                                Additional actions
                            </h4>
                            <div
                                className="flex flex-col divide-y
                                    divide-chalk-gray"
                            >
                                <button
                                    type="button"
                                    className="flex justify-between
                                        font-semibold cursor-pointer py-4
                                        hover:text-crimson"
                                >
                                    Duplicate Part
                                    <ChevronRight />
                                </button>
                                <button
                                    type="button"
                                    className="flex justify-between
                                        font-semibold cursor-pointer py-4
                                        hover:text-crimson"
                                >
                                    Add Counter
                                    <ChevronRight />
                                </button>
                            </div>
                        </Card>
                        <Card
                            variant="elevated"
                            className="flex flex-col gap-6"
                        >
                            <h4 className="text-crimson! mb-0!">Danger zone</h4>
                            <Button
                                variant="squared"
                                color="danger"
                                type="button"
                                size="small"
                                onClick={handleDelete}
                                disabled={project.parts.length === 1}
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
                            icon={<Check />}
                        >
                            {isSubmitting
                                ? 'Saving changes...'
                                : 'Save changes'}
                        </Button>
                    </div>
                </form>
            </Modal>
            {isSubmitting && <Loading message="Updating part..." />}
        </>
    );
};

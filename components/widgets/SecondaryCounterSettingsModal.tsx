'use client';

import React, { useMemo, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useUrlModal } from '@/hooks/useUrlModal';
import {
    EditSecondaryCounterDTO,
    getEditSecondaryCounterSchema,
} from '@/schemas/secondaryCounterSchema';
import { SecondaryCounter } from '@/types/project';
import { useZodForm } from '@/hooks/useZodForm';
import { FormAlert } from '../ui/FormAlert';
import { Loading } from '../ui/Loading';

export interface SecondaryCounterSettingsModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    paramName?: string;
    paramValue?: string;
    initialData: EditSecondaryCounterDTO;
    onSave?: (data: EditSecondaryCounterDTO) => void;
    currentGlobalRow?: number;
    existingCounters?: SecondaryCounter[];
}

export const SecondaryCounterSettingsModal = ({
    isOpen: controlledIsOpen,
    onClose: controlledOnClose,
    paramName = 'counterSettings',
    paramValue = 'true',
    initialData,
    onSave,
    currentGlobalRow = 0,
    existingCounters = [],
}: SecondaryCounterSettingsModalProps) => {
    const { isOpen: isUrlModalOpen, close: urlModalClose } = useUrlModal(
        paramName,
        paramValue
    );

    const isControlled = controlledIsOpen !== undefined;
    const isOpen = isControlled ? controlledIsOpen : isUrlModalOpen;

    const validationSchema = useMemo(
        () =>
            getEditSecondaryCounterSchema({
                currentGlobalRow,
                existingCounters,
            }),
        [currentGlobalRow, existingCounters]
    );

    const handleClose = () => {
        if (isControlled) {
            controlledOnClose?.();
        } else {
            urlModalClose();
        }
        restart();
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
    } = useZodForm<EditSecondaryCounterDTO>({
        schema: validationSchema,
        initialValues: initialData,
        onSubmit: (data) => {
            onSave?.(data);
            handleClose();
        },
    });

    return (
        <>
            <Modal
                title="Counter Settings"
                onClose={handleClose}
                isOpen={isOpen}
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    {errors.general && (
                        <FormAlert variant="error" message="errors.general" />
                    )}
                    <Input
                        label="Counter name"
                        value={formData.name}
                        name="name"
                        error={errors.name}
                        onChange={handleFieldChange}
                        onBlur={handleBlur}
                        helpText="e.g. Braid Cable, Sleeve Decrease"
                        success={isFieldValid('name')}
                    />
                    <div className="grid grid-cols-2 gap-x-2.5 gap-y-5">
                        <Input
                            label="Starts on Global Row"
                            value={formData.startsOnGlobalRow}
                            name="startsOnGlobalRow"
                            error={errors.startsOnGlobalRow}
                            onChange={handleFieldChange}
                            onBlur={handleBlur}
                            helpText="When this counter begins"
                            success={isFieldValid('startsOnGlobalRow')}
                        />
                        <Input
                            label="Rows per Repeat"
                            value={formData.rowsPerRepeat}
                            name="rowsPerRepeat"
                            error={errors.rowsPerRepeat}
                            onChange={handleFieldChange}
                            onBlur={handleBlur}
                            helpText="Length of one sequence"
                            success={isFieldValid('rowsPerRepeat')}
                        />
                        <Input
                            label="Total Repeats"
                            value={formData.totalRepeats}
                            error={errors.totalRepeats}
                            name="totalRepeats"
                            onChange={handleFieldChange}
                            onBlur={handleBlur}
                            helpText="How many times it repeats"
                            success={isFieldValid('totalRepeats')}
                        />
                        <Input
                            label="Additional Details"
                            value={formData.notes}
                            error={errors.notes}
                            name="notes"
                            onChange={handleFieldChange}
                            onBlur={handleBlur}
                            helpText="e.g. 3.5mm or Color #76"
                            success={isFieldValid('notes')}
                        />
                    </div>
                    <Button
                        variant="pill"
                        color="primary"
                        type="submit"
                        className="w-full"
                    >
                        {isSubmitting ? 'Updating...' : 'Update'}
                    </Button>
                    <Button
                        variant="text"
                        color="secondary"
                        onClick={handleClose}
                        className="w-full"
                    >
                        Cancel
                    </Button>
                </form>
            </Modal>
            {isSubmitting && <Loading message="Updating counter..." />}
        </>
    );
};

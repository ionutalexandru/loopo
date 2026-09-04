'use client';

import React, { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useUrlModal } from '@/hooks/useUrlModal';
import { SecondaryCounter } from '@/types/project';

export interface SecondaryCounterSettingsModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    paramName?: string;
    paramValue?: string;
    initialData?: Partial<SecondaryCounterFormData>;
    onSave?: (data: SecondaryCounterFormData) => void;
}

export type SecondaryCounterFormData = Omit<
    SecondaryCounter,
    'createdAt' | 'updatedAt' | 'partId'
>;

const DEFAULT_FORM_DATA: SecondaryCounterFormData = {
    id: 'braid',
    name: 'Braid',
    startsOnGlobalRow: 1,
    rowsPerRepeat: 12,
    totalRepeats: 1,
    notes: '',
};

export const SecondaryCounterSettingsModal = ({
    isOpen: controlledIsOpen,
    onClose: controlledOnClose,
    paramName = 'counterSettings',
    paramValue = 'true',
    initialData,
    onSave,
}: SecondaryCounterSettingsModalProps) => {
    const { isOpen: isUrlModalOpen, close: urlModalClose } = useUrlModal(
        paramName,
        paramValue
    );

    const isControlled = controlledIsOpen !== undefined;
    const isOpen = isControlled ? controlledIsOpen : isUrlModalOpen;

    const [formData, setFormData] = useState<SecondaryCounterFormData>({
        ...DEFAULT_FORM_DATA,
        ...initialData,
    });

    if (!isOpen) return null;

    const handleClose = () => {
        if (isControlled) {
            controlledOnClose?.();
        } else {
            urlModalClose();
        }
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        onSave?.(formData);
        handleClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    return (
        <Modal title="Counter Settings" onClose={handleClose} isOpen={isOpen}>
            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    label="Counter name"
                    value={formData.name}
                    name="name"
                    onChange={handleChange}
                    helpText="e.g. Braid Cable, Sleeve Decrease"
                />
                <div className="grid grid-cols-2 gap-x-2.5 gap-y-5">
                    <Input
                        label="Starts on Global Row"
                        value={formData.startsOnGlobalRow}
                        name="startsOnGlobalRow"
                        onChange={handleChange}
                        helpText="When this counter begins"
                    />
                    <Input
                        label="Rows per Repeat"
                        value={formData.rowsPerRepeat}
                        name="rowsPerRepeat"
                        onChange={handleChange}
                        helpText="Length of one sequence"
                    />
                    <Input
                        label="Total Repeats"
                        value={formData.totalRepeats}
                        name="totalRepeats"
                        onChange={handleChange}
                        helpText="How many times it repeats"
                    />
                    <Input
                        label="Additional Details"
                        value={formData.notes}
                        name="notes"
                        onChange={handleChange}
                        helpText="e.g. 3.5mm or Color #76"
                    />
                </div>
                <Button
                    variant="pill"
                    color="primary"
                    type="submit"
                    className="w-full"
                >
                    Save
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
    );
};

'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export interface SecondaryCounterSettingsModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    initialData?: Partial<SecondaryCounterFormData>;
    onSave?: (data: SecondaryCounterFormData) => void;
}

export interface SecondaryCounterFormData {
    counterName: string;
    startsOnGlobalRow: number;
    rowsPerRepeat: number;
    totalRepeats: number;
    additionalDetails: string;
}

const DEFAULT_FORM_DATA: SecondaryCounterFormData = {
    counterName: 'Braid',
    startsOnGlobalRow: 1,
    rowsPerRepeat: 12,
    totalRepeats: 1,
    additionalDetails: '',
};

export const SecondaryCounterSettingsModal = ({
    isOpen: controlledIsOpen,
    onClose: controlledOnClose,
    initialData,
    onSave,
}: SecondaryCounterSettingsModalProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const isControlled = controlledIsOpen !== undefined;
    const urlCounterId = searchParams?.get('counterSettings') ?? undefined;
    const isOpen = isControlled ? controlledIsOpen : Boolean(urlCounterId);

    const [formData, setFormData] = useState<SecondaryCounterFormData>({
        ...DEFAULT_FORM_DATA,
        ...initialData,
    });

    if (!isOpen) return null;

    const handleClose = () => {
        if (isControlled) {
            if (controlledOnClose) controlledOnClose();
        } else {
            const params = new URLSearchParams(searchParams?.toString());

            params.delete('counterSettings');

            const newQuery = params.toString();
            const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;

            router.replace(newUrl, { scroll: false });
        }
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        if (onSave) {
            onSave(formData);
        }
        handleClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center
                backdrop-blur-sm animate-puls overflow-scroll overscroll-contain
                p-4"
        >
            <Card variant="elevated" className="w-sm lg:w-lg gap-5">
                <div className="w-full flex justify-between items-center">
                    <h3 className="capitalize mb-0!">Counter Settings</h3>
                    <Button
                        variant="text"
                        color="secondary"
                        onClick={handleClose}
                        icon={<X />}
                    />
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        label="Counter name"
                        value={formData.counterName}
                        name="counterName"
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
                            name="startsOnGlobalRow"
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
                            value={formData.additionalDetails}
                            name="additionalDetails"
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
            </Card>
        </div>
    );
};

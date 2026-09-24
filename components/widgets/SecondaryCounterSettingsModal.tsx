'use client';

import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useUrlModal } from '@/hooks/useUrlModal';
import {
    BaseSecondaryCounterDTO,
    SecondaryCounterDTO,
    getSecondaryCounterSchema,
} from '@/schemas/secondaryCounterSchema';
import { SecondaryCounter } from '@/types/project';
import { useZodForm } from '@/hooks/useZodForm';
import { FormAlert } from '../ui/FormAlert';
import { Loading } from '../ui/Loading';
import { Trash, X } from 'lucide-react';
import { Card } from '../ui/Card';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface InnerFormProps {
    isCreate: boolean;
    initialData: SecondaryCounterDTO;
    currentGlobalRow: number;
    existingCounters: SecondaryCounter[];
    onSave: (data: BaseSecondaryCounterDTO) => void;
    onDelete?: () => void;
    onClose: () => void;
}

const SecondaryCounterForm = ({
    isCreate,
    initialData,
    currentGlobalRow,
    existingCounters,
    onSave,
    onDelete,
    onClose,
}: InnerFormProps) => {
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    const validationSchema = useMemo(
        () =>
            getSecondaryCounterSchema({
                currentGlobalRow,
                existingCounters,
            }),
        [currentGlobalRow, existingCounters]
    );

    const {
        formData,
        errors,
        isSubmitting,
        handleFieldChange,
        handleBlur,
        isFieldValid,
        handleSubmit,
    } = useZodForm<SecondaryCounterDTO>({
        schema: validationSchema,
        initialValues: initialData,
        onSubmit: (validData) => {
            onSave(validData);
            onClose();
        },
    });

    const handleDelete = () => {
        if (!isConfirmingDelete) {
            setIsConfirmingDelete(true);
            return;
        }
        onDelete?.();
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {errors.general && (
                <FormAlert variant="error" message="errors.general" />
            )}
            <Card variant="elevated" className="flex flex-col gap-6">
                <Input
                    label="Counter name"
                    value={formData.name}
                    name="name"
                    error={errors.name}
                    onChange={handleFieldChange}
                    onBlur={handleBlur}
                    placeholder="e.g. Center Cable, Lace motif"
                    helpText="Identifies this pattern repeat"
                    success={isFieldValid('name')}
                />
                <div className="grid grid-cols-2 gap-x-2.5 gap-y-5">
                    <Input
                        label="Starts on Global Row"
                        value={formData.startsOnGlobalRow}
                        name="startsOnGlobalRow"
                        min="1"
                        inputMode="numeric"
                        type="number"
                        error={errors.startsOnGlobalRow}
                        onChange={handleFieldChange}
                        onBlur={handleBlur}
                        helpText="First row of motif"
                        success={isFieldValid('startsOnGlobalRow')}
                    />
                    <Input
                        label="Rows per Repeat"
                        value={formData.rowsPerRepeat}
                        name="rowsPerRepeat"
                        min="1"
                        inputMode="numeric"
                        type="number"
                        error={errors.rowsPerRepeat}
                        onChange={handleFieldChange}
                        onBlur={handleBlur}
                        helpText="Rows per sequence"
                        success={isFieldValid('rowsPerRepeat')}
                    />
                    <Input
                        label="Total Repeats"
                        value={formData.totalRepeats}
                        error={errors.totalRepeats}
                        name="totalRepeats"
                        min="1"
                        inputMode="numeric"
                        type="number"
                        onChange={handleFieldChange}
                        onBlur={handleBlur}
                        helpText="Number of repetitions"
                        success={isFieldValid('totalRepeats')}
                    />
                    <Input
                        label="Details / Tag"
                        value={formData.notes}
                        error={errors.notes}
                        name="notes"
                        onChange={handleFieldChange}
                        onBlur={handleBlur}
                        placeholder="e.g. 3.5mm or Color #76"
                        helpText="Optional fiber/needle hint"
                        success={isFieldValid('notes')}
                    />
                </div>
            </Card>
            {!isCreate && onDelete && (
                <Card variant="elevated" className="flex flex-col gap-6">
                    <h4 className="text-crimson! mb-0!">Danger zone</h4>
                    <Button
                        variant="pill"
                        color="danger"
                        className="mb-0 w-full"
                        onClick={handleDelete}
                        icon={<Trash />}
                        size="small"
                    >
                        {!isConfirmingDelete
                            ? 'Delete counter'
                            : 'Confirm delete?'}
                    </Button>
                </Card>
            )}
            <div className="flex flex-col gap-2">
                <Button
                    variant="pill"
                    color="primary"
                    type="submit"
                    className="mb-0 w-full"
                    size="small"
                >
                    {isSubmitting
                        ? isCreate
                            ? 'Creating counter...'
                            : 'Saving changes...'
                        : isCreate
                          ? 'Create counter'
                          : 'Save changes'}
                </Button>
                <Button
                    variant="text"
                    color="secondary"
                    onClick={onClose}
                    className="mb-0 w-full"
                    size="small"
                >
                    Cancel
                </Button>
            </div>
            {isSubmitting && (
                <Loading
                    message={
                        isCreate ? 'Creating counter...' : 'Updating counter...'
                    }
                />
            )}
        </form>
    );
};

export interface SecondaryCounterSettingsModalProps {
    paramName?: string;
    currentGlobalRow?: number;
    existingCounters?: SecondaryCounter[];
    onCreate?: (data: BaseSecondaryCounterDTO) => void;
    onUpdate?: (counterId: string, data: BaseSecondaryCounterDTO) => void;
    onDelete?: (counterId: string) => void;
}

export const SecondaryCounterSettingsModal = ({
    paramName = 'counter',
    currentGlobalRow = 0,
    existingCounters = [],
    onCreate,
    onUpdate,
    onDelete,
}: SecondaryCounterSettingsModalProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const activeParam = searchParams.get(paramName);
    const isOpen = Boolean(activeParam);
    const isCreate = activeParam === 'new';

    const editingCounter = useMemo(() => {
        if (!isOpen || isCreate) return undefined;
        return existingCounters.find((c) => c.id === activeParam);
    }, [isOpen, isCreate, existingCounters, activeParam]);

    const handleClose = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete(paramName);
        const query = params.toString();
        router.push(query ? `${pathname}?${query}` : pathname, {
            scroll: false,
        });
    };

    if (!isOpen || (!isCreate && !editingCounter)) {
        return null;
    }

    const initialData: SecondaryCounterDTO = isCreate
        ? {
              name: '',
              startsOnGlobalRow: currentGlobalRow > 0 ? currentGlobalRow : 1,
              rowsPerRepeat: 4,
              totalRepeats: 1,
              notes: '',
          }
        : {
              id: editingCounter!.id,
              name: editingCounter!.name,
              startsOnGlobalRow: editingCounter!.startsOnGlobalRow,
              rowsPerRepeat: editingCounter!.rowsPerRepeat,
              totalRepeats: editingCounter!.totalRepeats,
              notes: editingCounter!.notes ?? '',
          };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            maxWidth="lg"
            cartProps={{ variant: 'ghost' }}
            showCloseButton={false}
            containerClassName="backdrop-blur-xl"
        >
            <div className="flex w-full items-center justify-between">
                <span className="text-misty-gray text-base font-black uppercase">
                    {isCreate ? 'New repeat pattern' : 'Pattern repeat setup'}
                </span>
                <Button
                    variant="squared"
                    color="secondary"
                    onClick={handleClose}
                    icon={<X />}
                />
            </div>

            <h3 className="my-2">
                {isCreate
                    ? 'Add Secondary Counter'
                    : `${editingCounter!.name} Settings`}
            </h3>

            <SecondaryCounterForm
                key={activeParam}
                isCreate={isCreate}
                initialData={initialData}
                currentGlobalRow={currentGlobalRow}
                existingCounters={existingCounters}
                onSave={(data) => {
                    if (isCreate) {
                        onCreate?.(data);
                    } else if (editingCounter) {
                        onUpdate?.(editingCounter.id, data);
                    }
                }}
                onDelete={
                    editingCounter
                        ? () => onDelete?.(editingCounter.id)
                        : undefined
                }
                onClose={handleClose}
            />
        </Modal>
    );
};

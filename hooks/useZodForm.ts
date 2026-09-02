import { useCallback, useState } from 'react';
import { z } from 'zod';

export type FieldErrors<T> = Partial<Record<keyof T | 'general', string>>;
export type TouchedFields<T> = Partial<Record<keyof T, boolean>>;

interface UseZodFormOptions<TInput extends Record<string, unknown>, TOutput> {
    schema: z.ZodType<TOutput, unknown>;
    initialValues: TInput;
    onSubmit: (data: TOutput) => Promise<void> | void;
}

export function useZodForm<
    TInput extends Record<string, unknown>,
    TOutput = TInput,
>({ schema, initialValues, onSubmit }: UseZodFormOptions<TInput, TOutput>) {
    const [formData, setFormData] = useState<TInput>(initialValues);
    const [errors, setErrors] = useState<FieldErrors<TInput>>({});
    const [touched, setTouched] = useState<TouchedFields<TInput>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = useCallback(
        (data: TInput): { isValid: boolean; data: TOutput | null } => {
            const result = schema.safeParse(data);

            if (!result.success) {
                const formattedError: FieldErrors<TInput> = {};
                result.error.issues.forEach((iss) => {
                    const fieldName = iss.path[0] as keyof TInput;
                    if (fieldName && !formattedError[fieldName]) {
                        formattedError[fieldName] = iss.message;
                    }
                });
                setErrors(formattedError);
                return { isValid: false, data: null };
            }

            return { isValid: true, data: result.data };
        },
        [schema]
    );

    const handleFieldChange = useCallback(
        (
            event: React.ChangeEvent<
                HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
            >
        ) => {
            const {
                target: { name: field, value },
            } = event;

            setFormData((prev) => ({ ...prev, [field]: value }));

            setTouched((prev) => {
                if (!prev[field] && String(value).trim().length > 0) {
                    return { ...prev, [field]: true };
                }
                return prev;
            });

            setErrors((prev) => {
                if (prev[field]) {
                    return { ...prev, [field]: undefined };
                }
                return prev;
            });
        },
        []
    );

    const handleBlur = useCallback(
        (
            event: React.FocusEvent<
                HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
            >
        ) => {
            const {
                target: { name: field },
            } = event;
            setTouched((prev) => ({ ...prev, [field]: true }));
            validate(formData);
        },
        [validate, formData]
    );

    const isFieldValid = useCallback(
        (field: keyof TInput): boolean => {
            if (!touched[field]) return false;
            if (errors[field]) return false;

            const val = formData[field];
            if (typeof val === 'string') return val.trim().length > 0;
            return val !== undefined && val !== null;
        },
        [errors, formData, touched]
    );

    const handleSubmit = async () => {
        const allTouched = Object.keys(formData).reduce((acc, key) => {
            acc[key as keyof TInput] = true;
            return acc;
        }, {} as TouchedFields<TInput>);
        setTouched(allTouched);

        const { isValid, data } = validate(formData);
        if (!isValid || !data) return;

        setIsSubmitting(true);

        try {
            await onSubmit(data);
        } catch (err: unknown) {
            setErrors((prev) => ({
                ...prev,
                general:
                    err instanceof Error
                        ? err.message
                        : 'An unexpected error ocurred. Please try again.',
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        errors,
        touched,
        isSubmitting,
        handleFieldChange,
        handleBlur,
        isFieldValid,
        handleSubmit,
        setFormData,
    };
}

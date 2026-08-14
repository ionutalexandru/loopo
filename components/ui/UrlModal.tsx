'use client';

import { Modal, ModalProps } from '@/components/ui/Modal';
import { useUrlModal } from '@/hooks/useUrlModal';

export interface UrlModalProps extends Omit<ModalProps, 'isOpen' | 'onClose'> {
    paramName: string;
    paramValue: string;
}

export const UrlModal = ({
    paramName,
    paramValue,
    children,
    ...props
}: UrlModalProps) => {
    const { isOpen, close } = useUrlModal(paramName, paramValue);
    return (
        <Modal isOpen={isOpen} onClose={close} {...props}>
            {children}
        </Modal>
    );
};

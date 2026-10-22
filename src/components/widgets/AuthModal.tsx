import { useAuthStore } from '@/store/useAuthStore';
import React, { useState } from 'react';
import {
    Check,
    KeyRound,
    Lock,
    ShieldAlert,
    UserCircle,
    X,
} from 'lucide-react';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Input } from '@/components/ui/Input';

export const AuthModal = () => {
    const {
        user,
        error,
        isAuthModalOpen,
        isPasswordRecovery,
        signInWithPassword,
        updatePassword,
        signOut,
        closeAuthModal,
        clearError,
    } = useAuthStore();

    // Login inputs
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // Recovery password inputs
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassowrd] = useState<string>('');
    const [passwordUpdated, setPasswordUpdated] = useState<boolean>(false);

    // Form
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleLoginSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) return;

        setIsSubmitting(true);
        const { success } = await signInWithPassword(email, password);
        setIsSubmitting(false);

        if (success) {
            closeAuthModal();
            setEmail('');
            setPassword('');
        }
    };

    const handlePasswordUpdateSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        clearError();

        if (newPassword.length < 6) {
            useAuthStore.setState({
                error: 'Password must be at least 6 characters.',
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            useAuthStore.setState({
                error: 'Password do not match.',
            });
            return;
        }

        setIsSubmitting(true);
        const { success } = await updatePassword(newPassword);
        setIsSubmitting(false);

        if (success) {
            setPasswordUpdated(true);
            setNewPassword('');
            setConfirmPassowrd('');
        }
    };

    const handleClose = () => {
        clearError();
        setPasswordUpdated(false);
        closeAuthModal();
    };

    const getModalTitle = () => {
        if (isPasswordRecovery) return 'Set New Password';
        if (user) return 'Account';
        return 'Private Access';
    };

    const renderError = () => {
        if (!error) return null;
        return (
            <div className="mt-4 flex flex-col gap-4">
                <Alert variant="error" message={error} />
            </div>
        );
    };

    const renderBody = () => {
        // Password recovery state
        if (isPasswordRecovery) {
            return (
                <Card variant="elevated" className="flex flex-col gap-6">
                    <h4 className="text-vibrant-coral mb-0!">
                        Enter your new credentials to proceed
                    </h4>
                    {!passwordUpdated ? (
                        <form
                            onSubmit={handlePasswordUpdateSubmit}
                            className="space-y-5"
                        >
                            {renderError()}
                            <Input
                                label="New Password"
                                type="password"
                                placeholder="••••••••"
                                onChange={({ target: { value } }) =>
                                    setNewPassword(value)
                                }
                                autoComplete="new-password"
                            />
                            <Input
                                label="Confirm Password"
                                type="password"
                                placeholder="••••••••"
                                onChange={({ target: { value } }) =>
                                    setConfirmPassowrd(value)
                                }
                                autoComplete="confirm-password"
                            />
                            <Button
                                type="submit"
                                variant="squared"
                                size="small"
                                disabled={
                                    isSubmitting ||
                                    !newPassword ||
                                    !confirmPassword
                                }
                                icon={<KeyRound />}
                            >
                                {isSubmitting
                                    ? 'Saving...'
                                    : 'Save new password'}
                            </Button>
                        </form>
                    ) : (
                        <div className="space-y-5">
                            <div className="text-vibrant-coral flex items-center gap-3">
                                <Check size="20" />
                                <h4 className="mb-0">Password updated!</h4>
                            </div>
                            <p className="lead">
                                Your new password has been saved and your
                                session is active.
                            </p>
                            <Button
                                variant="squared"
                                size="small"
                                onClick={handleClose}
                            >
                                Continue to My Basket
                            </Button>
                        </div>
                    )}
                </Card>
            );
        }

        // Authenticated state
        if (user) {
            return (
                <Card variant="elevated" className="flex flex-col gap-6">
                    <div className="text-vibrant-coral flex items-center gap-3">
                        <UserCircle size="20" />
                        <h4 className="mb-0">
                            Hello, <em>{user.email}</em>
                        </h4>
                    </div>
                    <p className="lead">
                        Your projects and stitch counters are securely
                        synchronized with the cloud.
                    </p>
                    <Alert
                        icon={<ShieldAlert />}
                        message="If you sign out, your local data will be cleared from this device for security, but all your projects remain safely stored in the cloud."
                        variant="warning"
                        dismissible={false}
                    />
                    <Button
                        variant="squared"
                        size="small"
                        color="danger"
                        onClick={() => {
                            if (
                                window.confirm(
                                    'Are you sure you want to sign out? Local data on this device will be cleared, but your cloud backup is safe.'
                                )
                            ) {
                                signOut();
                                handleClose();
                            }
                        }}
                    >
                        Sign Out
                    </Button>
                </Card>
            );
        }

        // Sign in state
        return (
            <Card variant="elevated" className="flex flex-col gap-6">
                <Alert
                    icon={<ShieldAlert />}
                    message="Registration is private. Access is reserved for accounts
                        provisioned by the administrator."
                    variant="warning"
                    dismissible={false}
                />
                {renderError()}
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="name@example.org"
                        onChange={({ target: { value } }) => setEmail(value)}
                        autoComplete="email"
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        onChange={({ target: { value } }) => setPassword(value)}
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        variant="squared"
                        size="small"
                        disabled={
                            isSubmitting || !email.trim() || !password.trim()
                        }
                        icon={<Lock />}
                    >
                        {isSubmitting ? 'Signing in...' : 'Sign in'}
                    </Button>
                </form>
            </Card>
        );
    };

    return (
        <Modal
            isOpen={isAuthModalOpen}
            onClose={handleClose}
            maxWidth="lg"
            cartProps={{ variant: 'ghost' }}
            showCloseButton={false}
            containerClassName="backdrop-blur-xl"
        >
            <div className="mb-4 flex w-full items-center justify-between!">
                <span className="text-misty-gray text-base font-black uppercase">
                    {getModalTitle()}
                </span>
                <Button
                    variant="squared"
                    color="secondary"
                    onClick={handleClose}
                    icon={<X />}
                />
            </div>
            {renderBody()}
        </Modal>
    );
};

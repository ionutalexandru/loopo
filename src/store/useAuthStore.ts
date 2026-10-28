import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useProjectStore } from '@/store/useProjectStore';
import { syncBidirectional } from '@/services/syncService';

interface AuthState {
    // State
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    error: string | null;
    isAuthModalOpen: boolean;
    isPasswordRecovery: boolean;

    // Actions
    initialize: () => Promise<void>;
    signInWithPassword: (
        email: string,
        password: string
    ) => Promise<{ success: boolean; error?: string }>;
    updatePassword: (newPassword: string) => Promise<{
        success: boolean;
        error?: string;
    }>;
    signOut: () => void;
    openAuthModal: () => void;
    closeAuthModal: () => void;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    session: null,
    isLoading: true,
    error: null,
    isAuthModalOpen: false,
    isPasswordRecovery: false,
    initialize: async () => {
        try {
            set({ isLoading: true });

            // CRITICAL: Wait for IndexedDB project storage to fully hydrate
            // before checking session or adopting projects.
            if (!useProjectStore.persist.hasHydrated()) {
                await new Promise<void>((resolve) => {
                    const unsubscribe =
                        useProjectStore.persist.onFinishHydration(() => {
                            unsubscribe();
                            resolve();
                        });
                });
            }
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession();
            if (error) throw error;
            if (session?.user) {
                useProjectStore.getState().adoptLocalProject(session.user.id);
                syncBidirectional(session.user.id);
            }
            set({
                session,
                user: session?.user ?? null,
                isLoading: false,
            });
            // List to auth event changes (sign-in, token refresh, password recovery)
            supabase.auth.onAuthStateChange((event, currentSession) => {
                if (event === 'PASSWORD_RECOVERY') {
                    set({
                        isPasswordRecovery: true,
                        isAuthModalOpen: true,
                    });
                }

                if (currentSession?.user) {
                    useProjectStore
                        .getState()
                        .adoptLocalProject(currentSession.user.id);
                }

                set({
                    session,
                    user: currentSession?.user ?? null,
                    isLoading: false,
                });
            });
        } catch {
            set({ isLoading: false });
        }
    },
    signInWithPassword: async (email: string, password: string) => {
        set({ error: null });
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            if (data.user) {
                useProjectStore.getState().adoptLocalProject(data.user.id);
            }
            return { success: true };
        } catch (err: any) {
            const message = err.message ?? 'Failed to sign in.';
            set({ error: message });
            return { success: false, error: message };
        }
    },
    updatePassword: async (newPassword: string) => {
        set({ error: null });
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });
            if (error) throw error;
            set({ isPasswordRecovery: false });
            return { success: true };
        } catch (err: any) {
            const message = err.message ?? 'Failed to update passowrd.';
            set({ error: message });
            return { success: false, error: message };
        }
    },
    signOut: async () => {
        set({ error: null, isLoading: true });
        await supabase.auth.signOut();
        // clean local projects as user has changed
        useProjectStore.setState({ projects: [] });
        set({
            user: null,
            session: null,
            isLoading: false,
            error: null,
            isPasswordRecovery: false,
        });
    },
    openAuthModal: () => set({ isAuthModalOpen: true, error: null }),
    closeAuthModal: () =>
        set({ isAuthModalOpen: false, error: null, isPasswordRecovery: false }),
    clearError: () => set({ error: null }),
}));

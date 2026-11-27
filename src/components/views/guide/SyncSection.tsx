import { GuideScreenshot } from './GuideScreenshot';

export default function SyncSection() {
    return (
        <div className="animate-fade-in space-y-4">
            <h2>7. Cloud Sync & Offline Mode</h2>
            <p className="lead">
                Knit on the porch, in a cozy cabin in the woods, or high up in
                the air. Loopo goes wherever your yarn takes you.
            </p>
            <hr />
            <GuideScreenshot
                src="/userguide/sync-cloud-status.png"
                alt="Account sign-in modal and cloud synchronization view for backing up Loopo projects across devices"
                caption="Sign in anytime to back up your local basket and sync progress across your phone, tablet, and laptop."
            />
            <h3>Work Offline with Confidence</h3>
            <p>
                We built Loopo with offline-first local storage (IndexedDB). If
                your internet drops or you're crafting far away from a router,
                every tap, row increment, and note is saved securely right on
                your device without missing a beat.
            </p>
            <h3>Seamless Cloud Backup</h3>
            <p>
                As soon as an active internet connection is restored, Loopo
                quietly and automatically synchronizes your progress to Supabase
                in real time. Your projects stay safely updated across your
                phone, tablet, and laptop without you ever having to lift a
                finger.
            </p>
        </div>
    );
}

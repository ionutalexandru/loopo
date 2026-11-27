import { GuideScreenshot } from './GuideScreenshot';

export default function FaqSection() {
    return (
        <div className="animate-fade-in space-y-4">
            <h2>8. FAQ & Troubleshooting</h2>
            <p className="lead">
                Got questions? We've gathered answers to the things fellow
                makers ask us most often about data safety, guest browsing, and
                project backups.
            </p>
            <hr />
            <h3 className="italic">
                What happens if I clear my browser cache?
            </h3>
            <p>
                If you are using Loopo in <strong>Guest Mode</strong> without
                signing into an account, your projects live exclusively inside
                your browser's local storage. Clearing your cache or browsing
                data will wipe local records. We always recommend signing in
                with a cloud account to ensure your precious projects have an
                automatic backup!
            </p>
            <h3 className="italic">
                Can I use Loopo on multiple devices at the same time?
            </h3>
            <div className="flex w-full flex-col items-center gap-4 md:flex-row">
                <GuideScreenshot
                    src="/userguide/faq-account-backup.png"
                    alt="Cloud account backup options illustrating how to keep project progress safe across sessions and devices"
                    caption="Keep a free cloud account linked so your knitting and crochet history stays safe even if you clear browser data."
                    className="order-last w-full md:order-first md:w-1/3"
                />
                <p className="w-full md:w-2/3">
                    Yes! Once you sign in with your cloud account, your projects
                    sync smoothly across all your devices, meaning you can check
                    rows on your phone while lounging on the sofa and pick right
                    up on your tablet later.
                </p>
            </div>
            <blockquote>
                <strong>Need more help?</strong> Feel free to reach out or check
                our repository updates if you encounter any bumps along your
                crafting journey.
            </blockquote>
        </div>
    );
}

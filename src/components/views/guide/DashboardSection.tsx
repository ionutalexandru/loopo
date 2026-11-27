import { GuideScreenshot } from './GuideScreenshot';

export default function DashboardSection() {
    return (
        <div className="animate-fade-in space-y-4">
            <h2>3. My Basket & Dashboard</h2>
            <p className="lead">
                Welcome to your project basket—the cozy digital shelf where all
                your knitting and crochet works-in-progress live together in
                harmony.
            </p>
            <hr />
            <GuideScreenshot
                src="/userguide/basket-dashboard.png"
                alt="My Basket dashboard showing knitting and crochet project cards, progress bars, and the active projects filter"
                caption="Your basket shows active works-in-progress, live progress bars, and the last part you worked on."
            />
            <h3>Your Crafting Hub</h3>
            <p>
                Whenever you open Loopo, your dashboard greets you with a clear
                overview of everything on your needles or hooks. No more hunting
                through messy notebooks or loose scraps of paper; your entire
                collection is safely organized right at a glance.
            </p>

            <h3>Key Features & Controls</h3>
            <ul>
                <li>
                    <strong>Start a New Project:</strong> Tap the{' '}
                    <em>"Start a new project"</em> button in the hero card
                    whenever inspiration strikes to set up your project name,
                    craft type (knit or crochet), pattern name, and custom
                    notes.
                </li>
                <li>
                    <strong>Active vs. All Filter:</strong> Use the{' '}
                    <strong>"Active only"</strong> toggle switch at the top of
                    your basket to hide completed or paused pieces, allowing you
                    to focus solely on what is currently active on your needles.
                </li>
                <li>
                    <strong>Live Progress Tracking:</strong> Each project card
                    features a clean linear progress bar and a percentage
                    tracker calculated automatically from your row counts and
                    targets.
                </li>
                <li>
                    <strong>Active Part & Timestamp Indicators:</strong>{' '}
                    Instantly see which specific garment panel you worked on
                    last (e.g., <em>Front Panel • 240/320</em>) alongside
                    relative timestamps like <em>"2h ago"</em>.
                </li>
            </ul>

            <blockquote>
                <strong>Pro Tip:</strong> Tapping any project card transports
                you straight into its active row counter and part navigator,
                saving precious time so you can get right back to your stitching
                rhythm.
            </blockquote>
        </div>
    );
}

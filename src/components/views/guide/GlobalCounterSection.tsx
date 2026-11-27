import { GuideScreenshot } from './GuideScreenshot';

export default function GlobalCounterSection() {
    return (
        <div className="animate-fade-in space-y-4">
            <h2>5. Global Row Counter</h2>
            <p className="lead">
                The gentle heartbeat of Loopo. Designed for pure tactile comfort
                so you can keep your eyes on your pattern and your hands safely
                on your needles.
            </p>
            <hr />
            <GuideScreenshot
                src="/userguide/global-counter.png"
                alt="Global row counter card displaying the current row number, target rows, and linear progress bar"
                caption="Tap anywhere on the counter card to log a row, or step back easily if you need to tink."
            />
            <h3>Counting Made Effortless</h3>
            <p>
                No more squinting at mechanical clickers or fumbling with paper
                tallies. You can tap virtually anywhere on the counter card to
                increment your row count instantly. As you progress, the clean
                progress bar fills up smoothly, celebrating every milestone you
                cross.
            </p>
        </div>
    );
}

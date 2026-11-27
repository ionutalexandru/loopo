import { GuideScreenshot } from './GuideScreenshot';

export default function SecondaryCountersSection() {
    return (
        <div className="animate-fade-in space-y-4">
            <h2>6. Secondary Counters</h2>
            <p className="lead">
                Your reliable co-pilot for independent repeating lace patterns,
                cable motifs, or complex stripe sequences that don't align with
                your main row count.
            </p>
            <hr />
            <GuideScreenshot
                src="/userguide/secondary-counter-setup.png"
                alt="Secondary counter configuration modal showing starting global row, rows per repeat, and total repeats"
                caption="Set the starting global row, repeat length, and total repeats to let Loopo track complex motifs for you."
            />
            <h3>Conquering Complex Charts</h3>
            <p>
                We've all been there: your part is on row 20, but your lace
                chart needs to repeat a 8-row motif starting back from row 10.
                Keeping that math straight in your head is a recipe for
                frogging.
            </p>
            <p>
                Secondary counters handle the heavy lifting for you by tracking
                sub-patterns independently:
            </p>
            <ul>
                <li>
                    <strong>Starting Global Row:</strong> Define precisely on
                    which global row the motif begins (e.g.,{' '}
                    <code>startsOnGlobalRow: 10</code>).
                </li>
                <li>
                    <strong>Repeat Length:</strong> Set how many rows each
                    individual chart repetition lasts (e.g.,{' '}
                    <code>rowsPerRepeat: 8</code>).
                </li>
                <li>
                    <strong>Total Repeats:</strong> Keep tabs on how many times
                    the sequence needs to run (e.g.,{' '}
                    <code>totalRepeats: 2</code>).
                </li>
            </ul>
        </div>
    );
}

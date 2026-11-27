import { GuideScreenshot } from './GuideScreenshot';

export default function WelcomeSection() {
    return (
        <div className="animate-fade-in space-y-4">
            <h2>1. Introduction & Welcome</h2>
            <p className="lead">
                Take a deep breath, grab your favorite yarn, and let Loopo
                handle the counting. Designed to stay quietly out of your way
                while you get lost in your rhythm.
            </p>
            <hr />
            <GuideScreenshot
                src="/userguide/welcome-overview.png"
                alt="Loopo workspace overview displaying an active crafting project with row counter and progress indicator"
                caption="Your projects, row counters, and yarn notes gathered in one calm workspace."
            />
            <h3>Meet Loopo</h3>
            <p>
                We know how easy it is to lose count when you are caught up in a
                good podcast, a movie, or a cozy afternoon of crafting. Whether
                you are knitting a simple ribbed scarf or untangling an
                intricate multi-part colorwork sweater, Loopo keeps your rows
                and stitches safely organized right by your side.
            </p>
            <h3>Who is it for?</h3>
            <ul>
                <li>
                    <strong>Knitters</strong>: Manage garment panels, decrease
                    intervals, and cable repeats easily.
                </li>
                <li>
                    <strong>Crocheters</strong>: Track granny squares, tension
                    changes, and multi-row motif sequences.
                </li>
            </ul>
        </div>
    );
}

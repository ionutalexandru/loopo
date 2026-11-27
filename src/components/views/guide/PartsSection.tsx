import { GuideScreenshot } from './GuideScreenshot';

export default function PartsSection() {
    return (
        <div className="animate-fade-in space-y-4">
            <h2>4. Project Parts & Materials</h2>
            <p className="lead">
                Great sweaters aren't knitted all in one breath. Break down
                complex garments into manageable pieces like sleeves, back
                panels, or delicate lace collars.
            </p>
            <hr />
            <GuideScreenshot
                src="/userguide/parts-materials.png"
                alt="Project parts navigation bar alongside needle size and yarn colorway tags for individual garment pieces"
                caption="Switch smoothly between sleeves, body panels, and collars—each with its own needle and yarn tags."
            />
            <h3>Managing Garment Sections</h3>
            <p>
                A multi-part project can feel overwhelming if you try to track
                everything at once. Loopo lets you divide your creation into
                distinct parts (such as <em>Back part</em>, <em>Left sleeve</em>
                , or <em>Ribbing Collar</em>), each with its own independent row
                counter and progress milestones.
            </p>
            <h3>Yarn & Needle Specifications</h3>
            <p>
                Keep all your technical notes right where you need them. For
                every individual part, you can specify:
            </p>
            <ul>
                <li>
                    <strong>Needle/Hook Sizes:</strong> Pinpoint your exact
                    gauge tool in millimeters (e.g., <code>4.0 mm</code>) or
                    standard sizing.
                </li>
                <li>
                    <strong>Yarn Details:</strong> Note down brand names,
                    colorways, and dye lot batch codes so you never mix up
                    matching skeins.
                </li>
            </ul>
        </div>
    );
}

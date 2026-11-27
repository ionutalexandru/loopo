export default function GettingStartedSection() {
    return (
        <div className="animate-fade-in space-y-4">
            <h2>2. Getting Started & PWA</h2>
            <p className="lead">
                Bring Loopo right to your fingertips. Set it up on your phone or
                tablet so it rests comfortably by your yarn basket, ready
                whenever inspiration strikes.
            </p>
            <hr />
            <h3>Installing as a Progressive Web App (PWA)</h3>
            <p>
                You don't need to visit an app store or download heavy updates.
                Loopo is built as a PWA, meaning you can install it directly
                from your browser for a clean, full-screen, distraction-free
                experience that works seamlessly even when Wi-Fi doesn't reach
                your favorite armchair.
            </p>
            <ul>
                <li>
                    <strong>iOS (Safari):</strong> Tap the <em>Share</em> button
                    in your browser toolbar and select{' '}
                    <strong>"Add to Home Screen"</strong>.
                </li>
                <li>
                    <strong>Android (Chrome):</strong> Tap the menu dots in the
                    top right corner and select{' '}
                    <strong>"Install and create shortcut"</strong>.
                </li>
            </ul>
            <blockquote>
                <strong>Pro Tip:</strong> Once installed, Loopo opens instantly
                in its own clean window, leaving browser tabs far behind so you
                can focus entirely on your stitches.
            </blockquote>
        </div>
    );
}

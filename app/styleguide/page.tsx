'use client';

import { Suspense, useState } from 'react';
import { Sparkles, Plus, Search, Trash2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Toggle } from '@/components/ui/Toggle';
import { Tag } from '@/components/ui/Tag';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ProjectCard } from '@/components/widgets/ProjectCard';
import { GlobalCounter } from '@/components/widgets/GlobalCounter';
import { RowAlert } from '@/components/widgets/RowAlert';
import { SecondaryCounter } from '@/components/widgets/SecondaryCounter';
import {
    SecondaryCounterSettingsModal,
    SecondaryCounterFormData,
} from '@/components/widgets/SecondaryCounterSettingsModal';
import { ProjectPartsNav } from '@/components/navigation/ProjectPartsNav';
import { Modal } from '@/components/ui/Modal';
import { UrlModal } from '@/components/ui/UrlModal';
import { useUrlModal } from '@/hooks/useUrlModal';
import { FormAlert } from '@/components/ui/FormAlert';

const SECONDARY_COUNTER_MOCK_DATA: Record<string, SecondaryCounterFormData> = {
    braid: {
        id: 'braid',
        counterName: 'Braid',
        startsOnGlobalRow: 30,
        rowsPerRepeat: 12,
        totalRepeats: 4,
        additionalDetails: '3.5mm',
    },
    sleve: {
        id: 'sleve',
        counterName: 'Sleve',
        startsOnGlobalRow: 80,
        rowsPerRepeat: 40,
        totalRepeats: 1,
        additionalDetails: 'Color #75',
    },
};

const DEMO_PARTS = [
    { id: 'neck', label: 'Neck' },
    { id: 'back', label: 'Back part' },
    { id: 'front', label: 'Front part' },
    { id: 'left-sleeve', label: 'Left sleeve' },
    { id: 'right-sleeve', label: 'Right sleeve' },
    { id: 'collar', label: 'Ribbing Collar' },
];

function StyleGuidePage() {
    const searchParams = useSearchParams();
    const activeCounterKey = searchParams.get('counterSettings');
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [activePart, setActivePart] = useState('front');
    const secondaryCounterInitialData = activeCounterKey
        ? SECONDARY_COUNTER_MOCK_DATA[activeCounterKey]
        : undefined;
    const { open: openDemoUrlModal } = useUrlModal('modal', 'demo');

    return (
        <main className="mx-auto min-h-screen max-w-6xl p-8">
            <header className="border-chalk-gray mb-12 border-b pb-6">
                <h1>
                    loopo<span className="loopo-dot"></span> StyleGuide
                </h1>
            </header>
            <div className="grid grid-cols-1 gap-8">
                <Card variant="bordered">
                    <h2>Color Pallete</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            {
                                name: 'Pure Wool',
                                hex: '#FFFFFF',
                                class: 'bg-pure-wool text-charcoal',
                            },
                            {
                                name: 'Wool',
                                hex: '#F9EDE4',
                                class: 'bg-wool text-charcoal',
                            },
                            {
                                name: 'Bone White',
                                hex: '#FDFBF7',
                                class: 'bg-bone-white text-charcoal',
                            },
                            {
                                name: 'Charcoal',
                                hex: '#1C1C1E',
                                class: 'bg-charcoal text-white',
                            },
                            {
                                name: 'Chalk Gray',
                                hex: '#EFEFF4',
                                class: 'bg-chalk-gray text-charcoal',
                            },
                            {
                                name: 'Concrete Gray',
                                hex: '#E5E5EA',
                                class: 'bg-concrete-gray text-charcoal',
                            },
                            {
                                name: 'Misty Gray',
                                hex: '#A1A1AA',
                                class: 'bg-misty-gray text-white',
                            },
                            {
                                name: 'Steel Needle',
                                hex: '#B1B2B5',
                                class: 'bg-steel-needle text-white',
                            },
                            {
                                name: 'Vibrant Coral',
                                hex: '#FF5A5F',
                                class: 'bg-vibrant-coral text-white',
                            },
                            {
                                name: 'Deep Coral',
                                hex: '#E04E53',
                                class: 'bg-deep-coral text-white',
                            },
                            {
                                name: 'Crimson',
                                hex: '#DC143C',
                                class: 'bg-crimson text-white',
                            },
                            {
                                name: 'Deep Crimson',
                                hex: '#8B0A26',
                                class: 'bg-deep-crimson text-white',
                            },
                        ].map((color) => (
                            <div
                                key={color.hex}
                                className={`rounded-xl p-4 ${color.class}
                                border-charcoal flex h-24 flex-col
                                justify-between border`}
                            >
                                <span className="text-sm font-bold">
                                    {color.name}
                                </span>
                                <span className="font-mono text-xs opacity-80">
                                    {color.hex}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card variant="bordered">
                    <h2>Editorial Hierarchy & Micro-Layouts</h2>
                    <p>
                        Automated rich text behaviors compiled from the global
                        CSS base layer.
                    </p>
                    <hr />
                    {/* HEADINGS */}
                    <div className="space-y-6">
                        <div className="sg-subtitle">Headings Hierarchy</div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    font-comfortaa / H1
                                </code>
                                <strong>Usage</strong>: Primary branding nodes,
                                splash states, and high level summary headlines.
                            </div>
                            <div className="sg-preview">
                                <h1>
                                    Unwind your yarn
                                    <span className="loopo-dot"></span>
                                </h1>
                            </div>
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">font-outfit / H2</code>
                                <strong>Usage</strong>: Bento cards typography
                                anchor and secondary module labels.
                            </div>
                            <div className="sg-preview">
                                <h2>Active Crochet Projects</h2>
                            </div>
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">font-outfit / H3</code>
                                <strong>Usage</strong>: Inner card settings
                                labels and listing group headers.
                            </div>
                            <div className="sg-preview">
                                <h3>Granny Square Blanket Blueprint</h3>
                            </div>
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">font-outfit / H4</code>
                                <strong>Usage</strong>: Micro-headers, metadata
                                descriptors, and explicit context toggles.
                                Always paired with compact heights.
                            </div>
                            <div className="sg-preview">
                                <h4>Stitch Parameters (US Terms)</h4>
                            </div>
                        </div>
                    </div>
                    <hr />
                    {/* PARAGRAPH */}
                    <div className="space-y-6">
                        <div className="sg-subtitle">
                            Paragraph Blocks & Messaging
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    Paragraph Lead (.lead)
                                </code>
                                <strong>Usage</strong>: High prominence copy
                                introduction chunks. Maximized readability
                                layout.
                            </div>
                            <div className="sg-preview">
                                <p className="lead">
                                    Keep track of your complex crochet patterns
                                    effortlessly. Loopo syncs your counters,
                                    targets, and yarn stock parameters safely.
                                </p>
                            </div>
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">Paragraph Base</code>
                                <strong>Usage</strong>: Default descriptive logs
                                or standard blocking instructions. Uses 80%
                                subtle tone density.
                            </div>
                            <div className="sg-preview">
                                <p>
                                    To initiate this row sequence, hook into the
                                    second loop slot from the base connector.
                                    Double loop your thread chain, pulling tight
                                    with uniform wrist pressure.
                                </p>
                            </div>
                        </div>
                    </div>
                    <hr />
                    {/* LISTS & BLOCKQUOTES */}
                    <div className="space-y-6">
                        <div className="sg-subtitle">Lists & Blockquotes</div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    Unordered Rich List
                                </code>
                                Utilized for equipment audits, material
                                breakdowns, or supply prerequisites.
                            </div>
                            <div className="sg-preview">
                                <ul>
                                    <li>
                                        4.5mm ergonomic bamboo knitting hook
                                        connector
                                    </li>
                                    <li>
                                        2 units of worsted weight merino wool
                                        blend
                                    </li>
                                    <li>
                                        Modular locking steel safety ring clip
                                        markers
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    Ordered Process List
                                </code>
                                Linear chronological instructions where
                                execution sequence impacts tension safety.
                            </div>
                            <div className="sg-preview">
                                <ol>
                                    <li>
                                        Create a secure slip loop anchor leaving
                                        a 4-inch tail.
                                    </li>
                                    <li>
                                        Wrap the thread three separate times
                                        over the upper shaft.
                                    </li>
                                    <li>
                                        Thread cleanly through the base node and
                                        verify loop numbers.
                                    </li>
                                </ol>
                            </div>
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    Blockquote Highlight
                                </code>
                                Designated for pattern expert insights, core
                                technical advice, or caution notes.
                            </div>
                            <div className="sg-preview">
                                <blockquote>
                                    <strong>Pro Tip</strong>: If you notice the
                                    outer rows curling up during the fourth
                                    segment swap, ease your needle gauge tension
                                    or advance up a half-millimeter hook frame
                                    size immediately.
                                </blockquote>
                            </div>
                        </div>
                    </div>
                </Card>
                <Card variant="bordered">
                    <h2>Surfaces and containers</h2>
                    <p>
                        The structural layout foundations of Loopo. Three
                        distinct canvas behaviors to group information
                        hierarchies.
                    </p>
                    <div className="space-y-6">
                        <div className="sg-subtitle">Surface Variants</div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    variant=&#34;bordered&#34;
                                </code>
                                <strong>Usage</strong>: The standard workspace
                                container. Uses a crisp, thin outline with an
                                absolute minimum shadow to encapsulate
                                interactive modules, lists, and tools.
                            </div>
                            <div className="sg-preview">
                                <Card variant="bordered">
                                    <p className="lead">
                                        Keep track of your complex crochet
                                        patterns effortlessly. Loopo syncs your
                                        counters, targets, and yarn stock
                                        parameters safely.
                                    </p>
                                </Card>
                            </div>
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    variant=&#34;flat&#34;
                                </code>
                                <strong>Usage</strong>: Secondary or tertiary
                                tracking elements. Removes the border. Perfect
                                for putting statistics or static read-only text
                                in the background.
                            </div>
                            <div className="sg-preview">
                                <Card variant="flat">
                                    <p className="lead">
                                        Keep track of your complex crochet
                                        patterns effortlessly. Loopo syncs your
                                        counters, targets, and yarn stock
                                        parameters safely.
                                    </p>
                                </Card>
                            </div>
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    variant=&#34;elevated&#34;
                                </code>
                                <strong>Usage</strong>: Overlays, floating
                                action panels, or high-priority focal cards.
                                Lifts the surface using a soft volumetric
                                shadow, signaling to the user that it sits on a
                                superior visual plane. On hover, the shadow is
                                more noticeable.
                            </div>
                            <div className="sg-preview">
                                <Card variant="elevated">
                                    <p className="lead">
                                        Keep track of your complex crochet
                                        patterns effortlessly. Loopo syncs your
                                        counters, targets, and yarn stock
                                        parameters safely.
                                    </p>
                                </Card>
                            </div>
                        </div>
                    </div>
                </Card>
                <Card variant="bordered">
                    <h2>Row Alert Notification</h2>
                    <p>
                        Inline contextual alert triggered when the global
                        counter reaches specific pattern instruction thresholds
                        (e.g., decreases, increases, color shifts).
                    </p>
                    <div className="space-y-6">
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">State: default</code>
                                You can control whether the alert should be
                                visible or not by using isVisible; and adding a
                                onDismiss handler.
                            </div>
                            <div className="sg-preview">
                                <RowAlert
                                    isVisible={true}
                                    title="Time to decrease"
                                    description="Decrease one stitch at the beginning of the row."
                                    onDismiss={() =>
                                        console.log('Alert dismissed')
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </Card>
                <Card variant="bordered">
                    <h2>Form Alerts</h2>
                    <p>
                        Inline contextual banners used inside forms and modals
                        to communicate validation errors, range overlaps, and
                        system advisories.
                    </p>
                    <div className="space-y-6">
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    variant=&#34;error&#34;
                                </code>
                                <strong>Usage</strong>: Critical blocking
                                states. Used for counter range overlaps, failed
                                mutations, or invalid row inputs that prevent
                                saving.
                            </div>
                            <div className="sg-preview">
                                <FormAlert
                                    isVisible={true}
                                    message="The row range overlaps with an existing motif on this part."
                                />
                            </div>
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    variant=&#34;warning&#34;
                                </code>
                                <strong>Usage</strong>: Non-blocking cautions.
                                Ideal for approaching target row boundaries,
                                unsaved changes, or pattern gauge discrepancies.
                            </div>
                            <div className="sg-preview">
                                <FormAlert
                                    variant="warning"
                                    isVisible={true}
                                    message="Current row count has exceeded the target rows for this part."
                                />
                            </div>
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    variant=&#34;info&#34;
                                </code>
                                <strong>Usage</strong>: Contextual guidance.
                                Highlights pattern milestones, repeat behavior
                                explanations, or offline sync status.
                            </div>
                            <div className="sg-preview">
                                <FormAlert
                                    variant="info"
                                    isVisible={true}
                                    message="Secondary motifs automatically advance as you log rows in the main counter."
                                />
                            </div>
                        </div>
                    </div>
                </Card>
                <Card variant="bordered">
                    <h2>Button System Architecture</h2>
                    <p>
                        The matrix combining structural variants, semantic
                        hierarchies, and contextual micro-states. You can also
                        use it an anchor element by adding a href value.
                    </p>
                    <hr />
                    <div className="space-y-6">
                        <div className="sg-subtitle">
                            Shapes & Structural Variants
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    variant=&#34;pill&#34; (Default)
                                </code>
                                <strong>Usage</strong>: Capsule rounded layout.
                                Ideal for primary tags, floating actions, or
                                internal widget flows like the counter.
                            </div>
                            <div className="sg-preview">
                                <Button variant="pill" color="primary">
                                    Pill Button
                                </Button>
                            </div>
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    variant=&#34;squared&#34;
                                </code>
                                <strong>Usage</strong>: Perfect for card
                                footers, full-width forms, and high-importance
                                grid elements.
                            </div>
                            <div className="sg-preview">
                                <Button variant="squared" color="primary">
                                    Squared Button
                                </Button>
                            </div>
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    variant=&#34;text&#34; / ghost
                                </code>
                                <strong>Usage</strong>: Completely borderless
                                and backgroundless. Used for low-emphasis
                                utilities, secondary cancels, or navigation
                                links.
                            </div>
                            <div className="sg-preview">
                                <Button variant="text" color="primary">
                                    Text Ghost Button
                                </Button>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="space-y-6">
                        <div className="sg-subtitle">Color Hierarchies</div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    color=&#34;primary&#34;
                                </code>
                                <strong>Color</strong>: Vibrant Coral. Captures
                                user attention instantly for the main goal of
                                the screen.
                            </div>
                            <div className="sg-preview">
                                <Button color="primary">Primary Action</Button>
                            </div>
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    color=&#34;secondary&#34;
                                </code>
                                <strong>Color</strong>: Chalk Gray container
                                with Charcoal text. For supporting choices.
                            </div>
                            <div className="sg-preview">
                                <Button color="secondary">
                                    Secondary Action
                                </Button>
                            </div>
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    color=&#34;danger&#34;
                                </code>
                                <strong>Color</strong>: Crimson. Reserved
                                exclusively for destructive inputs like
                                discarding yarns or deleting logs.
                            </div>
                            <div className="sg-preview">
                                <Button color="danger">Danger Action</Button>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="space-y-6">
                        <div className="sg-subtitle">
                            Functional Micro-States
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    icon={'{<Icon />}'}
                                </code>
                                <strong>Alignment</strong>: Left-aligned
                                relative to the text label. Padding dynamically
                                balances if children strings exist.
                            </div>
                            <div className="sg-preview">
                                <Button color="primary" icon={<Sparkles />}>
                                    With Custom Icon
                                </Button>
                            </div>
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">disabled</code>
                                <strong>Behavior</strong>: Background color
                                changed to chalk gray, locks cursor input, and
                                blocks pointer scales or hover reactions
                                automatically.
                            </div>
                            <div className="sg-preview">
                                <Button
                                    color="primary"
                                    disabled
                                    icon={<Sparkles />}
                                >
                                    Disabled Button
                                </Button>
                            </div>
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    Icon-Only (No children)
                                </code>
                                <strong>Behavior</strong>: Automatically alters
                                internal paddings to ensure a 1:1 aspect ratio
                                (perfect squares or circles). Always provide an
                                aria-label for accessibility.
                            </div>
                            <div className="sg-preview flex items-center gap-4">
                                <Button
                                    variant="pill"
                                    color="primary"
                                    icon={<Plus />}
                                    aria-label="Increase count"
                                />

                                <Button
                                    variant="squared"
                                    color="secondary"
                                    icon={<Search />}
                                    aria-label="Search patterns"
                                />
                                <Button
                                    variant="text"
                                    color="danger"
                                    icon={<Trash2 />}
                                    aria-label="Delete block"
                                />
                            </div>
                        </div>
                    </div>
                </Card>
                <Card variant="bordered">
                    <h2>Form elements</h2>
                    <div className="space-y-6">
                        <div className="sg-subtitle">
                            Text Input element and its interactive states
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">State: Default</code>
                                <strong>Style</strong>: It has a thin light
                                border. On hover and focus, the border changes
                                to Charcoal color.
                            </div>
                            <div className="sg-preview">
                                <Input
                                    label="Project Title"
                                    placeholder="e.g., Crochet Summer Cardigan"
                                />
                            </div>
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">State: Success</code>
                                <strong>Visual</strong>: Confirms correct data
                                parameters. It locks a clean checkmark icon on
                                the right side of the input frame.
                            </div>
                            <div className="sg-preview">
                                <Input
                                    label="Yarn Batch Code"
                                    defaultValue="LOT-2026X"
                                    success={true}
                                />
                            </div>
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">State: Error</code>
                                <strong>Visual</strong>: Triggers a Crimson
                                Thread frame, colors the typed text in red, and
                                appends an explicit alert icon to indicate a
                                block. It also replaces the bottom help text
                                with the error message.
                            </div>
                            <div className="sg-preview">
                                <Input
                                    label="Row Target"
                                    defaultValue="-12"
                                    error="Row count cannot be a negative value"
                                />
                            </div>
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">State: Disabled</code>
                                <strong>Visual</strong>: Drops the entire
                                container opacity and changes the mouse cursor
                                to &#34;not-allowed&#34; to prevent typing.
                            </div>
                            <div className="sg-preview">
                                <Input
                                    label="Archived Pattern ID"
                                    defaultValue="PRJ-9921"
                                    disabled={true}
                                />
                            </div>
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    helpText=&#34;string&#34;
                                </code>
                                <strong>Usage</strong>: Adds an accessible
                                context hint line below the field, accompanied
                                by the native support symbol (?).
                            </div>
                            <div className="sg-preview">
                                <Input
                                    label="Hook Size"
                                    placeholder="e.g., 4.0"
                                    helpText="Specify in millimeters or US standard sizing number"
                                />
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="space-y-6">
                        <div className="sg-subtitle">
                            Dropdown element and its interactive states
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    State: Default (Placeholder)
                                </code>
                                <strong>Visual</strong>: Mutes the initial text
                                to a subtle gray when no option is chosen. This
                                prevents placeholder text from competing with
                                active values.
                            </div>
                            <div className="sg-preview">
                                <Select label="Craft type" defaultValue="">
                                    <option value="" disabled>
                                        Select an option
                                    </option>
                                    <option value="knitting">Knitting</option>
                                    <option value="crochet">Crochet</option>
                                </Select>
                            </div>
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    State: Option selected
                                </code>
                                <strong>Visual</strong>: Triggers a Crimson
                                Thread frame, colors the typed text in red, and
                                appends an explicit alert icon to indicate a
                                block. It also replaces the bottom help text
                                with the error message.
                            </div>
                            <div className="sg-preview">
                                <Select
                                    label="Craft type"
                                    defaultValue="knitting"
                                >
                                    <option value="" disabled>
                                        Select an option
                                    </option>
                                    <option value="knitting">Knitting</option>
                                    <option value="crochet">Crochet</option>
                                </Select>
                            </div>
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    State: Error validation
                                </code>
                                <strong>Visual</strong>: Triggers a Crimson
                                Thread frame, colors the typed text in red, and
                                appends an explicit alert icon to indicate a
                                block. It also replaces the bottom help text
                                with the error message.
                            </div>
                            <div className="sg-preview">
                                <Select
                                    label="Craft type"
                                    defaultValue="knitting"
                                    error="Please, select a valid option"
                                >
                                    <option value="" disabled>
                                        Select an option
                                    </option>
                                    <option value="knitting">Knitting</option>
                                    <option value="crochet">Crochet</option>
                                </Select>
                            </div>
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    helpText=&#34;string&#34;
                                </code>
                                <strong>Usage</strong>: Adds an accessible
                                context hint line below the field, accompanied
                                by the native support symbol (?).
                            </div>
                            <div className="sg-preview">
                                <Select
                                    label="Craft type"
                                    helpText="Do you use a single hook or two needles?"
                                    defaultValue="knitting"
                                >
                                    <option value="" disabled>
                                        Select an option
                                    </option>
                                    <option value="knitting">Knitting</option>
                                    <option value="crochet">Crochet</option>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="space-y-6">
                        <div className="sg-subtitle">Toggle Switch Control</div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    State: Inactive / Off
                                </code>
                                <strong>Visual</strong>: chalk gray track. Uses
                                false defaultChecked to boot up turned off while
                                remaining clickable.
                            </div>
                            <div className="sg-preview">
                                <Toggle
                                    label="My toggle"
                                    defaultChecked={false}
                                />
                            </div>
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    State: Active / On
                                </code>
                                <strong>Visual</strong>: Uses true
                                defaultChecked to boot up pre-activated.
                                Clicking it will organically slide it back to
                                grey.
                            </div>
                            <div className="sg-preview">
                                <Toggle
                                    label="My Toggle"
                                    defaultChecked={true}
                                />
                            </div>
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">State: Disabled</code>
                                <strong>Visual</strong>: Drops the entire
                                container opacity and changes the mouse cursor
                                to &#34;not-allowed&#34; to prevent typing.
                            </div>
                            <div className="sg-preview">
                                <Toggle
                                    label="My Toggle"
                                    defaultChecked={true}
                                    disabled={true}
                                />
                            </div>
                        </div>
                    </div>
                </Card>
                <Card variant="bordered">
                    <h2>Tag & Badge System</h2>
                    <p>
                        Micro-indicators used for classification, contextual
                        indexing, and project lifecycle status.
                    </p>
                    <div className="space-y-6">
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    variant=&#34;neutral&#34;
                                </code>
                                <strong>Usage</strong>: Standard structural
                                data. Ideal for technical attributes that carry
                                no emotional weight, such as fiber types, hook
                                sizes, or measurements.
                            </div>
                            <div className="sg-preview">
                                <Tag label="Merino" icon={<Sparkles />} />
                            </div>
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    variant=&#34;highlight&#34;
                                </code>
                                <strong>Usage</strong>: High attention hooks.
                                Reserved for active states, crucial system
                                alerts, or attributes that signify the current
                                focal point of the user.
                            </div>
                            <div className="sg-preview">
                                <Tag
                                    label="Merino"
                                    variant="highlight"
                                    icon={<Sparkles />}
                                />
                            </div>
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    variant=&#34;muted&#34;
                                </code>
                                <strong>Usage</strong>: De-prioritized states.
                                Perfect for completed tasks, historical data, or
                                archived logs that should blend into the
                                background.
                            </div>
                            <div className="sg-preview">
                                <Tag
                                    label="Merino"
                                    variant="muted"
                                    icon={<Sparkles />}
                                />
                            </div>
                        </div>
                    </div>
                </Card>
                <Card variant="bordered">
                    <h2>Modal System</h2>
                    <p>
                        A versatile, accessible modal overlay component built
                        with backdrop blur, and body scroll locking.
                    </p>
                    <div className="space-y-6">
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    Variant: Standard (Max Width MD)
                                </code>
                                <strong>Visual</strong>: Default medium width
                                centered dialog with backdrop blur, uppercase
                                header, subtitle, and background scroll locking.
                            </div>
                            <div className="sg-preview">
                                <Button
                                    variant="squared"
                                    onClick={() => setActiveModal('default')}
                                    size="small"
                                >
                                    Open Standard Modal
                                </Button>

                                <Modal
                                    isOpen={activeModal === 'default'}
                                    onClose={() => setActiveModal(null)}
                                    title="EDIT PATTERN NOTES"
                                    subtitle="Changes here will be stored locally."
                                >
                                    <div className="space-y-4 my-8">
                                        <Input
                                            label="Project Title"
                                            placeholder="e.g., Crochet Summer Cardigan"
                                        />
                                        <div
                                            className="flex justify-end gap-3
                                                pt-2"
                                        >
                                            <Button
                                                variant="squared"
                                                onClick={() =>
                                                    setActiveModal(null)
                                                }
                                            >
                                                Save notes
                                            </Button>
                                            <Button
                                                color="secondary"
                                                variant="text"
                                                onClick={() =>
                                                    setActiveModal(null)
                                                }
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                </Modal>
                            </div>
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    Variant: Non-standard (Max Width XL)
                                </code>
                                You can change the maximum width of the modal by
                                using one of the next options: &#39;sm&#39;,
                                &#39;md&#39; (default), &#39;lg&#39;,
                                &#39;xl&#39;, and &#39;full&#39;.
                            </div>
                            <div className="sg-preview">
                                <Button
                                    variant="squared"
                                    onClick={() => setActiveModal('modal-xl')}
                                    size="small"
                                >
                                    Open XL Modal
                                </Button>

                                <Modal
                                    isOpen={activeModal === 'modal-xl'}
                                    onClose={() => setActiveModal(null)}
                                    title="EDIT PATTERN NOTES"
                                    subtitle="Changes here will be stored locally."
                                    maxWidth="xl"
                                >
                                    <div className="space-y-4 my-8">
                                        <Input
                                            label="Project Title"
                                            placeholder="e.g., Crochet Summer Cardigan"
                                        />
                                        <div
                                            className="flex justify-end gap-3
                                                pt-2"
                                        >
                                            <Button
                                                variant="squared"
                                                onClick={() =>
                                                    setActiveModal(null)
                                                }
                                            >
                                                Save notes
                                            </Button>
                                            <Button
                                                color="secondary"
                                                variant="text"
                                                onClick={() =>
                                                    setActiveModal(null)
                                                }
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                </Modal>
                            </div>
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    Variant: URL Modal
                                </code>
                                You can open based on the URL. For example, this
                                modal reacts when url is &#39;?modal=demo&#39;.
                            </div>
                            <div className="sg-preview">
                                <Button
                                    variant="squared"
                                    onClick={openDemoUrlModal}
                                    size="small"
                                >
                                    Open URL Modal
                                </Button>

                                <UrlModal
                                    paramName="modal"
                                    paramValue="demo"
                                    title="EDIT PATTERN NOTES"
                                    subtitle="Changes here will be stored locally."
                                    maxWidth="full"
                                >
                                    <div className="space-y-4 my-8">
                                        <Input
                                            label="Project Title"
                                            placeholder="e.g., Crochet Summer Cardigan"
                                        />
                                        <div
                                            className="flex justify-end gap-3
                                                pt-2"
                                        >
                                            <Button
                                                variant="squared"
                                                onClick={() =>
                                                    setActiveModal(null)
                                                }
                                            >
                                                Save notes
                                            </Button>
                                            <Button
                                                color="secondary"
                                                variant="text"
                                                onClick={() =>
                                                    setActiveModal(null)
                                                }
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                </UrlModal>
                            </div>
                        </div>
                    </div>
                </Card>
                <Card variant="bordered">
                    <h2>Project parts navigation</h2>
                    <p>
                        A compact, horizontally scrollable segmented navigation
                        bar designed for switching between project parts.
                    </p>
                    <div className="space-y-6">
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">State: Default</code>
                                <strong>Visual</strong>: It features pill-shaped
                                tabs with active state highlighting, smooth
                                auto-centering for the selected item, and edge
                                fade gradients indicating overflow content
                            </div>
                            <div className="sg-preview">
                                <div className="w-full max-w-md">
                                    <ProjectPartsNav
                                        parts={DEMO_PARTS}
                                        activePartId={activePart}
                                        onSelectPart={(id) => setActivePart(id)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
                <Card variant="bordered">
                    <h2>Progress Indicators</h2>
                    <p>
                        Visual systems displaying completion metrics in both
                        horizontal linear and radial circular geometries.
                    </p>
                    <div className="space-y-6">
                        <div className="sg-subtitle">
                            State Alignments (Linear & Circular)
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">State: Default</code>
                                <strong>Visual</strong>: Renders your signature
                                Coral progress bar against a soft, non-intrusive
                                grey track. Ideal for standard operational
                                tracking.
                            </div>
                            <div
                                className="sg-preview flex flex-col items-start
                                    gap-8"
                            >
                                <ProgressBar
                                    shape="linear"
                                    value={25}
                                    max={120}
                                />
                                <ProgressBar
                                    shape="circular"
                                    value={32}
                                    max={120}
                                />
                            </div>
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">State: Disabled</code>
                                <strong>Visual</strong>: Darkens the container
                                background track to create an interactive depth
                                change, highlighting the card container&#39;s
                                focused zone.
                            </div>
                            <div
                                className="sg-preview flex flex-col items-start
                                    gap-8"
                            >
                                <ProgressBar
                                    shape="linear"
                                    value={79}
                                    max={120}
                                    disabled
                                />
                                <ProgressBar
                                    shape="circular"
                                    value={50}
                                    max={120}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                </Card>
                <Card variant="bordered">
                    <h2>Project cards</h2>
                    <p>
                        Primary dashboard cards displaying current active
                        pattern sections, progress metrics, and last edit
                        timestamps.
                    </p>
                    <div className="space-y-6">
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    Variant: with active part
                                </code>
                                <strong>Visual</strong>: Highlights the specific
                                piece currently being knitted (e.g., &#34;Front
                                &#34;). On hover, the active section label turns
                                Vibrant Coral.
                            </div>
                            <div
                                className="sg-preview flex flex-col items-start
                                    gap-8"
                            >
                                <ProjectCard
                                    title="Pullover Iceland"
                                    currentRow={240}
                                    totalRows={320}
                                    activePart="Front"
                                    lastUpdated="2h ago"
                                    url="/"
                                />
                            </div>
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    Variant: without active part
                                </code>
                                <strong>Usage</strong>: Used for single-piece
                                projects or high-level overview cards where row
                                count is tracked globally.
                            </div>
                            <div
                                className="sg-preview flex flex-col items-start
                                    gap-8"
                            >
                                <ProjectCard
                                    title="Pullover Iceland"
                                    currentRow={240}
                                    totalRows={320}
                                    lastUpdated="2h ago"
                                    url="/"
                                />
                            </div>
                        </div>
                    </div>
                </Card>
                <Card variant="bordered">
                    <h2>Global Counter</h2>
                    <p>
                        Large tactile surface for hands-free counting.
                        Automatically shifts into a celebration visual state
                        upon reaching target capacity.
                    </p>
                    <div className="space-y-6">
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    State: In-Progress
                                </code>
                                Active interactive counter. Click/tap anywhere
                                on the card to increment toward the target.
                            </div>
                            <div className="sg-preview flex flex-col
                                items-start">
                                <GlobalCounter
                                    initialRow={37}
                                    totalRows={100}
                                />
                            </div>
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    State: Maximum / Goal Reached
                                </code>
                                Triggers automatically when value &gt;=
                                totalRows. Highlights the text metric in Vibrant
                                Coral with a completion tag.
                            </div>
                            <div className="sg-preview flex flex-col
                                items-start">
                                <GlobalCounter
                                    initialRow={100}
                                    totalRows={100}
                                />
                            </div>
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    onChange?: (value: number) =&gt; void
                                </code>
                                Emits the updated row count on every increment
                                (tap) or decrement (- button). Useful for
                                persisting data to a database. In this example,
                                it logs in the console the current row.
                            </div>
                            <div className="sg-preview flex flex-col
                                items-start">
                                <GlobalCounter
                                    initialRow={67}
                                    totalRows={100}
                                    onChange={(row) =>
                                        console.log(`Current row: ${row}`)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </Card>
                <Card variant="bordered">
                    <h2>Secondary Counter & Settings Modal</h2>
                    <p>
                        Compact tactile widget designed for tracking sub-repeats
                        (braids, or gauge repeats). Features isolated touch
                        targets for incrementing, decrementing, and launching
                        URL-driven settings.
                    </p>
                    <div className="space-y-6">
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    State: In-Progress
                                </code>
                                Active interactive counter. Click/tap anywhere
                                on the card to increment toward the target.
                            </div>

                            <SecondaryCounter
                                title="Braid"
                                initialRow={2}
                                totalRows={12}
                                tagLabel="#123"
                                settingsHref="?counterSettings=braid"
                            />
                        </div>
                        <div className="sg-row">
                            <div className="sg-meta">
                                <code className="coral">
                                    State: Completed or Inactive
                                </code>
                                Once completed, the counter gets a gray
                                background. It happens the same when you set
                                isInactive.
                            </div>
                            <SecondaryCounter
                                title="Sleve"
                                initialRow={20}
                                totalRows={40}
                                tagLabel="Color #75"
                                settingsHref="?counterSettings=sleve"
                                isInactive={true}
                            />
                        </div>
                    </div>
                    <SecondaryCounterSettingsModal
                        key={activeCounterKey}
                        initialData={secondaryCounterInitialData}
                        onSave={(data) => {
                            console.log(`Saving data secondary counter:`, data);
                        }}
                        {...(secondaryCounterInitialData
                            ? {
                                  paramName: 'counterSettings',
                                  paramValue: secondaryCounterInitialData.id,
                              }
                            : null)}
                    />
                </Card>
            </div>
        </main>
    );
}

export default function StyleGuide() {
    return (
        <Suspense
            fallback={
                <div className="p-8 text-sm text-misty-grey">Loading...</div>
            }
        >
            <StyleGuidePage />
        </Suspense>
    );
}

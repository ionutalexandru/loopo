import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

import { Sparkles, Plus, Search, Trash2 } from 'lucide-react';

export default function StyleGuide() {
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
                                className={`rounded-xl p-4 ${color.class} border-charcoal flex h-24 flex-col justify-between border`}
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
                        <div className="sg-row-first">
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
                        <div className="sg-row-first">
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
                        <div className="sg-row-first">
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
                    <h2>Button System Architecture</h2>
                    <p>
                        The matrix combining structural variants, semantic
                        hierarchies, and contextual micro-states.
                    </p>
                    <hr />
                    <div className="space-y-6">
                        <div className="sg-subtitle">
                            Shapes & Structural Variants
                        </div>
                        <div className="sg-row-first">
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
                        <div className="sg-row-first">
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
                        <div className="sg-row-first">
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
                        <div className="sg-row-first">
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
                                container opacity to 50% and changes the mouse
                                cursor to &#34;not-allowed&#34; to prevent
                                typing.
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
                        <div className="sg-row-first">
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
                </Card>
            </div>
        </main>
    );
}

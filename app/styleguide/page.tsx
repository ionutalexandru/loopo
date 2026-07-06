import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Star } from 'lucide-react';

export default function StyleGuide() {
    return (
        <main className="mx-auto min-h-screen max-w-6xl p-8">
            <header className="border-chalk-gray mb-12 border-b pb-6">
                <h1 className="font-comfortaa text-charcoal text-4xl font-bold">
                    loopo<span className="text-vibrant-coral">.</span>{' '}
                    StyleGuide
                </h1>
            </header>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <Card variant="bordered">
                    <h2 className="mb-4 text-xl font-bold">Color Pallete</h2>
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
                    <h2 className="mb-4 text-xl font-bold">Typography</h2>
                    <div className="grid grid-cols-1 gap-8">
                        <div>
                            <span className="text-misty-grey mb-1 block font-mono text-xs">
                                Comfortaa (Brand / Display)
                            </span>
                            <code>font-comfortaa</code>
                            <p className="font-comfortaa text-2xl font-bold">
                                Logos and Creative H1s
                            </p>
                        </div>
                        <div>
                            <span className="text-misty-grey mb-1 block font-mono text-xs">
                                Outfit (UI Elements / Headers)
                            </span>
                            <code>font-outfit</code>
                            <p className="font-outfit text-xl font-semibold">
                                Buttons and headings
                            </p>
                        </div>
                        <div>
                            <span className="text-misty-grey mb-1 block font-mono text-xs">
                                Inter (Body / Inputs / Default)
                            </span>
                            <code>font-inter</code>
                            <p className="text-charcoal/80 font-sans text-base">
                                Paragraph text, form labels, and fluid user data
                                readouts.
                            </p>
                        </div>
                    </div>
                </Card>
                <Card variant="bordered">
                    <h2 className="mb-4 text-xl font-bold">Button variants</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="pill" color="primary">
                            Pill + Primary
                        </Button>
                        <Button variant="squared" color="primary">
                            Squared + Primary
                        </Button>
                        <Button variant="text" color="primary" icon={<Star />}>
                            Text + Primary
                        </Button>
                        <Button variant="squared" color="primary" disabled>
                            Disabled + Primary
                        </Button>
                        <Button variant="pill" color="secondary">
                            Pill + Secondary
                        </Button>
                        <Button variant="squared" color="secondary">
                            Squared + Secondary
                        </Button>
                        <Button
                            variant="text"
                            color="secondary"
                            icon={<Star />}
                        >
                            Text + Secondary
                        </Button>
                        <Button variant="squared" color="secondary" disabled>
                            Disabled + Secondary
                        </Button>
                        <Button variant="pill" color="danger">
                            Pill + Danger
                        </Button>
                        <Button variant="squared" color="danger">
                            Squared + Danger
                        </Button>
                        <Button variant="text" color="danger" icon={<Star />}>
                            Text + Danger
                        </Button>
                        <Button variant="squared" color="danger" disabled>
                            Disabled + Danger
                        </Button>
                    </div>
                </Card>
            </div>
        </main>
    );
}

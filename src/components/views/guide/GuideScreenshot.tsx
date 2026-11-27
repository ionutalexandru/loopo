import { Card } from '@/components/ui/Card';

interface GuideScreenshotProps {
    src: string;
    alt: string;
    caption?: string;
    className?: string;
}

export function GuideScreenshot({
    src,
    alt,
    caption = '',
    className = '',
}: GuideScreenshotProps) {
    return (
        <figure
            className={`my-4 flex flex-col items-center gap-2 ${className}`}
        >
            <Card
                variant="bordered"
                className="bg-bone-white sm: w-fit! overflow-hidden p-2! sm:p-3!"
            >
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    className="border-chalk-gray mx-auto max-h-140 w-auto rounded-2xl border object-contain"
                />
            </Card>
            {caption && (
                <figcaption className="text-misty-gray text-center text-xs">
                    {caption}
                </figcaption>
            )}
        </figure>
    );
}

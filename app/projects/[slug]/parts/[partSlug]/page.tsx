import { Metadata } from 'next';

import PartDisplayView from '@/components/views/PartDisplayView';

export const metadata: Metadata = {
    title: 'Counter | Loopo',
    description: 'Track stitches, rows, and pattern repeats effortlessly.',
};

interface PartDisplayPageProps {
    params:
        | Promise<{ slug: string; partSlug: string }>
        | { slug: string; partSlug: string };
}

export default async function PartDisplayPage({
    params,
}: PartDisplayPageProps) {
    const resolvedParams = await params;
    return (
        <PartDisplayView
            slug={resolvedParams.slug}
            partSlug={resolvedParams.partSlug}
        />
    );
}

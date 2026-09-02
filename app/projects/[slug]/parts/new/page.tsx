import CreatePartView from '@/components/views/CreatePartView';

export const metadata = {
    title: 'Create a Part | Loopo',
    description: 'Add a new part or section to your project tracker in Loopo.',
};

interface CreatePartPageProps {
    params: Promise<{ slug: string }> | { slug: string };
}

export default async function CreatePartPage({ params }: CreatePartPageProps) {
    const resolvedParams = await params;

    return <CreatePartView slug={resolvedParams.slug} />;
}

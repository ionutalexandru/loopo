'use client';

import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';

export default function NotFound() {
    return (
        <main className="page justify-center items-center">
            <Tag
                label="404 • Thread Lost"
                variant="highlight"
                className="w-fit!"
            />

            <h1 className="text-center">
                Looks like<span className="loopo-dot"></span>
                <span className="loopo-dot"></span>
                <span className="loopo-dot"></span>
                <br />
                you dropped a stitch
            </h1>

            <p className="lead">Could not find the requested resource</p>

            <Button href="/" variant="pill" color="primary" className="w-fit!">
                Back to My Basket
            </Button>
        </main>
    );
}

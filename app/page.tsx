import Image from 'next/image';

export default function Home() {
  return (
    <main className="selection:bg-soft-coral-rosa selection:text-vibrant-coral flex min-h-screen flex-col items-center justify-center p-6">
      <div className="animate-fade-in text-center">
        <div className="mb-6 flex justify-center">
          <Image
            src="/logo.svg"
            alt="Loopo Logo"
            width={180}
            height={180}
            priority
          />
        </div>
        <p className="font-outfit text-misty-grey mt-4 text-xs font-semibold tracking-[0.25em] uppercase md:text-sm">
          Coming soon
        </p>
      </div>
    </main>
  );
}

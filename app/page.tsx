import { Button } from '@/components/ui/button';
import Link from 'next/link';
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col gap-5 mb-5 text-center">
        <h1 className="text-5xl font-bold">Nyawer</h1>
        <p className="text-3xl font-semibold">
          Gamau pulang kalau belum nyawer!!
        </p>
      </div>
      <div className="flex flex-row justify-center gap-10 p-4">
        <Button color="default" variant="default">
          <Link href="/register" className="font-base text-lg">
            Sign Up
          </Link>
        </Button>
        <Button color="sec" variant="default">
          <Link href="/login" className="font-base text-lg">
            Sign In
          </Link>
        </Button>
      </div>
    </div>
  );
}

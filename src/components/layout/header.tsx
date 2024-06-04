import { Logo, NetnodeLogo } from '@/lib/icons';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 border-b border-b-slate-200 shrink-0 bg-white">
      <div className="max-container w-full flex justify-between items-center">
        <Link href="/" className="flex gap-2 font-bold">
          <Logo />
          my-ai-assistant
        </Link>

        <Link
          href="https://www.netnode.ch"
          className="flex gap-2 font-bold"
          target="_blank"
        >
          <NetnodeLogo className="w-8 h-8" />
        </Link>
      </div>
    </header>
  );
}

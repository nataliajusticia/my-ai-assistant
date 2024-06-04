import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'my-ai-assistant',
  description: 'A conversational AI assistant powered by NJ.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />

          <main className="flex flex-col flex-1 bg-slate-50">
            <div className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}

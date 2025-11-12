import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import ThemeManager from '@/components/ThemeManager';

export const metadata = {
  title: 'League of Legends — Champions Hub (Client)',
  description: 'Modern Arcane-themed champions index',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-900 text-white flex flex-col">
        <ThemeManager />
        <SiteHeader />
        <main className="flex-1 overflow-hidden">{children}</main>
      </body>
    </html>
  );
}

import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import ThemeManager from "@/components/ThemeManager";

export const metadata = {
  title: "League of Legends — Champions Hub (Client)",
  description: "Modern Arcane-themed champions index",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Inline script to set theme before React hydrates to avoid flash-of-unstyled-theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
          (function(){
            try {
              var stored = null;
              try { stored = window.localStorage.getItem('rf_theme'); } catch(e) { stored = null; }
              if (stored === 'dark') { document.documentElement.classList.add('dark'); return; }
              if (stored === 'light') { document.documentElement.classList.remove('dark'); return; }
              if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) { document.documentElement.classList.add('dark'); return; }
              // default to dark
              document.documentElement.classList.add('dark');
            } catch (e) {}
          })();
        `,
          }}
        />
        <ThemeManager />
        <SiteHeader />
        <main className="flex-1 overflow-hidden">{children}</main>
      </body>
    </html>
  );
}

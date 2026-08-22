import { CustomCursor } from "@/components/ui/CustomCursor";
import { Navbar } from "@/components/layout/Navbar";
import { BackgroundEffects } from "@/components/ui/BackgroundEffects";

/** Chrome for the public portfolio only — the admin panel never sees this. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-noise">
      <BackgroundEffects />
      <CustomCursor />
      <Navbar />
      <main className="relative z-10 flex min-h-screen flex-col">{children}</main>
    </div>
  );
}

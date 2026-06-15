import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/SideBar";
import { ModeToggle } from "@/components/mode-togle";

export default function Activity() {
  return (
    <SidebarProvider>
      <AppSidebar onNewThread={() => {}} />

      <main className="w-full min-h-screen bg-background text-foreground">
        {/* ── Header ── */}
        <div className="sticky top-0 z-20 bg-background/70 backdrop-blur-xl border-b border-border/50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground shrink-0 transition-colors" />
            <div className="h-4 w-[1px] bg-border/60 mx-1" />
            <h2 className="text-lg font-bold tracking-tight">Activity</h2>
          </div>
          <ModeToggle />
        </div>

        {/* ── Body ── */}
        <div className="max-w-2xl mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
          <h3 className="text-xl font-semibold mb-2">Activity</h3>
          <p className="text-sm text-muted-foreground">
            Coming Soon / To Be Announced
          </p>
        </div>
      </main>
    </SidebarProvider>
  );
}

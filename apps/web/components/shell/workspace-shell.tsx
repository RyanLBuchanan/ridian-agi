import { CommandSurface } from "@/components/chat/command-surface";
import { LeftNav } from "@/components/shell/left-nav";
import { RightContextPanel } from "@/components/shell/right-context-panel";
import { TopHeader } from "@/components/shell/top-header";

export function WorkspaceShell() {
  return (
    <main className="app-shell">
      <TopHeader />
      <LeftNav />
      <section className="panel main">
        <CommandSurface />
      </section>
      <RightContextPanel />
    </main>
  );
}

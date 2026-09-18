import { createClient } from "@/lib/supabase/server";
import { Nav, MobileNav } from "./Nav";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();
  const email = data.user?.email ?? "Alex";
  const initial = email[0]?.toUpperCase() ?? "A";

  return (
    <div className="shell">
      <Nav />
      <main className="main">
        <div className="top">
          <div>
            <h1>Good morning 👋</h1>
            <div className="muted">
              Small steps today. Real change over time.
            </div>
          </div>
          <div className="avatar">{initial}</div>
        </div>

        {children}
      </main>
      <MobileNav />
    </div>
  );
}

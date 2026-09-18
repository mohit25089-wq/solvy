"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Nav, MobileNav } from "./Nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState("Alex");

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email);
    });
  }, []);

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
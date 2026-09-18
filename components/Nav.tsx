 "use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/app/actions";

const links = [
  ["/", "⌂", "Home"],
  ["/problem", "＋", "New Problem"],
  ["/plan", "☷", "My Plan"],
  ["/commit", "◉", "Commit Mode"],
  ["/proof", "✓", "Proof"],
  ["/hardware", "◌", "Hardware"],
];

export function Nav() {
  const path = usePathname();
  return <aside className="side">
    <div className="logo">Solvy</div><div className="tag">Plan. Focus. Do. Grow.</div>
    <div className="nav">{links.map(([href, icon, label])=><Link key={href} href={href} className={path===href?"active":""}>{icon} &nbsp; {label}</Link>)}</div>
    <div className="sidebox"><b>Big goal</b><p className="small muted">Build something useful</p><div className="bar"><span style={{width:"62%"}}/></div><small className="muted">62% this month</small></div>
    <button className="secondary" style={{marginTop:15,width:"100%"}} onClick={async()=>{await signOut();location.href="/login"}}>Sign out</button>
  </aside>;
}

export function MobileNav() {
  const path = usePathname();
  return <nav className="mobile">{links.slice(0,5).map(([href, icon, label])=><Link key={href} href={href} className={path===href?"active":""}>{icon}<br/>{label}</Link>)}</nav>;
}

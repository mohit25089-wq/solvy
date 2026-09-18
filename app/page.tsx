import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: tasks } = await supabase.from("tasks").select("*").order("position").limit(3);
  const items = tasks?.length ? tasks : [
    { id:"1", title:"Research & plan", duration_min:30, status:"done" },
    { id:"2", title:"Design circuit", duration_min:30, status:"todo" },
    { id:"3", title:"Build hardware", duration_min:60, status:"todo" },
  ];

  return <AppShell>
    <section className="card hero">
      <div><div className="small" style={{color:"#087b50",fontWeight:900}}>YOUR FOCUS BUDDY</div>
      <h2>What shall we solve today?</h2>
      <p>Tell Solvy a goal or problem. It turns the big thing into a practical sequence of small steps you can actually finish.</p>
      <div className="actions"><Link className="primary" href="/problem">＋ Add a new problem</Link><Link className="secondary" href="/plan">View today&apos;s plan</Link></div></div>
      <div className="bot"><div className="sprout">🌱</div><div className="botface">⌣⌣</div></div>
    </section>

    <section className="section"><div className="sectionhead"><h3>Today</h3><span className="muted small">3 tasks</span></div>
      <div className="tasks">{items.map((t:any)=><div className={"task "+(t.status==="done"?"done":"")} key={t.id}><div className="check">{t.status==="done"?"✓":""}</div><div className="grow"><b>{t.title}</b><div className="small muted">{t.duration_min} min</div></div></div>)}</div>
    </section>

    <section className="section"><div className="sectionhead"><h3>Your progress</h3></div>
      <div className="stats"><div className="stat"><b>5</b><span>tasks this week</span></div><div className="stat"><b>2.4h</b><span>focused time</span></div><div className="stat"><b>62%</b><span>goal progress</span></div></div>
    </section>
  </AppShell>;
}

 "use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";

export default function Problem() {
  const router=useRouter(); const [goal,setGoal]=useState("I need to build a prototype");
  const [time,setTime]=useState("3 hours"); const [difficulty,setDifficulty]=useState("Intermediate");
  const [busy,setBusy]=useState(false); const [error,setError]=useState("");

  async function generate(e:React.FormEvent){e.preventDefault();setBusy(true);setError("");
    const r=await fetch("/api/plan",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({goal,time,difficulty,target:"This week"})});
    const j=await r.json(); setBusy(false); if(!r.ok){setError(j.error||"Could not generate plan");return}
    sessionStorage.setItem("solvy_plan",JSON.stringify(j.plan)); router.push("/plan");
  }

  return <AppShell><section className="card"><h2>Tell Solvy what you want to solve</h2><p className="muted">The real AI planner will turn your goal into a realistic sequence based on your constraints.</p>
    <form className="form" onSubmit={generate}>
      <div className="field"><label>Goal or problem</label><textarea value={goal} onChange={e=>setGoal(e.target.value)} required/></div>
      <div className="two"><div className="field"><label>Available time</label><select value={time} onChange={e=>setTime(e.target.value)}><option>1 hour</option><option>3 hours</option><option>5 hours</option><option>This week</option></select></div>
      <div className="field"><label>Difficulty</label><select value={difficulty} onChange={e=>setDifficulty(e.target.value)}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div></div>
      <div className="field"><label>Target completion</label><select><option>Today</option><option selected>This week</option><option>This month</option></select></div>
      {error && <div className="success" style={{background:"#fff0f0",borderColor:"#ffd0d0"}}>{error}</div>}
      <div className="actions"><button className="primary" disabled={busy}>{busy?"Thinking…":"Analyze with AI ✨"}</button></div>
    </form>
  </section></AppShell>;
}

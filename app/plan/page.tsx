 "use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";

type Step={title:string;minutes:number;description:string};
type Plan={title:string;summary:string;steps:Step[]};

export default function Plan(){
  const [plan,setPlan]=useState<Plan|null>(null);
  useEffect(()=>{const raw=sessionStorage.getItem("solvy_plan");if(raw)setPlan(JSON.parse(raw));},[]);
  const fallback={title:"Build a Prototype",summary:"A 3-hour intermediate plan",steps:[
    {title:"Research & plan",minutes:30,description:"Clarify the outcome and gather essentials."},
    {title:"Design the approach",minutes:30,description:"Choose the simplest workable approach."},
    {title:"Build the first version",minutes:60,description:"Create a small version that can be tested."},
    {title:"Test & debug",minutes:30,description:"Run a focused test and fix the biggest issue."},
    {title:"Document the result",minutes:30,description:"Capture what worked and the next step."}
  ]};
  const p=plan||fallback;
  return <AppShell><section className="card"><div className="small" style={{color:"#087b50",fontWeight:900}}>AI ACTION PLAN</div><h2>{p.title}</h2><p className="muted">{p.summary}</p>
    <div className="steps">{p.steps.map((s,i)=><div className="step" key={i}><div className="num">{i+1}</div><div className="grow"><b>{s.title}</b><div className="small muted">{s.description}</div></div><span className="small muted">{s.minutes} min</span></div>)}</div>
    <div className="actions"><Link className="primary" href="/commit">Start Commit Mode →</Link></div>
  </section></AppShell>;
}

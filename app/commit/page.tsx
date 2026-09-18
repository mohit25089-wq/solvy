 "use client";
import { useEffect,useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { HardwarePanel } from "@/components/HardwarePanel";

export default function Commit(){
  const [seconds,setSeconds]=useState(49*60+32); const [running,setRunning]=useState(false);
  useEffect(()=>{if(!running)return;const id=setInterval(()=>setSeconds(s=>Math.max(0,s-1)),1000);return()=>clearInterval(id)},[running]);
  const m=Math.floor(seconds/60),s=seconds%60;
  return <AppShell><section className="card timerwrap"><div className="small" style={{color:"#087b50",fontWeight:900}}>🔒 COMMIT MODE</div><h2>Focus now. Future you will thank you.</h2>
    <div className="timer"><div><strong>{m}:{String(s).padStart(2,"0")}</strong><span className="muted small">remaining</span></div></div>
    <b>Current step</b><div className="muted">Build circuit on breadboard</div>
    <div className="actions"><button className="primary" onClick={()=>setRunning(!running)}>{running?"Pause":"Start focus"}</button><Link className="danger" href="/proof">Finish step</Link></div>
    <div style={{marginTop:18,width:"min(560px,100%)"}}><HardwarePanel/></div>
  </section></AppShell>;
}

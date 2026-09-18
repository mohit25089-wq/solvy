 "use client";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";

export default function Proof(){
  const [notes,setNotes]=useState(""); const [file,setFile]=useState<File|null>(null); const [busy,setBusy]=useState(false); const [review,setReview]=useState("");
  async function submit(){
    setBusy(true);setReview("");
    const r=await fetch("/api/review",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({notes,filename:file?.name||null})});
    const j=await r.json();setBusy(false);if(!r.ok){setReview(j.error||"Review failed");return}setReview(j.review);
  }
  return <AppShell><section className="card"><div className="small" style={{color:"#087b50",fontWeight:900}}>PROOF OF PROGRESS</div><h2>Show what you did</h2><p className="muted">Submit evidence from the work session. Solvy uses AI to review the evidence and record progress.</p>
    <div className="proofgrid" style={{marginTop:18}}><label className="drop">📷<br/><b>Add a photo or file</b><br/><span className="small">{file?file.name:"Click to attach proof"}</span><input type="file" hidden onChange={e=>setFile(e.target.files?.[0]||null)}/></label>
      <div className="card" style={{boxShadow:"none"}}><b>Current step</b><p className="muted">Build circuit on breadboard</p><span className="small muted">0 / 1 completed</span></div></div>
    <div className="field" style={{marginTop:16}}><label>Notes</label><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="What changed? What did you learn?"/></div>
    <div className="actions"><button className="primary" onClick={submit} disabled={busy}>{busy?"Reviewing…":"Submit for AI Review"}</button></div>
    {review && <div className="success"><b>✓ AI review</b><br/>{review}</div>}
  </section></AppShell>;
}

"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signup, setSignup] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMessage("");
    const result = signup
      ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${location.origin}/auth/callback` } })
      : await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (result.error) return setMessage(result.error.message);
    if (signup) setMessage("Check your email to confirm your account.");
    else location.href = "/";
  }

  return <main className="login">
    <div className="loginbox card">
      <div className="logo">Solvy 🌱</div>
      <p className="muted">Plan. Focus. Do. Grow.</p>
      <h2>{signup ? "Create your account" : "Welcome back"}</h2>
      <form className="form" onSubmit={submit}>
        <div className="field"><label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
        <div className="field"><label>Password</label><input type="password" minLength={6} value={password} onChange={e=>setPassword(e.target.value)} required /></div>
        <button className="primary" disabled={busy}>{busy ? "Working…" : signup ? "Create account" : "Sign in"}</button>
      </form>
      {message && <p className="muted">{message}</p>}
      <button className="secondary" style={{marginTop:10,width:"100%"}} onClick={()=>setSignup(!signup)}>
        {signup ? "I already have an account" : "Create a new account"}
      </button>
    </div>
  </main>;
}

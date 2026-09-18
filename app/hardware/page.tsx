import { AppShell } from "@/components/AppShell";
import { HardwarePanel } from "@/components/HardwarePanel";

export default function Hardware(){
  return <AppShell><section className="card"><div className="small" style={{color:"#087b50",fontWeight:900}}>FOCUS BUDDY HARDWARE</div><h2>Connect your Solvy device</h2><p className="muted">Plug the ESP32 prototype into your computer over USB. The web app can send focus commands and receive START, STUCK, and DONE events.</p><HardwarePanel/></section>
    <section className="card section"><h3>Device protocol</h3><p className="muted small">The firmware in <code>hardware/solvy_focus_buddy.ino</code> sends newline-delimited events at 115200 baud. This keeps the first prototype simple and easy to debug.</p></section>
  </AppShell>;
}

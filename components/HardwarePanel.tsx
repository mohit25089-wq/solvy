"use client";
import { useRef,useState } from "react";

type SerialPortLike = {open:(o:{baudRate:number})=>Promise<void>;readable:ReadableStream<Uint8Array>|null;writable:WritableStream<Uint8Array>|null;close:()=>Promise<void>};

export function HardwarePanel(){
  const [connected,setConnected]=useState(false); const [status,setStatus]=useState("Disconnected"); const port=useRef<SerialPortLike|null>(null); const writer=useRef<WritableStreamDefaultWriter<Uint8Array>|null>(null);
  async function connect(){
    if(!("serial" in navigator)){setStatus("Web Serial is not supported in this browser.");return}
    try{
      const p=await (navigator as any).serial.requestPort(); await p.open({baudRate:115200}); port.current=p; setConnected(true); setStatus("Connected — waiting for device events");
      if(p.writable) writer.current=p.writable.getWriter();
      const reader=p.readable?.getReader(); if(reader) readLoop(reader);
    }catch(e:any){setStatus(e.message||"Connection failed")}
  }
  async function readLoop(reader:ReadableStreamDefaultReader<Uint8Array>){
    const decoder=new TextDecoder(); let buffer="";
    try{while(true){const {value,done}=await reader.read();if(done)break;buffer+=decoder.decode(value,{stream:true});const lines=buffer.split(/\r?\n/);buffer=lines.pop()||"";for(const line of lines){if(line.trim())setStatus(`Device: ${line.trim()}`)}}}catch{}finally{reader.releaseLock()}
  }
  async function send(command:string){if(!writer.current){setStatus("Connect the device first.");return}await writer.current.write(new TextEncoder().encode(command+"\\n"));setStatus(`Sent: ${command}`)}
  async function disconnect(){try{await writer.current?.releaseLock();await port.current?.close()}catch{}writer.current=null;port.current=null;setConnected(false);setStatus("Disconnected")}
  return <div className="card" style={{padding:16,boxShadow:"none"}}>
    <div className="hardware"><span className={"dot "+(connected?"on":"")}></span><b>Solvy Focus Buddy</b><span className="muted small">{status}</span></div>
    <div className="actions"><button className="primary" onClick={connected?disconnect:connect}>{connected?"Disconnect":"Connect USB device"}</button><button className="secondary" onClick={()=>send("START")}>START</button><button className="secondary" onClick={()=>send("STUCK")}>I&apos;M STUCK</button><button className="danger" onClick={()=>send("DONE")}>DONE</button></div>
    <p className="small muted">Uses the browser Web Serial API. The included ESP32 firmware speaks this simple serial protocol.</p>
  </div>;
}

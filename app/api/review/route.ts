import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { notes, filename } = await req.json();
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });

  const input = `Review this Solvy proof of progress.
Current task: Build circuit on breadboard
Attached file name: ${filename || "none"}
User notes: ${notes || "none"}

Be conservative. Evidence should not be treated as proof merely because the user claims completion. Since this prototype only supplies metadata and notes, say that clearly. Give a concise review and one next action.`;

  try {
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.5",
      instructions: "You are Solvy's evidence reviewer. Distinguish claims from verifiable evidence.",
      input,
    });
    const review = response.output_text.trim();
    await supabase.from("proofs").insert({
      user_id: user.user.id,
      task_title: "Build circuit on breadboard",
      notes: notes || "",
      file_name: filename,
      ai_review: review,
    });
    return NextResponse.json({ review });
  } catch (error:any) {
    return NextResponse.json({ error: error?.message || "AI review failed" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { goal, time, difficulty, target } = await req.json();
  if (!goal) return NextResponse.json({ error: "Goal is required" }, { status: 400 });
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });

  const prompt = `Create a realistic Solvy action plan.
Goal: ${goal}
Available time: ${time}
Difficulty: ${difficulty}
Target: ${target}

Return ONLY valid JSON:
{"title":"short title","summary":"one sentence","steps":[{"title":"step","minutes":30,"description":"specific action"}]}
Use 3-7 steps. Minutes must be positive integers and should fit the stated time. Make steps concrete and finishable.`;

  try {
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.5",
      instructions: "You are Solvy, a practical accountability coach. Never invent completed work. Break goals into small, concrete actions.",
      input: prompt,
    });
    const text = response.output_text.trim().replace(/^```json\s*/,"").replace(/```$/,"");
    const plan = JSON.parse(text);

    await supabase.from("goals").insert({
      user_id: user.user.id,
      title: plan.title,
      description: goal,
      available_time: time,
      difficulty,
      target_completion: target,
      ai_plan: plan,
    });

    return NextResponse.json({ plan });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "AI planning failed" }, { status: 500 });
  }
}

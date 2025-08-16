import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: Request) {
  try {
    const { set1, set2 } = await req.json();

    const prompt = `
You are an academic evaluation assistant. Compare the following two question paper sets.

Evaluate the following:
- Similarity in content
- Bloom’s level distribution
- Difficulty level
- Coverage of unique topics
- Overall balance

Return only this JSON format:
{
  "similarity_score": 74,
  "summary": [
    "Both sets cover 4/5 units with overlap in Units 2 and 4",
    "Set 1 is more focused on medium-level Bloom's taxonomy questions",
    "Set 2 includes more analytical and application-based questions"
  ]
}

Set 1:
${set1}

Set 2:
${set2}
`.trim();

    const chat = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const reply = chat.choices[0].message.content || "";
    const jsonStart = reply.indexOf("{");
    const json = reply.slice(jsonStart);

    const parsed = JSON.parse(json);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Compare API error:", error);
    return NextResponse.json(
      { error: "Something went wrong during comparison." },
      { status: 500 }
    );
  }
}

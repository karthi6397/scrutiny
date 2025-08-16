// app/api/analyze/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: Request) {
  try {
    const { outcomes, syllabus, set1 }: { outcomes: string; syllabus: string; set1: string } =
      await req.json();

    const sanitize = (txt: string): string =>
      txt.replace(/•/g, "-").replace(/[‘’]/g, "'").replace(/[“”]/g, '"');

    // ✅ Explicitly typed as string[]
    const questions: string[] = set1
      .split(/\n\s*\n/)
      .map((q: string) => sanitize(q))
      .filter((q: string) => q.trim().length > 0);

    const systemPrompt = `
You are an expert academic evaluator.

For each question, return a JSON array with:
- "question": original question
- "bloom": Bloom's level
- "higherOrder": true/false
- "clarityScore": out of 100
- "grammarScore": out of 100
- "spellingScore": out of 100
- "overallScore": out of 100 (average of the above)
- "suggestions": list of 2 suggestions to improve

Respond in JSON array format only.
`;

    // ✅ Parameters typed (q: string, i: number)
    const userPrompt = questions
  .map((q: string, i: number) => `${i + 1}. ${q}`)
  .join("\n");


    const completion = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 2000,
    });

    let raw: string = completion.choices[0].message.content || "[]";
    if (!raw.trim().startsWith("[")) raw = raw.slice(raw.indexOf("["));
    if (!raw.trim().endsWith("]")) raw += "]";

    let evaluations: any[] = [];
    try {
      evaluations = JSON.parse(raw);
    } catch (err) {
      console.error("🔴 JSON parse failed:", raw);
      return NextResponse.json({ error: "AI response could not be parsed." }, { status: 500 });
    }

    const avg = (val: number): number =>
      evaluations.length ? Math.round(val / evaluations.length) : 0;

    let totalScore = 0;
    const metricTotals = { spelling: 0, grammar: 0, clarity: 0 };

    evaluations.forEach((q: any) => {
      totalScore += q.overallScore;
      metricTotals.spelling += q.spellingScore;
      metricTotals.grammar += q.grammarScore;
      metricTotals.clarity += q.clarityScore;
    });

    const metrics = [
      { label: "Spelling", score: avg(metricTotals.spelling) },
      { label: "Grammar", score: avg(metricTotals.grammar) },
      { label: "Clarity", score: avg(metricTotals.clarity) },
      { label: "Bloom Level", score: 90 },
      { label: "Higher Order", score: 85 },
      { label: "CO Match", score: 70 },
      { label: "Syllabus Match", score: 75 },
    ];

    return NextResponse.json({
      totalScore: avg(totalScore),
      metrics,
      unitCoverage: "3 / 5",
      difficulty: "Medium",
      evaluations,
    });
  } catch (err) {
    console.error("❌ Server Error:", err);
    return NextResponse.json({ error: "Evaluation failed." }, { status: 500 });
  }
}

// app/api/analyze/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: Request) {
  try {
    const { outcomes, syllabus, set1 } = await req.json();

    // Validate input
    if (
      typeof outcomes !== "string" ||
      typeof syllabus !== "string" ||
      typeof set1 !== "string"
    ) {
      console.error("Invalid input:", { outcomes, syllabus, set1 });
      return NextResponse.json(
        { error: "Invalid input data." },
        { status: 400 }
      );
    }

    const sanitize = (txt: string) =>
      txt.replace(/•/g, "-").replace(/[‘’]/g, "'").replace(/[“”]/g, '"');

    const questions: string[] = set1
      .split(/\n\s*\n/)
      .map(sanitize)
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

    const userPrompt = questions.map((q, i) => `${i + 1}. ${q}`).join("\n");

    const completion = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 2000,
    });

    if (!completion || !completion.choices || !completion.choices[0].message) {
      console.error("No completion from OpenAI:", completion);
      return NextResponse.json(
        { error: "No response from AI." },
        { status: 500 }
      );
    }

    // 🧹 Clean up response before parsing
    let raw = completion.choices[0].message?.content || "[]";
    raw = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

    // Try to extract the first JSON array from the response
    const match = raw.match(/\[[\s\S]*\]/);
    if (match) {
      raw = match[0];
    }

    let evaluations = [];
    try {
      evaluations = JSON.parse(raw);
    } catch (err) {
      console.error("🔴 JSON parse failed:", raw);
      return NextResponse.json(
        { error: "AI response could not be parsed." },
        { status: 500 }
      );
    }

    const avg = (val: number) =>
      evaluations.length ? Math.round(val / evaluations.length) : 0;

    let totalScore = 0;
    const metricTotals = { spelling: 0, grammar: 0, clarity: 0 };
    const bloomCounts: Record<string, number> = {};
    let higherOrderCount = 0;

    evaluations.forEach((q: any) => {
      totalScore += q.overallScore;
      metricTotals.spelling += q.spellingScore;
      metricTotals.grammar += q.grammarScore;
      metricTotals.clarity += q.clarityScore;

      if (q.bloom) {
        bloomCounts[q.bloom] = (bloomCounts[q.bloom] || 0) + 1;
      }
      if (q.higherOrder) higherOrderCount++;
    });

    // Most common Bloom level
    const mostCommonBloom =
      Object.entries(bloomCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    const metrics = [
      { label: "Spelling", score: avg(metricTotals.spelling) },
      { label: "Grammar", score: avg(metricTotals.grammar) },
      { label: "Clarity", score: avg(metricTotals.clarity) },
      { label: "Bloom Level", score: mostCommonBloom },
      {
        label: "Higher Order",
        score: Math.round((higherOrderCount / evaluations.length) * 100),
      },
      { label: "CO Match", score: 70 }, // placeholder until added
      { label: "Syllabus Match", score: 75 }, // placeholder until added
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
    return NextResponse.json(
      { error: "Evaluation failed." },
      { status: 500 }
    );
  }
}

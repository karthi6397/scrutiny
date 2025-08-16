"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const DonutChart = ({ score }: { score: number }) => {
  const data = [
    { name: "Score", value: score },
    { name: "Remaining", value: 100 - score },
  ];

  const remark =
    score >= 85
      ? "Excellent question paper!"
      : score >= 70
        ? "Good question paper with some areas for improvement."
        : "Needs refinement in structure or clarity.";

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h3 className="text-lg font-semibold mb-1">Overall Quality Score</h3>
      <div className="relative w-32 h-32">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={40}
              outerRadius={50}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              <Cell fill="#F59E0B" />
              <Cell fill="#E5E7EB" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
          {score}%
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-2 text-center px-2">{remark}</p>
    </div>
  );
};

export default function AnalysisPage() {
  const [coText, setCoText] = useState("");
  const [syllabusText, setSyllabusText] = useState("");
  const [questionsText, setQuestionsText] = useState("");
  const [hasSet2, setHasSet2] = useState(false);
  const [questionsText2, setQuestionsText2] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!coText || !syllabusText || !questionsText) {
      toast.error("Please fill all required fields.");
      return;
    }

    toast.loading("Analyzing...");
    try {
      const res = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outcomes: coText,
          syllabus: syllabusText,
          set1: questionsText,
        }),
      });

      const text = await res.text();

      try {
        const data = JSON.parse(text);
        toast.dismiss();

        if (res.ok) {
          setResult(data);
          toast.success("Analysis complete!");
        } else {
          setResult({ error: data.error, raw: text });
          toast.error(data.error || "Server responded with error.");
        }
      } catch (err) {
        toast.dismiss();
        console.error("❌ Not JSON:", text);
        setResult({ error: "Server response was not valid JSON.", raw: text });
        toast.error("Server sent an invalid response.");
      }
    } catch (err) {
      console.error("❌ Network or server error:", err);
      toast.dismiss();
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-center">🧠 Question Paper Evaluator</h1>

      <Card>
        <CardContent className="p-6 flex flex-col gap-4">
          <div>
            <Label>Course Outcomes *</Label>
            <Textarea
              placeholder="Enter COs..."
              value={coText}
              onChange={(e) => setCoText(e.target.value)}
              className="h-20"
            />
          </div>

          <div>
            <Label>Syllabus *</Label>
            <Textarea
              placeholder="Enter syllabus..."
              value={syllabusText}
              onChange={(e) => setSyllabusText(e.target.value)}
              className="h-20"
            />
          </div>

          <div>
            <Label>Question Paper Set 1 *</Label>
            <Textarea
              placeholder="Paste questions..."
              value={questionsText}
              onChange={(e) => setQuestionsText(e.target.value)}
              className="h-40"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="set2Checkbox"
              checked={hasSet2}
              onChange={() => setHasSet2(!hasSet2)}
              className="accent-blue-600 w-4 h-4"
            />
            <Label htmlFor="set2Checkbox">Add Question Paper Set 2</Label>
          </div>

          {hasSet2 && (
            <div>
              <Label>Question Paper Set 2</Label>
              <Textarea
                placeholder="Paste second question set..."
                value={questionsText2}
                onChange={(e) => setQuestionsText2(e.target.value)}
                className="h-40"
              />
            </div>
          )}

          <Button className="w-full mt-4" onClick={handleAnalyze}>
            Analyze
          </Button>

          <Button variant="secondary" className="w-full mt-2" onClick={() => window.location.href = "/compare"}>
            Compare
          </Button>
        </CardContent>
      </Card>

      {result?.error && (
        <div className="bg-red-100 border border-red-300 p-4 mt-6 rounded text-sm">
          <strong className="text-red-700">⚠️ Error:</strong> {result.error}
          <pre className="whitespace-pre-wrap mt-2 text-xs text-gray-700 bg-gray-50 p-2 rounded max-h-64 overflow-auto">
            {result.raw}
          </pre>
        </div>
      )}

      {result?.evaluations && (
        <div className="bg-white border p-6 rounded shadow mt-6">
          <h2 className="text-2xl font-semibold mb-2">📊 Evaluation Summary</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mb-6">
            <ul className="text-sm space-y-1">
              {result.metrics.map((m: any) => (
                <li key={m.label}>
                  🔹 <strong>{m.label}:</strong> {m.score} / 100
                </li>
              ))}
              <li><strong>Unit Coverage:</strong> {result.unitCoverage}</li>
              <li><strong>Difficulty:</strong> {result.difficulty}</li>
            </ul>
            <DonutChart score={result.totalScore} />
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-2">📄 Per-Question Analysis</h3>
          {result.evaluations.map((q: any, idx: number) => (
            <div key={idx} className="border p-4 rounded mb-4 bg-gray-50">
              <p className="font-semibold">Q{idx + 1}: {q.question}</p>
              <p><strong>Bloom Level:</strong> {q.bloom}</p>
              <p><strong>Higher Order:</strong> {q.higherOrder ? "✅ Yes" : "❌ No"}</p>
              <p><strong>Spelling:</strong> {q.spellingScore} / 100</p>
              <p><strong>Grammar:</strong> {q.grammarScore} / 100</p>
              <p><strong>Clarity:</strong> {q.clarityScore} / 100</p>
              <p><strong>Overall Score:</strong> {q.overallScore} / 100</p>
              <p><strong>Suggestions:</strong></p>
              <ul className="list-disc list-inside ml-4">
                {q.suggestions.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

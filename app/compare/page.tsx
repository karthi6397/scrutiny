"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"

export default function ComparePage() {
  const [set1, setSet1] = useState("")
  const [set2, setSet2] = useState("")
  const [result, setResult] = useState<any>(null)

  const handleCompare = async () => {
    if (!set1 || !set2) {
      alert("Please enter both question sets.")
      return
    }

    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ set1, set2 }),
      })

      const data = await res.json()
      if (res.ok) {
        setResult(data)
      } else {
        alert(data.error || "Comparison failed")
      }
    } catch (error) {
      console.error(error)
      alert("Something went wrong")
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Compare</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mt-6 mb-4">Compare Question Papers</h1>

      <textarea
        className="w-full h-40 p-4 border rounded mb-4 resize-y overflow-y-auto"
        placeholder="Paste Set 1 here..."
        value={set1}
        onChange={(e) => setSet1(e.target.value)}
      />
      <textarea
        className="w-full h-40 p-4 border rounded mb-4 resize-y overflow-y-auto"
        placeholder="Paste Set 2 here..."
        value={set2}
        onChange={(e) => setSet2(e.target.value)}
      />

      <Button className="w-full mt-2" onClick={handleCompare}>
        Compare
      </Button>

      {result && (
        <div className="mt-6 bg-white border rounded p-4 shadow">
          <h2 className="text-xl font-semibold mb-2">📊 Comparison Result</h2>
          <p><strong>Similarity Score:</strong> {result.similarity_score}%</p>
          <ul className="list-disc list-inside mt-2 text-sm text-gray-700">
            {result.summary.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

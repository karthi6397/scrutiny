"use client";

import Link from "next/link";
import {
  BadgeCheck,
  Brain,
  FileText,
  ShieldCheck,
  Users,
  Building2,
  TrendingUp,
  ClipboardList,
  CheckCircle
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#4A4A2F] flex items-center justify-center p-6">
      <div className="max-w-5xl w-full bg-white shadow-md rounded-xl p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Building2 className="text-[#2F2F1A]" />
          <h1 className="text-3xl md:text-4xl font-bold text-[#2F2F1A]">
            Welcome to SRMAP AI Admin Suite
          </h1>
        </div>
        <p className="text-lg text-[#3B3B1F]">
          Streamlining University Administration with Intelligence and Simplicity
        </p>

        {/* Description */}
        <p className="text-[#44432D] text-base leading-relaxed">
          SRMAP AI Admin Suite is your all-in-one intelligent assistant, built to simplify and optimize the core administrative functions across departments. Whether you're managing academic operations, evaluating question papers, generating reports, or overseeing student data, our platform provides smart, fast, and secure solutions — all in one place.
        </p>

        {/* Features */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Brain className="text-[#2F2F1A]" />
            <h2 className="text-2xl font-semibold text-[#2F2F1A]">Key Features</h2>
          </div>
          <ul className="space-y-4 text-[#3B3B1F]">
            <li className="flex items-start space-x-2">
              <FileText className="mt-1 w-5 h-5" />
              <span>
                <strong>AI-Powered Question Paper Evaluation:</strong> Instantly analyze, score, and compare question papers based on Bloom’s Taxonomy, grammar quality, course outcomes, and difficulty level.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <ShieldCheck className="mt-1 w-5 h-5" />
              <span>
                <strong>Smart Role-Based Access:</strong> Assign viewer, editor, or admin roles to ensure secure and organized collaboration across faculty and departments.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <ClipboardList className="mt-1 w-5 h-5" />
              <span>
                <strong>Seamless Report Generation:</strong> Automatically generate evaluation reports, performance insights, and content alignment summaries with just a few clicks.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <TrendingUp className="mt-1 w-5 h-5" />
              <span>
                <strong>Data-Driven Decision Support:</strong> Get actionable insights from academic data to support continuous improvement in curriculum delivery and assessment quality.
              </span>
            </li>
          </ul>
        </div>

        {/* Benefits */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <BadgeCheck className="text-[#2F2F1A]" />
            <h2 className="text-2xl font-semibold text-[#2F2F1A]">Why Choose Our Platform?</h2>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#3B3B1F]">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#C68A2F]" />
              <span>Saves Time & Manual Effort</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#C68A2F]" />
              <span>Increases Accuracy in Evaluations</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#C68A2F]" />
              <span>Enables Transparent Review Process</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#C68A2F]" />
              <span>Designed Specifically for SRMAP's Needs</span>
            </li>
          </ul>

        </div>

        {/* User Roles */}
        <div className="text-center text-[#44432D] text-sm pt-4 border-t border-gray-200">
          👩‍🏫 <strong>For Faculty</strong> | 👨‍🎓 <strong>For Students</strong> | 🏢 <strong>For Admins</strong>
          <br />
          <span className="block mt-1">
            Let AI handle the complexity — so you can focus on what matters most:{" "}
            <strong>education, excellence, and empowerment.</strong>
          </span>
        </div>

        {/* CTA Button */}
        <div className="text-center pt-4">
          <Link
            href="/analysis"
            className="inline-block bg-[#C68A2F] hover:bg-[#a77322] text-white font-semibold px-6 py-2 rounded transition"
          >
            Start Evaluating
          </Link>
        </div>
      </div>
    </div>
  );
}

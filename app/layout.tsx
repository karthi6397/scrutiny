// app/layout.tsx
import "./globals.css"; 

import Sidebar from "@/components/ui/sidebar";
import { ReactNode } from "react";

export const metadata = {
  title: "Question Paper Evaluator",
  description: "Evaluate or compare question papers using AI",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}

"use client";

import {
  Home,
  Book,
  Settings,
  Users,
  Briefcase,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r h-screen flex flex-col justify-between">
      <div>
        {/* Logo and header */}
        <div className="p-4 flex items-center space-x-2">
          <LayoutDashboard className="text-black" />
          <div>
            <h2 className="text-sm font-bold">Acme Inc</h2>
            <p className="text-xs text-gray-500">Enterprise</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 space-y-1 px-2">
          <SidebarItem icon={<Home />} text="Home" href="/" />

          <p className="text-xs text-gray-500 mt-6 mb-2">Projects</p>
          <SidebarItem icon={<Briefcase />} text="Research" />
          <SidebarItem icon={<Users />} text="Administration" />

          {/* Collapsible Academics section */}
          <SidebarSection title="Academics" icon={<Briefcase />}>
            <SidebarItem
              icon={<Book />}
              text="Questionnaire Scrutinizing"
              href="/analysis"
              isSub
            />
            <SidebarItem
              icon={<Settings />}
              text="Question Paper Comparison"
              href="/compare"
              isSub
            />
          </SidebarSection>
        </nav>
      </div>

      {/* Footer profile */}
      <div className="p-4 flex items-center space-x-2 border-t">
        <Image
          src="/avatar.png"
          alt="User"
          width={32}
          height={32}
          className="rounded-full"
        />
        <div>
          <p className="text-sm font-semibold">shadcn</p>
          <p className="text-xs text-gray-500">m@example.com</p>
        </div>
      </div>
    </aside>
  );
}

// 🔧 Helper for regular or sub menu item
function SidebarItem({
  icon,
  text,
  href = "#",
  isSub = false,
}: {
  icon: React.ReactNode;
  text: string;
  href?: string;
  isSub?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center space-x-2 p-2 rounded hover:bg-gray-100 text-sm font-medium text-gray-700 ${
        isSub ? "pl-8 text-sm" : ""
      }`}
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
}

// 🔽 Collapsible Section
function SidebarSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full p-2 rounded hover:bg-gray-100 text-sm font-medium text-gray-700"
      >
        <div className="flex items-center space-x-2">
          {icon}
          <span>{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {open && <div className="mt-1">{children}</div>}
    </div>
  );
}

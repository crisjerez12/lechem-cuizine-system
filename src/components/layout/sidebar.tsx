"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Globe,
  CalendarDays,
  Tag,
  UserCircle2,
  BookOpenCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Globe, label: "Pending", href: "/dashboard/online" },
  {
    icon: BookOpenCheck,
    label: "Reservations",
    href: "/dashboard/reservations",
  },
  { icon: CalendarDays, label: "Calendar", href: "/dashboard/calendar" },
  { icon: Tag, label: "Packages", href: "/dashboard/package" },
  { icon: UserCircle2, label: "Account", href: "/dashboard/account" },
];

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "fixed md:relative h-screen bg-gradient-to-b from-emerald-400 to-emerald-600 backdrop-blur-lg border-r border-emerald-100 p-6 flex flex-col transition-all duration-300 ease-in-out z-20",
        isOpen
          ? "translate-x-0 w-64"
          : "-translate-x-full w-64 md:-translate-x-56 md:w-20"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 mb-8",
          !isOpen && "md:justify-center"
        )}
      >
        <div className="h-10 w-16 bg-white/90 px-2 rounded-xl flex items-center justify-center shadow-lg">
          <Image src="/logo.png" height={100} width={100} alt="logo" />
        </div>
        <div
          className={cn(
            "transition-opacity duration-200",
            !isOpen && "md:opacity-0"
          )}
        >
          <h1 className="font-bold text-white">Lechem Cuizine</h1>
          <p className="text-xs text-white/80">Reservation System</p>
        </div>
      </div>

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 text-white hover:bg-white/10 relative",
                  isActive && "bg-white/10 border-l-4 border-orange-500 pl-5",
                  !isOpen && "md:justify-center md:pl-3"
                )}
              >
                <Icon className="h-5 w-5" />
                <span
                  className={cn(
                    "transition-opacity duration-200",
                    !isOpen && "md:hidden"
                  )}
                >
                  {item.label}
                </span>
              </Button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { toast } from "sonner";
import { getUserInfo, logout } from "@/actions/auth";
import { useEffect, useState } from "react";

interface HeaderProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export function Header({ isOpen, setIsOpen }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<string | undefined>("User");
  const getPageTitle = (path: string) => {
    const segments = path.split("/");
    const lastSegment = segments[segments.length - 1];
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  };
  useEffect(() => {
    async function fecthUserInfo() {
      const res = await getUserInfo();
      if (!res.success || res.data === undefined) setCurrentUser("User");
      setCurrentUser(res.data);
    }
    fecthUserInfo();
  }, []);
  const handleLogout = async () => {
    const res = await logout();
    if (!res.success) {
      toast.error("Logged out unsuccessful");
      return;
    }
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <header className="h-16 bg-white/70 backdrop-blur-lg border-b border-emerald-100 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold text-gray-800">
          {getPageTitle(pathname)==="Online"?"Pending Reservations":getPageTitle(pathname)}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-gray-600 capitalize">{currentUser}</span>
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
}

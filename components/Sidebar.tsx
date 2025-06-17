"use client";

import { Home, PlusSquare, User, LogOut, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const pathName = usePathname();
  const router = useRouter();

  const navItems = [
    { name: "Home", icon: Home, href: "/" },
    { name: "Create", icon: PlusSquare, href: "/posts" },
    { name: "Search", icon: Search, href: "/search" },
    { name: "Profile", icon: User, href: "/profile" },
  ];

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      if (res.ok) {
        alert("user logged out");
        router.push("/login");
      } else {
        alert("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <>
      <nav
        className=" fixed bg-black shadow-sm z-50
        bottom-0 w-full flex justify-around items-center h-14
        md:top-0 md:left-0 md:w-60 md:h-full md:flex-col md:justify-start md:gap-6"
      >
        {navItems.map(({ name, icon: Icon, href }) => (
          <Link
            key={name}
            href={href}
            className={`flex flex-row items-center justify-center md:p-5
              text-gray-500 hover:text-white transition-colors
              ${pathName === href ? "text-white font-bold" : ""}
            `}
          >
            <div className="px-4">
              <Icon className="w-10 h-7" />
            </div>
            <span className="text-lg hidden md:block">{name}</span>
          </Link>
        ))}

        <button
          onClick={handleLogout}
          className="flex items-center justify-center p-5 text-red-500 hover:text-white transition-colors"
        >
          <div className="px-4">
            <LogOut className="w-10 h-7" />
          </div>
          <span className="text-lg hidden md:block">Logout</span>
        </button>
      </nav>
    </>
  );
}

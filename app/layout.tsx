"use client"

import { usePathname } from 'next/navigation';
import './globals.css';
import Sidebar from "@/components/Sidebar";

export default function ROOTlayout({
  children
}:{
  children: React.ReactNode;
}){
const pathname = usePathname();

const hideSidebar = pathname === "/login" || pathname === "/signup";

return(
  <html lang = "en">
    <body className="grid grid-cols-[auto_1fr_auto] min-h-screen bg-gray-50">
      {!hideSidebar && <Sidebar />}
      <main className="col-start-2 bg-neutral-900">{children}</main>
      
    </body>
  </html>
)
}
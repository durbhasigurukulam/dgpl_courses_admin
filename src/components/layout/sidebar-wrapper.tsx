"use client";

import { AppSidebar } from "@/components/layout/sidebar";
import { usePathname } from "next/navigation";

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Do not show sidebar on the login page
    if (pathname === '/login') {
        return (
            <div className="flex min-h-screen">
                <main className="flex-1 w-full relative">
                    {children}
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            <AppSidebar />
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}

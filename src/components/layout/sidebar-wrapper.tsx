"use client";

import { AppSidebar } from "@/components/layout/sidebar";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // Check if user is logged in via localStorage (set during login)
        // or checks unrelated to HttpOnly cookies.
        // Ideally, we would hit an endpoint like /api/auth/me, but that requires a running server.
        // For static export, we rely on client-side state or presence of non-HttpOnly cookies if any.
        // As a fallback/simple check for this refactor:
        const user = localStorage.getItem('user');
        setIsLoggedIn(!!user);
    }, [pathname]);

    // If on login page, don't show sidebar?
    // The original logic was check cookies.

    return (
        <div className="flex min-h-screen">
            {isLoggedIn && <AppSidebar />}
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}

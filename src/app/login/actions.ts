// 'use server'; // Not used in static export

// import { cookies } from "next/headers"; // Not available in static export
import { getApiUrl } from "@/lib/api-utils";
import { clearAuthCookies, setAuthCookie } from "@/app/actions/auth";

interface LoginCredentials {
  email: string;
  password?: string;
}

export async function loginUser(credentials: LoginCredentials) {
  try {
    const res = await fetch("https://api.courses.durbhasigurukulam.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: 'include', // Important for browser to handle cookies
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return { success: false, message: data.message || "Login failed" };
    }

    // Browser handles the Set-Cookie for connect.sid automatically.

    // For the user object, we can return it.
    // The client-side code calling this should handle storing the user state (e.g. context/localStorage).
    if (typeof window !== 'undefined' && data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    // Manually set the HTTPOnly user cookie for Next.js middleware using the Server Action
    if (data.user) {
      await setAuthCookie(data.user);
    }

    return { success: true, user: data.user };
  } catch (error: any) {
    console.error('❌ Login error:', error);
    return { success: false, message: error.message || "An unknown error occurred" };
  }
}

export async function logoutUser() {
  try {
    // In client-side, we call the logout API endpoint to invalidate the session
    await fetch(getApiUrl('/api/auth/logout'), { method: 'POST', credentials: 'include' });

    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      // Clear cookies from domain (works for non-HttpOnly cookies)
      document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    // Use a Next.js Server Action to clear HttpOnly cookies on this domain
    await clearAuthCookies();

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message || "Logout failed" };
  }
}

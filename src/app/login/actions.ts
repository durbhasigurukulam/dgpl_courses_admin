
// 'use server'; // Not used in static export

// import { cookies } from "next/headers"; // Not available in static export
import { getApiUrl } from "@/lib/api-utils";

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
      throw new Error(data.message || "Login failed");
    }

    // Browser handles the Set-Cookie for connect.sid automatically.

    // For the user object, we can return it.
    // The client-side code calling this should handle storing the user state (e.g. context/localStorage).
    if (typeof window !== 'undefined' && data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return { success: true, user: data.user };
  } catch (error: any) {
    console.error('❌ Login error:', error);
    return { success: false, message: error.message || "An unknown error occurred" };
  }
}

export async function logoutUser() {
  try {
    // const cookieStore = await cookies();

    // Clear both cookies
    // cookieStore.delete("connect.sid");
    // cookieStore.delete("user");

    // In client-side, we might want to call a logout API endpoint to invalidate the session
    // await fetch(getApiUrl('/api/auth/logout'), { method: 'POST', credentials: 'include' });

    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      // document.cookie = "connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Can't clear HttpOnly cookie
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message || "Logout failed" };
  }
}

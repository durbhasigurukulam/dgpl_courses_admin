'use server';

import { cookies } from "next/headers";

/**
 * Manually set the working session cookie for testing
 * Call this function to set the cookie from your working curl command
 */
export async function setTestCookie() {
  const cookieStore = await cookies();
  
  // Set the working cookie from your curl command
  const workingCookie = "s%3AGcFBaSd-YCwOjTV2Cx3kcrxDEtKDUGDp.xF%2FtlfjXgZ7urpdhRm6P2ngt7qAZzm97nYIGvnNGnPY";
  
  cookieStore.set("connect.sid", workingCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  });
  
  console.log("✅ Test cookie set successfully");
  return { success: true };
}

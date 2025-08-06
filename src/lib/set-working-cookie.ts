'use server';

import { cookies } from "next/headers";

/**
 * Set the working session cookie from your curl command
 * This is a temporary solution for testing
 */
export async function setWorkingCookie() {
  try {
    const cookieStore = await cookies();
    
    // The working cookie from your curl command
    const workingCookie = "s%3AGcFBaSd-YCwOjTV2Cx3kcrxDEtKDUGDp.xF%2FtlfjXgZ7urpdhRm6P2ngt7qAZzm97nYIGvnNGnPY";
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    
    cookieStore.set("connect.sid", workingCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: expiryDate,
    });
    
    console.log('✅ Working cookie set successfully');
    return { success: true, message: 'Working cookie set successfully' };
  } catch (error: any) {
    console.error('❌ Error setting cookie:', error);
    return { success: false, message: error.message };
  }
}
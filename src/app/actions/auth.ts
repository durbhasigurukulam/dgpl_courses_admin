'use server'

import { cookies } from 'next/headers'

export async function clearAuthCookies() {
    const cookieStore = await cookies()
    cookieStore.delete('user')
    cookieStore.delete('connect.sid')
    return { success: true }
}

export async function setAuthCookie(user: any) {
    const cookieStore = await cookies()
    cookieStore.set('user', JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
    })
    return { success: true }
}

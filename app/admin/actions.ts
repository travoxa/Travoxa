'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'

// Hashed password for "72034"
// Generated using: bcrypt.hashSync('72034', 10)
const ADMIN_PASSWORD_HASH = '$2b$10$UL5Rc2M7TpoZYC6HOj2ZTOBvIOLJeLJgX/6.gg.DqfSfdoTfwG8TO'

export async function loginAction(prevState: any, formData: FormData) {
    const loginId = formData.get('loginId')
    const password = formData.get('password')

    // Protected method: Verify credentials using bcrypt
    const isValidLogin = loginId === 'admin' && password && await bcrypt.compare(password.toString(), ADMIN_PASSWORD_HASH)

    if (isValidLogin) {
        // Set a cookie to maintain session
        const cookieStore = await cookies()
        cookieStore.set('admin_access', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        })

        return { success: true }
    } else {
        return { success: false, error: 'Invalid Login ID or Password' }
    }
}

export async function logoutAction() {
    const cookieStore = await cookies()
    cookieStore.delete('admin_access')
    redirect('/admin')
}

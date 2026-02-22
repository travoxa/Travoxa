'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import TeamMember from '@/models/TeamMember'

// Hashed password for "72034"
// Generated using: bcrypt.hashSync('72034', 10)
const ADMIN_PASSWORD_HASH = '$2b$10$UL5Rc2M7TpoZYC6HOj2ZTOBvIOLJeLJgX/6.gg.DqfSfdoTfwG8TO'

export async function loginAction(prevState: any, formData: FormData) {
    const loginId = formData.get('loginId')
    const password = formData.get('password')

    if (!loginId || !password) {
        return { success: false, error: 'Login ID and Password are required' }
    }

    await connectDB();

    let sessionValue = '';
    let isValid = false;

    // 1. Check if it's the main admin
    if (loginId === 'admin') {
        isValid = await bcrypt.compare(password.toString(), ADMIN_PASSWORD_HASH);
        if (isValid) sessionValue = 'admin';
    } else {
        // 2. Check if it's a team member
        const member = await TeamMember.findOne({ username: loginId });
        if (member && member.password) {
            isValid = await bcrypt.compare(password.toString(), member.password);
            if (isValid) sessionValue = member._id.toString();
        }
    }

    if (isValid) {
        // Set a cookie to maintain session
        const cookieStore = await cookies()
        cookieStore.set('admin_access', sessionValue, {
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

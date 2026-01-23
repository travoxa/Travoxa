import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
    const cookieStore = await cookies()
    cookieStore.delete('admin_access')
    return NextResponse.redirect(new URL('/admin', process.env.NEXTAUTH_URL || 'http://localhost:3000'))
}

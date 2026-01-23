import { cookies } from 'next/headers'
import LoginForm from './LoginForm'
import { logoutAction } from './actions'
import AdminDashboardClient from './AdminDashboardClient'

export default async function AdminPage() {
    const cookieStore = await cookies()
    const isLoggedIn = cookieStore.get('admin_access')?.value === 'true'

    if (!isLoggedIn) {
        return <LoginForm />
    }

    // Create admin user object
    const adminUser = {
        name: 'Admin',
        email: 'admin@travoxa.com',
        image: null,
        id: 'admin'
    }

    return <AdminDashboardClient adminUser={adminUser} />
}

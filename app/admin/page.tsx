import { cookies } from 'next/headers'
import LoginForm from './LoginForm'
import AdminDashboardClient from './AdminDashboardClient'
import { connectDB } from '@/lib/mongodb'
import TeamMember from '@/models/TeamMember'

export default async function AdminPage() {
    const cookieStore = await cookies()
    const sessionValue = cookieStore.get('admin_access')?.value

    if (!sessionValue) {
        return <LoginForm />
    }

    let adminUser: any = null;

    if (sessionValue === 'admin' || sessionValue === 'true') {
        // Main Admin
        adminUser = {
            name: 'Admin',
            email: 'admin@travoxa.com',
            image: null,
            id: 'admin',
            role: 'Super Admin',
            permissions: ['Overview', 'Landing', 'Tour', 'Discovery', 'Backpackers', 'Team', 'Vendor Requests', 'Emergency'] // All permissions
        }
    } else {
        // Team Member - Fetch from DB
        try {
            await connectDB();
            const member = await TeamMember.findById(sessionValue);
            if (member) {
                adminUser = {
                    name: member.name,
                    role: member.role,
                    image: member.image,
                    id: member._id.toString(),
                    permissions: member.permissions || []
                }
            } else {
                return <LoginForm />
            }
        } catch (error) {
            console.error('Error fetching team member:', error);
            return <LoginForm />
        }
    }

    return <AdminDashboardClient adminUser={adminUser} />
}

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getUser } from '@/lib/mongodbUtils'
import VendorDashboardClient from './VendorDashboardClient'

export default async function VendorDashboard() {
    // 1. Get Session
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        redirect('/vendor/login')
    }

    // 2. Fetch User from DB to get the latest role and vendorDetails
    const dbUser = await getUser(session.user.email!)
    if (!dbUser) {
        redirect('/vendor/login')
    }

    // 3. Security Check - is this user actually a vendor?
    if (dbUser.role !== 'vendor') {
        // Normal users shouldn't be here
        redirect('/')
    }

    // 4. Onboarding Check - have they completed the business profile?
    if (!dbUser.profileComplete || !dbUser.vendorDetails) {
        redirect('/vendor/onboarding')
    }

    // 5. Pass data to client component
    const vendorUser = {
        id: dbUser._id.toString(),
        name: dbUser.name || 'Vendor',
        email: dbUser.email,
        vendorDetails: {
            businessName: dbUser.vendorDetails.businessName || '',
            businessType: dbUser.vendorDetails.businessType || '',
            address: dbUser.vendorDetails.address || '',
        }
    }


    return <VendorDashboardClient vendorUser={vendorUser} />
}

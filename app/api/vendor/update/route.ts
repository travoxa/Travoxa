import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { updateUser, getUser } from '@/lib/mongodbUtils';

export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || session.user.role !== 'vendor') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { businessName, businessType, address } = body;

        if (!businessName || !businessType) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const email = session.user.email;
        if (!email) {
            return NextResponse.json({ error: 'User email not found' }, { status: 400 });
        }

        const existingUser = await getUser(email);
        if (!existingUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const updates = {
            vendorDetails: {
                ...existingUser.vendorDetails,
                businessName,
                businessType,
                address,
            }
        };

        const updatedUser = await updateUser(email, updates as any);

        if (!updatedUser) {
            return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
        }

        return NextResponse.json({
            message: 'Vendor details updated successfully',
            vendorDetails: updatedUser.vendorDetails
        });

    } catch (error) {
        console.error('Error updating vendor details:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

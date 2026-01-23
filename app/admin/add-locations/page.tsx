import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AddLocationClient from './AddLocationClient'

export default async function AddLocationPage() {
  const cookieStore = await cookies()
  const isLoggedIn = cookieStore.get('admin_access')?.value === 'true'

  if (!isLoggedIn) {
    redirect('/admin')
  }

  return <AddLocationClient />
}

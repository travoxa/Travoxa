// // app/dashboard/page.tsx (Server Component)
// import { getServerSession } from "next-auth"
// import { redirect } from "next/navigation"
// import InteractiveButton from "./InteractiveButton"
// import UserProfile from "./UserProfile"

// export default async function Dashboard() {
//   const session = await getServerSession()
  
//   if (!session) {
//     redirect('/login')
//   }
  
//   // Fetch data on server
//   const userData = await fetch('https://api.example.com/user').then(r => r.json())
  
//   return (
//     <div>
//       <h1>Welcome {session.user?.email}</h1>
      
//       {/* Static content - server rendered */}
//       <p>Your account status: {userData.status}</p>
      
//       {/* Interactive parts - client components */}
//       <InteractiveButton />
//       <UserProfile initialData={userData} />
//     </div>
//   )
// }
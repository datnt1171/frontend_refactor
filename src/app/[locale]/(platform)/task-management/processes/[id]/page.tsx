// import { getProcess, getUsers } from "@/lib/api/server"
// import { ProcessFormClient } from "./ProcessForm"


// interface PageProps {
//   params: Promise<{ id: string }>
// }

// export default async function FormPage({ params }: PageProps) {
//   const { id } = await params
  
//   // Fetch data on the server
//   const [process, usersResponse] = await Promise.all([
//     getProcess(id),
//     getUsers()
//   ])

//   return (
//     <ProcessFormClient 
//       process={process}
//       users={usersResponse.results}
//     />
//   )
// }
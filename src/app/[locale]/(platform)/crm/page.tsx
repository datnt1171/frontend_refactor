import { Factory } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <Factory className="w-32 h-32 text-blue-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-800">CRM</h1>
      </div>
    </div>
  )
}
import ProductionCRUDTable from "./components/SheetTable"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <ProductionCRUDTable />
      </div>
    </div>
  )
}
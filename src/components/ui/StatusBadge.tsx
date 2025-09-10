import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"

export function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge variant={isActive ? "default" : "secondary"} className="gap-1">
      {isActive ? (
        <>
          <CheckCircle className="h-3 w-3" />
          Active
        </>
      ) : (
        <>
          <XCircle className="h-3 w-3" />
          Inactive
        </>
      )}
    </Badge>
  )
}
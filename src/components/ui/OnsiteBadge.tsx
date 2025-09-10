import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"

export function OnsiteBadge({ hasOnsite }: { hasOnsite: boolean }) {
  return (
    <Badge variant={hasOnsite ? "outline" : "secondary"} className="gap-1">
      {hasOnsite ? (
        <>
          <CheckCircle className="h-3 w-3" />
          Yes
        </>
      ) : (
        <>
          <XCircle className="h-3 w-3" />
          No
        </>
      )}
    </Badge>
  )
}
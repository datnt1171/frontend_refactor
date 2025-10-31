import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"

interface OnsiteBadgeProps {
  hasOnsite: boolean
  yesText: string
  noText: string
}

export function OnsiteBadge({ hasOnsite, yesText, noText }: OnsiteBadgeProps) {
  return (
    <Badge variant={hasOnsite ? "default" : "secondary"} className="gap-1">
      {hasOnsite ? (
        <>
          <CheckCircle className="h-3 w-3" />
          {yesText}
        </>
      ) : (
        <>
          <XCircle className="h-3 w-3" />
          {noText}
        </>
      )}
    </Badge>
  )
}
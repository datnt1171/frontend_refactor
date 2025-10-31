import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"

interface StatusBadgeProps {
  isActive: boolean
  activeText: string
  inactiveText: string
}

export function StatusBadge({ isActive, activeText, inactiveText }: StatusBadgeProps) {
  return (
    <Badge variant={isActive ? "default" : "secondary"} className="gap-1">
      {isActive ? (
        <>
          <CheckCircle className="h-3 w-3" />
          {activeText}
        </>
      ) : (
        <>
          <XCircle className="h-3 w-3" />
          {inactiveText}
        </>
      )}
    </Badge>
  )
}
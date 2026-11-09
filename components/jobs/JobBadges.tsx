import React from "react"
import { Globe, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

export function JobStatusBadge({
  status,
  className,
}: {
  status?: "Active" | "Expired" | "Draft"
  className?: string
}) {
  const isExpired = status === "Expired"

  if (isExpired) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-zinc-700/60 bg-zinc-800/80 px-2.5 py-0.5 text-[11px] font-medium text-zinc-400 whitespace-nowrap",
          className
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
        Expired
      </span>
    )
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400 whitespace-nowrap",
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      Active
    </span>
  )
}

export function JobLocationBadge({
  isRemote,
  location,
  className,
}: {
  isRemote?: boolean
  location?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-xs text-zinc-400",
        className
      )}
    >
      {isRemote ? (
        <>
          <Globe className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
          <span className="truncate">Remote ({location || "Worldwide"})</span>
        </>
      ) : (
        <>
          <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
          <span className="truncate">{location || "Not specified"}</span>
        </>
      )}
    </div>
  )
}

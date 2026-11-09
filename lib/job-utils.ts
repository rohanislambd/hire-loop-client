import React from "react"
import {
  Code2,
  Megaphone,
  Palette,
  ShieldCheck,
  Terminal,
} from "lucide-react"

export interface DepartmentConfig {
  icon: React.ComponentType<{ className?: string }>
  iconClass: string
  textClass: string
}

export const DEPARTMENT_CONFIGS: Record<string, DepartmentConfig> = {
  Engineering: {
    icon: Code2,
    iconClass: "border-blue-500/20 bg-blue-500/10 text-blue-400",
    textClass: "text-blue-400",
  },
  Design: {
    icon: Palette,
    iconClass: "border-amber-500/20 bg-amber-500/10 text-amber-400",
    textClass: "text-amber-400",
  },
  Infrastructure: {
    icon: Terminal,
    iconClass: "border-cyan-500/20 bg-cyan-500/10 text-cyan-400",
    textClass: "text-cyan-400",
  },
  Marketing: {
    icon: Megaphone,
    iconClass: "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-400",
    textClass: "text-fuchsia-400",
  },
  Quality: {
    icon: ShieldCheck,
    iconClass: "border-indigo-500/20 bg-indigo-500/10 text-indigo-400",
    textClass: "text-indigo-400",
  },
}

export function getDeptConfig(deptName?: string): DepartmentConfig {
  if (!deptName) return DEPARTMENT_CONFIGS.Engineering
  if (DEPARTMENT_CONFIGS[deptName]) return DEPARTMENT_CONFIGS[deptName]

  const lower = deptName.toLowerCase()
  if (lower.includes("design")) return DEPARTMENT_CONFIGS.Design
  if (lower.includes("market")) return DEPARTMENT_CONFIGS.Marketing
  if (lower.includes("infra") || lower.includes("devops")) {
    return DEPARTMENT_CONFIGS.Infrastructure
  }
  if (lower.includes("qa") || lower.includes("quality")) {
    return DEPARTMENT_CONFIGS.Quality
  }
  return DEPARTMENT_CONFIGS.Engineering
}

export function formatCompensation(
  min?: string,
  max?: string,
  frequency?: string,
  currency = "€"
): string {
  if (!min && !max) return "Negotiable"
  const freqLower = (frequency || "year").toLowerCase()
  let freqShort = "mo"
  if (freqLower.includes("hour")) freqShort = "hr"
  else if (freqLower.includes("year")) freqShort = "yr"

  const formatVal = (v?: string) => {
    if (!v) return ""
    if (v.toLowerCase().endsWith("k")) return `${currency}${v}`
    const num = Number(v)
    if (!isNaN(num) && num >= 1000) {
      return `${currency}${num / 1000}k`
    }
    return `${currency}${v}`
  }

  if (min && max) {
    return `${formatVal(min)} - ${formatVal(max)} / ${freqShort}`
  }
  return `${formatVal(min || max)} / ${freqShort}`
}

export function formatDeadline(deadlineStr?: string): string {
  if (!deadlineStr) return "Open until filled"
  try {
    const d = new Date(deadlineStr)
    if (isNaN(d.getTime())) return deadlineStr
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
  } catch {
    return deadlineStr
  }
}

import React from "react"
import { cn } from "@/lib/utils"

export function FormSectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full bg-[#5d63f6]" />
      <h2 className="text-sm font-semibold tracking-wide text-zinc-200">
        {title}
      </h2>
    </div>
  )
}

interface FormFieldProps {
  label: string
  required?: boolean
  htmlFor?: string
  hint?: string
  children: React.ReactNode
  className?: string
}

export function FormField({
  label,
  required,
  htmlFor,
  hint,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between">
        <label htmlFor={htmlFor} className="text-xs font-medium text-zinc-300">
          {label} {required && <span className="text-[#8c84fc]">*</span>}
        </label>
        {hint && (
          <span className="text-[11px] text-zinc-500 font-medium">{hint}</span>
        )}
      </div>
      {children}
    </div>
  )
}

interface InputWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export function InputWrapper({
  children,
  className,
  ...props
}: InputWrapperProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-800/80 bg-[#12131a] px-3.5 py-2.5 transition-colors focus-within:border-zinc-700 flex items-center gap-2.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

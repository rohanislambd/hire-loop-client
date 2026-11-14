"use client"

import React from "react"
import { Checkbox } from "@/components/ui/checkbox"

export interface FilterOption {
  label: string
  value: string
  count?: string | number
}

interface JobFilterGroupProps {
  idPrefix: string
  title: string
  options: FilterOption[]
  selectedValue: string
  onSelect: (value: string) => void
}

export function JobFilterGroup({
  idPrefix,
  title,
  options,
  selectedValue,
  onSelect,
}: JobFilterGroupProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold tracking-wide text-zinc-300">
        {title}
      </h3>
      <div className="space-y-2.5">
        {options.map((option) => {
          const checkboxId = `${idPrefix}-${option.value}`
          const isChecked = selectedValue === option.value

          return (
            <div
              key={option.value}
              className="flex items-center justify-between gap-2"
            >
              <label
                htmlFor={checkboxId}
                className="flex items-center gap-2.5 cursor-pointer select-none group"
              >
                <Checkbox
                  id={checkboxId}
                  checked={isChecked}
                  onCheckedChange={() => onSelect(option.value)}
                  className="border-zinc-700 bg-[#12131a] data-checked:bg-white data-checked:border-white data-checked:text-zinc-950"
                />
                <span className="text-xs sm:text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors capitalize">
                  {option.label}
                </span>
              </label>

              {option.count !== undefined && (
                <span className="text-xs text-zinc-500 tabular-nums">
                  {option.count}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

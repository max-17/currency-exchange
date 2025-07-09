"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DateRangePickerProps {
  from: Date
  to: Date
  onSelect: (range: { from: Date; to: Date } | undefined) => void
  className?: string
}

export function DateRangePicker({ from, to, onSelect, className }: DateRangePickerProps) {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from,
    to,
  })

  // Sync external changes with internal state
  React.useEffect(() => {
    setRange({ from, to })
  }, [from, to])

  function handleSelect(selected: DateRange | undefined) {
    setRange(selected)
    // Call the external onSelect callback
    if (selected?.from && selected?.to) {
      onSelect({ from: selected.from, to: selected.to })
    } else if (selected?.from && !selected?.to) {
      // Handle single date selection (start of range)
      onSelect(undefined)
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date-range"
            variant="outline"
            className={cn("w-[260px] justify-start text-left font-normal", !range && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {range?.from ? (
              range.to ? (
                <>
                  {format(range.from, "dd MMM y", { locale: ru })} – {format(range.to, "dd MMM y", { locale: ru })}
                </>
              ) : (
                format(range.from, "dd MMM y", { locale: ru })
              )
            ) : (
              <span>Выберите диапазон дат</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={range?.from}
            selected={range}
            onSelect={handleSelect}
            className="rounded-lg border shadow-sm"
            locale={ru}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Clock } from "lucide-react"
import { TimePickerPopup } from "@/components/Job/time-picker-popup"

interface SimpleTimeInputProps {
  value?: string
  onChange: (time: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function SimpleTimeInput({
  value = "",
  onChange,
  placeholder = "Select time",
  disabled = false,
  className = "",
}: SimpleTimeInputProps) {
  const [showTimePicker, setShowTimePicker] = useState(false)

  const formatDisplayTime = (time: string) => {
    if (!time) return ""

    const [hours, minutes] = time.split(":")
    const hour12 =
      Number.parseInt(hours) === 0
        ? 12
        : Number.parseInt(hours) > 12
          ? Number.parseInt(hours) - 12
          : Number.parseInt(hours)
    const period = Number.parseInt(hours) >= 12 ? "PM" : "AM"

    return `${hour12}:${minutes} ${period}`
  }

  const handleTimeSelect = (selectedTime: string) => {
    onChange(selectedTime)
  }

  return (
    <>
      <div className={`relative ${className}`}>
        <Input
          value={formatDisplayTime(value)}
          placeholder={placeholder}
          readOnly
          disabled={disabled}
          className="pr-10 cursor-pointer"
          onClick={() => !disabled && setShowTimePicker(true)}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
          onClick={() => !disabled && setShowTimePicker(true)}
          disabled={disabled}
        >
          <Clock className="w-4 h-4" />
        </Button>
      </div>

      <TimePickerPopup
        open={showTimePicker}
        onOpenChange={setShowTimePicker}
        onTimeSelect={handleTimeSelect}
        selectedTime={value}
      />
    </>
  )
}

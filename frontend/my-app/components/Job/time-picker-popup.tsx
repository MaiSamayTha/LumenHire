"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Clock } from "lucide-react"

interface TimePickerPopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTimeSelect: (time: string) => void
  title?: string
  description?: string
  selectedTime?: string
}

export function TimePickerPopup({
  open,
  onOpenChange,
  onTimeSelect,
  title = "Select Time",
  description = "Choose your preferred time",
  selectedTime = "",
}: TimePickerPopupProps) {
  const [hours, setHours] = useState(selectedTime ? selectedTime.split(":")[0] : "09")
  const [minutes, setMinutes] = useState(selectedTime ? selectedTime.split(":")[1] : "00")
  const [period, setPeriod] = useState(
    selectedTime ? (Number.parseInt(selectedTime.split(":")[0]) >= 12 ? "PM" : "AM") : "AM",
  )

  // Generate hours (1-12 for 12-hour format)
  const hourOptions = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 1
    return hour.toString().padStart(2, "0")
  })

  // Generate minutes (00, 15, 30, 45)
  const minuteOptions = ["00", "15", "30", "45"]

  const handleConfirm = () => {
    // Convert to 24-hour format
    let hour24 = Number.parseInt(hours)
    if (period === "PM" && hour24 !== 12) {
      hour24 += 12
    } else if (period === "AM" && hour24 === 12) {
      hour24 = 0
    }

    const timeString = `${hour24.toString().padStart(2, "0")}:${minutes}`
    onTimeSelect(timeString)
    onOpenChange(false)
  }

  const handleQuickTime = (time: string) => {
    onTimeSelect(time)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Time Selection */}
          <div>
            <h4 className="text-sm font-medium mb-3">Quick Select</h4>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "9:00 AM", value: "09:00" },
                { label: "10:00 AM", value: "10:00" },
                { label: "11:00 AM", value: "11:00" },
                { label: "1:00 PM", value: "13:00" },
                { label: "2:00 PM", value: "14:00" },
                { label: "3:00 PM", value: "15:00" },
              ].map((time) => (
                <Button
                  key={time.value}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickTime(time.value)}
                  className="text-xs"
                >
                  {time.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Time Selection */}
          <div>
            <h4 className="text-sm font-medium mb-3">Custom Time</h4>
            <div className="flex items-center justify-center space-x-2">
              {/* Hours */}
              <select
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-16 p-2 border rounded-md text-center text-lg font-mono"
              >
                {hourOptions.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>

              <span className="text-2xl font-bold">:</span>

              {/* Minutes */}
              <select
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="w-16 p-2 border rounded-md text-center text-lg font-mono"
              >
                {minuteOptions.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                ))}
              </select>

              {/* AM/PM */}
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-16 p-2 border rounded-md text-center text-lg font-semibold"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          {/* Preview */}
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Selected Time</p>
            <p className="text-lg font-semibold">
              {hours}:{minutes} {period}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm Time</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

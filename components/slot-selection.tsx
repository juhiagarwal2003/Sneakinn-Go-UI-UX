"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format, addDays } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import { usePickup } from "@/context/pickup-context"

type TimeSlot = {
  id: string
  time: string
  available: boolean
}

type DaySlots = {
  date: Date
  slots: TimeSlot[]
}

export default function SlotSelection() {
  const router = useRouter()
  const { updatePickupSlot } = usePickup()

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [availableDays, setAvailableDays] = useState<DaySlots[]>([])

  useEffect(() => {
    // Generate 3 days starting from tomorrow
    const days: DaySlots[] = []
    const today = new Date()

    for (let i = 1; i <= 3; i++) {
      const date = addDays(today, i)
      days.push({
        date,
        slots: [
          { id: `${format(date, "yyyy-MM-dd")}-1`, time: "10 AM – 12 PM", available: true },
          { id: `${format(date, "yyyy-MM-dd")}-2`, time: "12 PM – 4 PM", available: true },
          { id: `${format(date, "yyyy-MM-dd")}-3`, time: "4 PM – 8 PM", available: Math.random() > 0.3 }, // Randomly make some unavailable
        ],
      })
    }

    setAvailableDays(days)
    setSelectedDate(days[0].date) // Select first day by default
  }, [])

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    // Clear selected slot when changing date
    setSelectedSlot(null)
    setSelectedTime(null)
  }

  const handleSlotSelect = (slotId: string, time: string) => {
    setSelectedSlot(slotId)
    setSelectedTime(time)
  }

  const handleContinue = () => {
    if (!selectedSlot || !selectedDate || !selectedTime) return

    // Save selected slot to context
    updatePickupSlot({
      date: format(selectedDate, "EEEE, MMMM d"),
      time: selectedTime,
    })

    // Navigate to review page
    router.push("/review")
  }

  return (
    <div className="space-y-6">
      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 gap-2 snap-x">
        {availableDays.map((day) => (
          <button
            key={format(day.date, "yyyy-MM-dd")}
            onClick={() => handleDateSelect(day.date)}
            className={`snap-start flex-shrink-0 px-5 py-3 rounded-lg transition-colors ${
              selectedDate && format(selectedDate, "yyyy-MM-dd") === format(day.date, "yyyy-MM-dd")
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            <div className="text-center">
              <div className="font-medium">{format(day.date, "EEE")}</div>
              <div className="text-xl font-bold">{format(day.date, "d")}</div>
              <div className="text-xs">{format(day.date, "MMM")}</div>
            </div>
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium mb-4">
            Available Slots for {selectedDate ? format(selectedDate, "EEEE, MMMM d") : ""}
          </h3>
          <div className="space-y-3">
            {selectedDate &&
              availableDays
                .find((day) => format(day.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd"))
                ?.slots.map((slot) => (
                  <button
                    key={slot.id}
                    disabled={!slot.available}
                    onClick={() => handleSlotSelect(slot.id, slot.time)}
                    className={`w-full text-left p-4 rounded-lg transition-all ${
                      !slot.available
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : selectedSlot === slot.id
                          ? "border-2 border-primary bg-primary/5"
                          : "border border-gray-200 hover:border-primary/50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{slot.time}</span>
                      {selectedSlot === slot.id && <ChevronRight className="h-5 w-5 text-primary" />}
                    </div>
                  </button>
                ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleContinue} disabled={!selectedSlot} className="w-full">
        Continue
      </Button>
    </div>
  )
}

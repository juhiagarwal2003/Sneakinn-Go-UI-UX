"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, CheckCircle } from "lucide-react"
import { usePickup } from "@/context/pickup-context"

export default function ReviewConfirm() {
  const router = useRouter()
  const { sneakerDetails, pickupSlot, coupon, discount, updateCoupon, resetState } = usePickup()

  const [isApplying, setIsApplying] = useState(false)
  const [couponInput, setCouponInput] = useState(coupon)
  const [errorMessage, setErrorMessage] = useState("")

  // Check if we have all required data
  const hasRequiredData =
    sneakerDetails.sneakerType &&
    sneakerDetails.condition &&
    sneakerDetails.issue &&
    pickupSlot?.date &&
    pickupSlot?.time

  // Redirect if missing data
  if (typeof window !== "undefined" && !hasRequiredData) {
    router.push("/")
    return null
  }

  const handleApplyCoupon = () => {
    if (!couponInput) return

    setIsApplying(true)
    setErrorMessage("")

    // Simulate API call
    setTimeout(() => {
      // Mock coupon validation
      if (couponInput.toUpperCase() === "CLEAN10") {
        updateCoupon(couponInput, 10)
      } else {
        setErrorMessage("Invalid coupon code")
      }
      setIsApplying(false)
    }, 1000)
  }

  const handleConfirm = () => {
    // In a real app, you would submit the order here
    console.log("Confirming pickup with details:", {
      sneakerDetails,
      pickupSlot,
      coupon,
      discount,
    })

    // Reset state after successful submission
    resetState()

    // Show success message or redirect
    alert("Pickup confirmed! We'll see you soon.")
    router.push("/")
  }

  // Calculate price
  const basePrice = 25
  const discountAmount = discount ? (basePrice * discount) / 100 : 0
  const totalPrice = basePrice - discountAmount

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Sneaker Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-medium">{sneakerDetails.sneakerType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Condition</p>
              <p className="font-medium">{sneakerDetails.condition}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Issue</p>
            <p className="font-medium">{sneakerDetails.issue}</p>
          </div>

          {sneakerDetails.notes && (
            <div>
              <p className="text-sm text-gray-500">Notes</p>
              <p className="font-medium">{sneakerDetails.notes}</p>
            </div>
          )}

          {sneakerDetails.images.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Uploaded Images</p>
              <div className="grid grid-cols-3 gap-2">
                {sneakerDetails.images.map((image, index) => (
                  <div key={index} className="relative rounded-md overflow-hidden h-20">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Sneaker image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {pickupSlot && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Pickup Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span className="font-medium">{pickupSlot.date}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-500" />
              <span className="font-medium">{pickupSlot.time}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Discount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Enter coupon code"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
              />
              {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
            </div>
            <Button variant="outline" onClick={handleApplyCoupon} disabled={!couponInput || isApplying}>
              {isApplying ? "Applying..." : "Apply"}
            </Button>
          </div>

          {discount && (
            <div className="mt-3 flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">{discount}% discount applied!</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500">Service Fee</span>
            <span className="font-medium">${basePrice.toFixed(2)}</span>
          </div>

          {discount && (
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500">Discount</span>
              <span className="font-medium text-green-600">-${discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleConfirm} className="w-full">
        Confirm Pickup
      </Button>
    </div>
  )
}

"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type SneakerDetails = {
  sneakerType: string
  condition: string
  issue: string
  notes: string
  images: string[]
}

type PickupSlot = {
  date: string
  time: string
}

type PickupContextType = {
  sneakerDetails: SneakerDetails
  pickupSlot: PickupSlot | null
  coupon: string
  discount: number | null
  updateSneakerDetails: (details: SneakerDetails) => void
  updatePickupSlot: (slot: PickupSlot) => void
  updateCoupon: (code: string, discountAmount: number | null) => void
  resetState: () => void
}

const defaultSneakerDetails: SneakerDetails = {
  sneakerType: "",
  condition: "",
  issue: "",
  notes: "",
  images: [],
}

const PickupContext = createContext<PickupContextType | undefined>(undefined)

export function PickupProvider({ children }: { children: ReactNode }) {
  const [sneakerDetails, setSneakerDetails] = useState<SneakerDetails>(() => {
    // Try to load from localStorage on client side
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sneakerDetails")
      return saved ? JSON.parse(saved) : defaultSneakerDetails
    }
    return defaultSneakerDetails
  })

  const [pickupSlot, setPickupSlot] = useState<PickupSlot | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pickupSlot")
      return saved ? JSON.parse(saved) : null
    }
    return null
  })

  const [coupon, setCoupon] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("coupon") || ""
    }
    return ""
  })

  const [discount, setDiscount] = useState<number | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("discount")
      return saved ? Number(saved) : null
    }
    return null
  })

  const updateSneakerDetails = (details: SneakerDetails) => {
    setSneakerDetails(details)
    localStorage.setItem("sneakerDetails", JSON.stringify(details))
  }

  const updatePickupSlot = (slot: PickupSlot) => {
    setPickupSlot(slot)
    localStorage.setItem("pickupSlot", JSON.stringify(slot))
  }

  const updateCoupon = (code: string, discountAmount: number | null) => {
    setCoupon(code)
    setDiscount(discountAmount)
    localStorage.setItem("coupon", code)
    if (discountAmount !== null) {
      localStorage.setItem("discount", discountAmount.toString())
    } else {
      localStorage.removeItem("discount")
    }
  }

  const resetState = () => {
    setSneakerDetails(defaultSneakerDetails)
    setPickupSlot(null)
    setCoupon("")
    setDiscount(null)
    localStorage.removeItem("sneakerDetails")
    localStorage.removeItem("pickupSlot")
    localStorage.removeItem("coupon")
    localStorage.removeItem("discount")
  }

  return (
    <PickupContext.Provider
      value={{
        sneakerDetails,
        pickupSlot,
        coupon,
        discount,
        updateSneakerDetails,
        updatePickupSlot,
        updateCoupon,
        resetState,
      }}
    >
      {children}
    </PickupContext.Provider>
  )
}

export function usePickup() {
  const context = useContext(PickupContext)
  if (context === undefined) {
    throw new Error("usePickup must be used within a PickupProvider")
  }
  return context
}

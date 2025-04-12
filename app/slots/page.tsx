import SlotSelection from "@/components/slot-selection"

export default function SlotsPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Select Pickup Time</h1>
        <p className="text-gray-500 mb-6">Choose when you'd like us to pick up your sneakers</p>
        <SlotSelection />
      </div>
    </main>
  )
}

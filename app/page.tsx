import PickupDetailsForm from "@/components/pickup-details-form"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Sneaker Pickup Details</h1>
        <p className="text-gray-500 mb-6">Tell us about your sneakers so we can clean them properly</p>
        <PickupDetailsForm />
      </div>
    </main>
  )
}

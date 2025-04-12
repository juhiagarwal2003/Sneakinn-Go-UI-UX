import ReviewConfirm from "@/components/review-confirm"

export default function ReviewPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Review & Confirm</h1>
        <p className="text-gray-500 mb-6">Please review your pickup details before confirming</p>
        <ReviewConfirm />
      </div>
    </main>
  )
}

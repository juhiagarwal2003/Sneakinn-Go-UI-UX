"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, Upload, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { usePickup } from "@/context/pickup-context"

const sneakerTypes = [
  "Athletic/Running",
  "Basketball",
  "Casual/Lifestyle",
  "Skateboarding",
  "Designer/Luxury",
  "Canvas",
  "Leather",
  "Suede",
  "Other",
]

const conditionOptions = ["Like New", "Lightly Worn", "Moderately Worn", "Heavily Worn", "Vintage/Aged"]

export default function PickupDetailsForm() {
  const router = useRouter()
  const { sneakerDetails, updateSneakerDetails } = usePickup()

  const [sneakerType, setSneakerType] = useState(sneakerDetails.sneakerType)
  const [condition, setCondition] = useState(sneakerDetails.condition)
  const [issue, setIssue] = useState(sneakerDetails.issue)
  const [notes, setNotes] = useState(sneakerDetails.notes)
  const [images, setImages] = useState<string[]>(sneakerDetails.images)
  const [isDragging, setIsDragging] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    addNewImages(files)
  }

  const addNewImages = (files: FileList) => {
    if (images.length >= 3) return

    const newImages: string[] = []

    Array.from(files)
      .slice(0, 3 - images.length)
      .forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            newImages.push(e.target.result as string)
            if (newImages.length === Math.min(files.length, 3 - images.length)) {
              setImages([...images, ...newImages])
            }
          }
        }
        reader.readAsDataURL(file)
      })
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files) {
      addNewImages(e.dataTransfer.files)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Save details to context
    updateSneakerDetails({
      sneakerType,
      condition,
      issue,
      notes,
      images,
    })

    // Navigate to slot selection
    router.push("/slots")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sneakerType">Sneaker Type</Label>
              <Select value={sneakerType} onValueChange={setSneakerType} required>
                <SelectTrigger id="sneakerType">
                  <SelectValue placeholder="Select sneaker type" />
                </SelectTrigger>
                <SelectContent>
                  {sneakerTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select value={condition} onValueChange={setCondition} required>
                <SelectTrigger id="condition">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {conditionOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="issue">What needs cleaning?</Label>
              <Textarea
                id="issue"
                placeholder="Describe the issues (stains, scuffs, etc.)"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                required
                className="min-h-[100px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Label className="block mb-2">Upload Photos (up to 3)</Label>

          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center mb-4 transition-colors ${
              isDragging ? "border-primary bg-primary/5" : "border-gray-200"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center py-4">
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-1">Drag & drop images here</p>
              <p className="text-xs text-gray-400 mb-3">or click to browse files</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("image-upload")?.click()}
                disabled={images.length >= 3}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Select Images
              </Button>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
                disabled={images.length >= 3}
              />
            </div>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative rounded-md overflow-hidden h-24">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Sneaker image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-black/70 rounded-full p-1"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes for Cleaner (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special instructions or details"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full">
        Continue
      </Button>
    </form>
  )
}

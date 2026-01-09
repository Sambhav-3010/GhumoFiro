"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, MapPin, Calendar, IndianRupee, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export default function TripSetupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    budget: "",
    startDate: "",
    endDate: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const calculateDuration = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays
    }
    return 0
  }

  const handleSubmit = () => {
    if (formData.destination && formData.budget && formData.startDate && formData.endDate) {
      const tripDetails = {
        ...formData,
        duration: calculateDuration(),
        totalSpent: 0,
      }

      localStorage.setItem("trip-details", JSON.stringify(tripDetails))
      localStorage.setItem("trip-progress", JSON.stringify([]))
      localStorage.setItem(
        "trip-selections",
        JSON.stringify({
          travel: [],
          hotels: [],
          activities: [],
          dining: [],
        }),
      )

      router.push("/manual-itinerary-builder")
    }
  }

  const isFormValid = formData.destination && formData.budget && formData.startDate && formData.endDate

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-red-600 to-orange-500">
      <div className="bg-black p-3 md:p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-white hover:bg-gray-100 text-black font-bold border-2 border-white text-xs md:text-sm px-2 md:px-4"
            >
              <ArrowLeft className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">BACK</span>
            </Button>
            <div className="text-white text-base md:text-2xl font-bold">TRIP SETUP</div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-4 border-black p-4 md:p-8"
        >
          <div className="text-center mb-6 md:mb-8">
            <MapPin className="w-12 h-12 md:w-16 md:h-16 text-red-500 mx-auto mb-3 md:mb-4" />
            <h1 className="text-2xl md:text-4xl font-black text-black mb-3 md:mb-4 uppercase">Plan Your Trip</h1>
            <p className="text-black font-medium text-sm md:text-lg">
              Let's start with the basics - where are you going and what's your budget?
            </p>
          </div>

          <div className="space-y-4 md:space-y-6">
            <div>
              <Label className="text-black font-bold text-sm md:text-lg uppercase mb-2 block">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 inline mr-2" />
                Departure
              </Label>
              <Input
                placeholder="Where are you traveling from?"
                value={formData.source}
                onChange={(e) => handleInputChange("source", e.target.value)}
                className="border-2 border-black text-black font-medium h-10 md:h-12 text-sm md:text-lg"
              />
            </div>

            <div>
              <Label className="text-black font-bold text-sm md:text-lg uppercase mb-2 block">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 inline mr-2" />
                Destination
              </Label>
              <Input
                placeholder="Where are you traveling to?"
                value={formData.destination}
                onChange={(e) => handleInputChange("destination", e.target.value)}
                className="border-2 border-black text-black font-medium h-10 md:h-12 text-sm md:text-lg"
              />
            </div>

            <div>
              <Label className="text-black font-bold text-sm md:text-lg uppercase mb-2 block">
                <IndianRupee className="w-4 h-4 md:w-5 md:h-5 inline mr-2" />
                Total Budget (INR)
              </Label>
              <Input
                type="number"
                placeholder="Enter your total budget"
                value={formData.budget}
                onChange={(e) => handleInputChange("budget", e.target.value)}
                className="border-2 border-black text-black font-medium h-10 md:h-12 text-sm md:text-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-black font-bold text-sm md:text-lg uppercase mb-2 block">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5 inline mr-2" />
                  Start Date
                </Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                  className="border-2 border-black text-black font-medium h-10 md:h-12"
                />
              </div>
              <div>
                <Label className="text-black font-bold text-sm md:text-lg uppercase mb-2 block">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5 inline mr-2" />
                  End Date
                </Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  className="border-2 border-black text-black font-medium h-10 md:h-12"
                />
              </div>
            </div>

            {calculateDuration() > 0 && (
              <div className="bg-yellow-400 border-2 border-black p-3 md:p-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 text-black" />
                  <span className="text-black font-bold text-sm md:text-lg uppercase">
                    Trip Duration: {calculateDuration()} Days
                  </span>
                </div>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold text-lg md:text-xl h-12 md:h-14 border-2 border-black uppercase"
            >
              Start Planning Trip →
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MapPin, Calendar, IndianRupee, Clock, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter, useSearchParams } from "next/navigation"
import { CityAutocomplete, PageHeader } from "@/components/itinerary"
import { getAllCities, CityOption } from "@/lib/cityUtils"
import { calculateDuration } from "@/lib/formatUtils"

export default function TripSetupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isFromRecommendation, setIsFromRecommendation] = useState(false)
  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    budget: "",
    startDate: "",
    endDate: "",
  })
  const [sourceSearch, setSourceSearch] = useState("")
  const [destSearch, setDestSearch] = useState("")
  const [showSourceDropdown, setShowSourceDropdown] = useState(false)
  const [showDestDropdown, setShowDestDropdown] = useState(false)
  const [allCities] = useState<CityOption[]>(getAllCities)

  const today = new Date().toISOString().split("T")[0]

  useEffect(() => {
    const destination = searchParams.get('destination')
    if (destination) {
      setFormData(prev => ({ ...prev, destination: destination }))
      setDestSearch(destination)
      setIsFromRecommendation(true)
    }
  }, [searchParams])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSelectSource = (city: CityOption) => {
    setFormData(prev => ({ ...prev, source: city.name }))
    setSourceSearch(`${city.name} (${city.code})`)
    setShowSourceDropdown(false)
  }

  const handleSelectDest = (city: CityOption) => {
    setFormData(prev => ({ ...prev, destination: city.name }))
    setDestSearch(`${city.name} (${city.code})`)
    setShowDestDropdown(false)
    setIsFromRecommendation(false)
  }

  const duration = calculateDuration(formData.startDate, formData.endDate)

  const handleSubmit = () => {
    if (formData.destination && formData.budget && formData.startDate && formData.endDate) {
      const tripDetails = {
        ...formData,
        duration,
        totalSpent: 0,
      }

      localStorage.setItem("trip-details", JSON.stringify(tripDetails))
      localStorage.setItem("trip-progress", JSON.stringify([]))
      localStorage.setItem("trip-selections", JSON.stringify({
        travel: [],
        hotels: [],
        activities: [],
        dining: [],
      }))

      router.push("/manual-itinerary-builder")
    }
  }

  const isFormValid = formData.destination && formData.budget && formData.startDate && formData.endDate

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-red-600 to-orange-500">
      <PageHeader title="TRIP SETUP" backPath="/dashboard" />

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
            <div className="relative">
              <Label className="text-black font-bold text-sm md:text-lg uppercase mb-2 block">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 inline mr-2" />
                Departure City
              </Label>
              <CityAutocomplete
                value={sourceSearch}
                onChange={(val) => {
                  setSourceSearch(val)
                  handleInputChange("source", val)
                }}
                onSelect={handleSelectSource}
                cities={allCities}
                placeholder="Search city (e.g., Delhi, Mumbai)"
                showDropdown={showSourceDropdown}
                setShowDropdown={setShowSourceDropdown}
              />
            </div>

            <div className="relative">
              <Label className="text-black font-bold text-sm md:text-lg uppercase mb-2 block">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 inline mr-2" />
                Destination City
                {isFromRecommendation && (
                  <span className="ml-2 inline-flex items-center gap-1 bg-purple-500 text-white text-xs px-2 py-0.5 normal-case font-medium">
                    <Sparkles className="w-3 h-3" />
                    From Recommendation
                  </span>
                )}
              </Label>
              <CityAutocomplete
                value={destSearch}
                onChange={(val) => {
                  setDestSearch(val)
                  handleInputChange("destination", val)
                }}
                onSelect={handleSelectDest}
                cities={allCities}
                placeholder="Search city (e.g., Goa, Jaipur)"
                showDropdown={showDestDropdown}
                setShowDropdown={setShowDestDropdown}
                className={isFromRecommendation ? 'border-purple-500 bg-purple-50' : ''}
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
                  min={today}
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
                  min={formData.startDate || today}
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  className="border-2 border-black text-black font-medium h-10 md:h-12"
                />
              </div>
            </div>

            {duration > 0 && (
              <div className="bg-yellow-400 border-2 border-black p-3 md:p-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 text-black" />
                  <span className="text-black font-bold text-sm md:text-lg uppercase">
                    Trip Duration: {duration} Days
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

      {(showSourceDropdown || showDestDropdown) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setShowSourceDropdown(false)
            setShowDestDropdown(false)
          }}
        />
      )}
    </div>
  )
}

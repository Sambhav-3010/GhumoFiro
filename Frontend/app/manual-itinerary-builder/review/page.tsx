"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit,
  Plane,
  Hotel,
  Camera,
  MapPin,
  Calendar,
  Star,
  Clock,
  Check,
  Train,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAlert } from "../../context/AlertContext";

interface ItemBase {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  location?: string;
  address?: string;
  amenities?: string[];
  price: number | string;
  rating?: string | number;
  duration?: string;
  thumbnail?: string | null;
  type?: string;
}

interface TripDetails {
  destination: string;
  budget: string;
  startDate: string;
  endDate: string;
  duration: number;
  totalSpent: number;
}

interface TripSelections {
  travel: ItemBase[];
  hotels: ItemBase[];
  activities: ItemBase[];
}

const parsePrice = (price: any): number => {
  if (!price) return 0;
  if (typeof price === "number") return price;
  const cleaned = String(price).replace(/[₹,\s]/g, "").split("-")[0];
  const parsed = Number(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

const formatPrice = (price: any): string => {
  const num = parsePrice(price);
  if (num === 0) return "Free";
  return `₹${num.toLocaleString()}`;
};

export default function ReviewPage() {
  const router = useRouter();
  const [tripDetails, setTripDetails] = useState<TripDetails | null>(null);
  const [selections, setSelections] = useState<TripSelections>({
    travel: [],
    hotels: [],
    activities: [],
  });
  const [saving, setSaving] = useState(false);
  const { showAlert } = useAlert();

  useEffect(() => {
    const savedDetails = localStorage.getItem("trip-details");
    const travelSelections = localStorage.getItem("travel-selections");
    const hotelSelections = localStorage.getItem("hotel-selections");
    const activitySelections = localStorage.getItem("activity-selections");

    if (savedDetails) {
      const parsed = JSON.parse(savedDetails);
      setTripDetails({
        ...parsed,
        duration: Number(parsed.duration) || 1,
        budget: parsed.budget || "0",
      });
    }

    setSelections({
      travel: travelSelections ? JSON.parse(travelSelections) : [],
      hotels: hotelSelections ? JSON.parse(hotelSelections) : [],
      activities: activitySelections ? JSON.parse(activitySelections) : [],
    });
  }, []);

  const calculateTotal = () =>
    Object.values(selections).reduce(
      (sum: number, category: ItemBase[]) =>
        sum + category.reduce((catSum: number, item: ItemBase) => catSum + parsePrice(item.price), 0),
      0
    );

  const handleEditSection = (section: string) => {
    router.push(`/manual-itinerary-builder/${section}`);
  };

  const handleConfirmTrip = async () => {
    if (!tripDetails) return;
    setSaving(true);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const payload = {
      user_id: user._id,
      place_of_visit: tripDetails.destination,
      duration_of_visit: tripDetails.duration,
      start_date: tripDetails.startDate,
      end_date: tripDetails.endDate,
      overall_budget: parsePrice(tripDetails.budget),
      total_spent: calculateTotal(),
      travel: selections.travel,
      hotels: selections.hotels,
      activities: selections.activities,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/newtrip`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to save trip");
      const data = await res.json();
      showAlert("Trip created successfully!", "success");
      localStorage.removeItem("trip-details");
      localStorage.removeItem("travel-selections");
      localStorage.removeItem("hotel-selections");
      localStorage.removeItem("activity-selections");
      localStorage.removeItem("trip-progress");
      router.push(`/trips/${data.trip._id}`);
    } catch (err) {
      if (err instanceof Error) {
        showAlert(err.message, "destructive");
      } else {
        showAlert("An unknown error occurred.", "destructive");
      }
    } finally {
      setSaving(false);
    }
  };

  if (!tripDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 via-red-600 to-orange-500 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin" />
          <span className="text-lg md:text-xl font-bold">Loading trip details...</span>
        </div>
      </div>
    );
  }

  const total = calculateTotal();
  const budget = parsePrice(tripDetails.budget);
  const isOverBudget = total > budget;
  const remaining = budget - total;

  const sections = [
    {
      id: "travel",
      title: "Travel",
      icon: Plane,
      color: "bg-blue-500",
      items: selections.travel,
    },
    {
      id: "hotels",
      title: "Hotels",
      icon: Hotel,
      color: "bg-green-500",
      items: selections.hotels,
    },
    {
      id: "activities",
      title: "Activities",
      icon: Camera,
      color: "bg-purple-500",
      items: selections.activities,
    },
  ];

  const getTitle = (item: any) => item.title || item.name || "Unnamed Item";

  const getItemIcon = (item: any, sectionId: string) => {
    if (sectionId === "travel") {
      if (item.type === "train") return Train;
      return Plane;
    }
    if (sectionId === "hotels") return Hotel;
    return Camera;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-red-600 to-orange-500">
      <div className="bg-black p-3 md:p-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              onClick={() => router.push("/manual-itinerary-builder")}
              className="bg-white hover:bg-gray-100 text-black font-bold border-2 border-white text-xs md:text-sm px-2 md:px-4"
            >
              <ArrowLeft className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">BACK</span>
            </Button>
            <div className="text-white text-base md:text-2xl font-bold">TRIP REVIEW</div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-3 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-4 border-black p-4 md:p-6 mb-4 md:mb-8"
        >
          <h1 className="text-xl md:text-3xl font-black text-black mb-4 md:mb-6 uppercase text-center">
            Your Complete Itinerary
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-red-500 flex-shrink-0" />
                <span className="text-black font-bold text-sm md:text-base truncate">
                  Destination: {tripDetails.destination}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 md:w-5 md:h-5 text-red-500 flex-shrink-0" />
                <span className="text-black font-bold text-xs md:text-base">
                  {tripDetails.startDate} - {tripDetails.endDate} ({tripDetails.duration} days)
                </span>
              </div>
            </div>
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-black font-bold text-sm md:text-base">
                  Budget: ₹{budget.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-bold text-sm md:text-base ${isOverBudget ? "text-red-500" : "text-green-600"}`}>
                  Total Cost: ₹{total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {isOverBudget && (
            <div className="mt-4 bg-red-100 border-2 border-red-500 p-3 md:p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-red-600 flex-shrink-0" />
              <p className="text-red-700 font-bold text-xs md:text-sm">
                Your selections exceed your budget by ₹{Math.abs(remaining).toLocaleString()}
              </p>
            </div>
          )}

          {!isOverBudget && remaining > 0 && (
            <div className="mt-4 bg-green-100 border-2 border-green-500 p-3 md:p-4 flex items-center gap-3">
              <Check className="w-5 h-5 md:w-6 md:h-6 text-green-600 flex-shrink-0" />
              <p className="text-green-700 font-bold text-xs md:text-sm">
                You have ₹{remaining.toLocaleString()} remaining in your budget
              </p>
            </div>
          )}
        </motion.div>

        {sections.map((section, index) => {
          const Icon = section.icon;
          const sectionTotal = section.items.reduce(
            (sum: number, item: ItemBase) => sum + parsePrice(item.price),
            0
          );

          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border-4 border-black mb-4 md:mb-6 overflow-hidden"
            >
              <div className={`${section.color} p-3 md:p-4 border-b-4 border-black`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 md:gap-3">
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    <h3 className="text-base md:text-xl font-black text-white uppercase">
                      {section.title}
                    </h3>
                    <span className="text-white font-bold text-xs md:text-sm">
                      (₹{sectionTotal.toLocaleString()})
                    </span>
                  </div>
                  <Button
                    onClick={() => handleEditSection(section.id)}
                    className="bg-white hover:bg-gray-100 text-black font-bold border-2 border-white text-xs md:text-sm"
                  >
                    <Edit className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    EDIT
                  </Button>
                </div>
              </div>

              <div className="p-4 md:p-6">
                {section.items.length === 0 ? (
                  <p className="text-gray-500 text-center py-4 font-bold text-sm md:text-base">
                    No selections made
                  </p>
                ) : (
                  <div className="space-y-3 md:space-y-4">
                    {section.items.map((item, idx) => {
                      const ItemIcon = getItemIcon(item, section.id);
                      return (
                        <div
                          key={idx}
                          className="bg-gray-50 border-2 border-black p-3 md:p-4 flex items-center gap-3 md:gap-4"
                        >
                          <div className={`w-8 h-8 md:w-10 md:h-10 ${section.color} border-2 border-black flex items-center justify-center flex-shrink-0`}>
                            <ItemIcon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                          </div>

                          {item.thumbnail && (
                            <img
                              src={item.thumbnail}
                              alt={getTitle(item)}
                              className="w-12 h-12 md:w-16 md:h-16 object-cover border-2 border-black flex-shrink-0"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          )}

                          <div className="flex-1 min-w-0">
                            <h4 className="font-black uppercase text-black text-xs md:text-sm truncate">
                              {getTitle(item)}
                            </h4>
                            {(item.location || item.address) && (
                              <p className="text-[10px] md:text-xs text-gray-600 font-bold flex items-center gap-1 truncate">
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                {item.location || item.address}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-1 md:gap-2 mt-1 md:mt-2">
                              {item.rating && Number(item.rating) > 0 && (
                                <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-1.5 py-0.5 md:px-2 md:py-1 text-[10px] md:text-xs font-bold">
                                  <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" />
                                  {Number(item.rating).toFixed(1)}
                                </span>
                              )}
                              {item.duration && (
                                <span className="flex items-center gap-1 bg-gray-100 text-gray-700 px-1.5 py-0.5 md:px-2 md:py-1 text-[10px] md:text-xs font-bold">
                                  <Clock className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                  {item.duration}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="bg-yellow-400 border-2 border-black px-2 py-1 md:px-4 md:py-2 flex-shrink-0">
                            <span className="font-black text-black text-xs md:text-sm">{formatPrice(item.price)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white border-4 border-black p-4 md:p-6"
        >
          <div className="text-center space-y-4 md:space-y-6">
            <div className="text-lg md:text-2xl font-black">
              TOTAL TRIP COST:{" "}
              <span className={isOverBudget ? "text-red-500" : "text-green-600"}>
                ₹{total.toLocaleString()}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Button
                onClick={() => router.push("/manual-itinerary-builder")}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-4 md:px-8 py-2 md:py-3 border-2 border-black text-sm md:text-base"
              >
                MAKE CHANGES
              </Button>

              {isOverBudget ? (
                <Button
                  onClick={() => {
                    const newDetails = { ...tripDetails, budget: total.toString() };
                    setTripDetails(newDetails);
                    localStorage.setItem("trip-details", JSON.stringify(newDetails));
                    showAlert("Budget updated to match total cost!", "success");
                  }}
                  disabled={saving}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 md:px-8 py-2 md:py-3 border-2 border-black text-sm md:text-base"
                >
                  SAVE & UPDATE BUDGET
                </Button>
              ) : (
                <Button
                  onClick={handleConfirmTrip}
                  disabled={saving}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold px-4 md:px-8 py-2 md:py-3 border-2 border-black text-sm md:text-base"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      SAVING...
                    </>
                  ) : (
                    "CONFIRM TRIP"
                  )}
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

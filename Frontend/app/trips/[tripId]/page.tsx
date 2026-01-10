"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Car,
  Hotel,
  Compass,
  Plane,
  MapPin,
  Calendar,
  Clock,
  Zap,
  IndianRupeeIcon,
  Train,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface TravelDetail {
  arrival: string;
  departure: string;
  description: string;
  price: string;
  duration: string;
  type?: string;
}

interface HotelDetail {
  title: string;
  thumbnail: string;
  rating: number;
  price: number;
  location: string;
  description: string;
  amenities: string[];
}

interface ActivityDetail {
  title: string;
  time: string;
  description: string;
  address: string;
  reviews: number;
  rating: number;
}

interface Trip {
  _id: string;
  place_of_visit: string;
  start_date: string;
  end_date: string;
  duration_of_visit: number;
  overall_budget: number;
  total_spent: number;
  travel: TravelDetail[];
  hotels: HotelDetail[];
  activities: ActivityDetail[];
}

export default function TripDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const tripId = params.tripId;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/trip/${tripId}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch trip details");
        }

        const data = await res.json();
        setTrip(data.trip);
      } catch (err: any) {
        console.error("Error fetching trip details:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [tripId, router]);

  const budgetUsed = trip ? (trip.total_spent / trip.overall_budget) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 via-red-600 to-orange-500 flex items-center justify-center">
        <p className="text-white text-xl md:text-2xl font-bold">LOADING TRIP DETAILS...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 via-red-600 to-orange-500 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border-4 border-black p-6 md:p-8 max-w-md text-center"
        >
          <h2 className="text-2xl md:text-3xl font-black text-black mb-4 uppercase">
            ERROR!
          </h2>
          <p className="text-black font-medium text-base md:text-lg mb-6">{error}</p>
          <Button
            onClick={() => router.push("/profile")}
            className="bg-red-500 hover:bg-red-600 text-white font-bold border-2 border-black"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            GO BACK
          </Button>
        </motion.div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 via-red-600 to-orange-500 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border-4 border-black p-6 md:p-8 max-w-md text-center"
        >
          <MapPin className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-black" />
          <h2 className="text-2xl md:text-3xl font-black text-black mb-4 uppercase">
            TRIP NOT FOUND!
          </h2>
          <p className="text-black font-medium text-base md:text-lg mb-6">
            The adventure you're looking for doesn't exist.
          </p>
          <Button
            onClick={() => router.push("/profile")}
            className="bg-red-500 hover:bg-red-600 text-white font-bold border-2 border-black"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            GO BACK
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-red-600 to-orange-500">
      <div className="bg-black p-3 md:p-4 mb-4 md:mb-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <Button
            onClick={() => router.push("/profile")}
            className="bg-white hover:bg-gray-100 text-black font-bold border-2 border-white text-xs md:text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1 md:mr-2" />
            BACK TO PROFILE
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="text-white text-lg md:text-2xl lg:text-3xl font-black uppercase tracking-wide">
              {trip.place_of_visit} ITINERARY
            </h1>
            <Zap className="w-5 h-5 md:w-8 md:h-8 text-yellow-400" />
          </div>
          <div className="hidden sm:block"></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-4 border-black p-4 md:p-6 mb-4 md:mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <Calendar className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-black" />
              <p className="text-black font-black text-xl md:text-2xl">
                {trip.duration_of_visit}
              </p>
              <p className="text-black font-bold uppercase text-xs md:text-sm">DAYS</p>
              <p className="text-black text-[10px] md:text-xs mt-1">
                {new Date(trip.start_date).toLocaleDateString("en-GB")} -{" "}
                {new Date(trip.end_date).toLocaleDateString("en-GB")}
              </p>
            </div>
            <div>
              <IndianRupeeIcon className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-black" />
              <p className="text-black font-black text-xl md:text-2xl">
                ₹{trip.overall_budget.toLocaleString()}
              </p>
              <p className="text-black font-bold uppercase text-xs md:text-sm">BUDGET</p>
              <p className="text-black text-[10px] md:text-xs mt-1">
                Spent: ₹{trip.total_spent.toLocaleString()}
              </p>
            </div>
            <div>
              <Compass className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-black" />
              <p className="text-black font-black text-xl md:text-2xl">
                {trip.activities?.length || 0}
              </p>
              <p className="text-black font-bold uppercase text-xs md:text-sm">
                ACTIVITIES
              </p>
              <p className="text-black text-[10px] md:text-xs mt-1">Planned</p>
            </div>
            <div>
              <Hotel className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-black" />
              <p className="text-black font-black text-xl md:text-2xl">
                {trip.hotels?.length || 0}
              </p>
              <p className="text-black font-bold uppercase text-xs md:text-sm">HOTELS</p>
              <p className="text-black text-[10px] md:text-xs mt-1">Booked</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-yellow-400 border-4 border-black p-3 md:p-4 mb-4 md:mb-8"
        >
          <div className="flex justify-between items-center mb-2">
            <p className="text-black font-black text-sm md:text-lg uppercase">
              BUDGET USAGE
            </p>
            <p className="text-black font-black text-sm md:text-lg">
              {budgetUsed.toFixed(1)}%
            </p>
          </div>
          <div className="w-full bg-white border-2 border-black h-4 md:h-6">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(budgetUsed, 100)}%` }}
              transition={{ delay: 0.5, duration: 1 }}
              className={`h-full ${budgetUsed > 100
                  ? "bg-red-500"
                  : budgetUsed > 80
                    ? "bg-orange-500"
                    : "bg-red-500"
                } border-r-2 border-black`}
            />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-4 md:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white border-4 border-black"
          >
            <div className="bg-black p-3 md:p-4">
              <h3 className="text-white font-black text-lg md:text-xl uppercase flex items-center gap-2">
                <Plane className="w-5 h-5 md:w-6 md:h-6" />
                TRAVEL
              </h3>
            </div>
            <div className="p-4 md:p-6">
              {trip.travel?.length ? (
                <div className="space-y-4">
                  {trip.travel.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="border-2 border-black p-3 md:p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {item.type === "train" ? (
                          <Train className="w-5 h-5 text-green-600" />
                        ) : (
                          <Plane className="w-5 h-5 text-blue-500" />
                        )}
                        <span className="font-bold text-black uppercase text-sm">
                          {item.type === "train" ? "Train" : "Flight"}
                        </span>
                      </div>
                      <div className="font-medium text-black uppercase text-sm mb-1">
                        <strong>Departure:</strong> {item.departure}
                      </div>
                      <div className="font-medium text-black uppercase text-sm mb-1">
                        <strong>Arrival:</strong> {item.arrival}
                      </div>
                      <div className="text-black font-medium text-sm mb-2">
                        <strong>Details:</strong> {item.description}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="flex items-center gap-1 bg-yellow-400 px-2 py-1 border border-black font-bold">
                          <IndianRupeeIcon className="w-3 h-3" />
                          {item.price}
                        </span>
                        <span className="flex items-center gap-1 bg-gray-200 px-2 py-1 font-bold">
                          <Clock className="w-3 h-3" />
                          {item.duration}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Car className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-black font-bold uppercase text-sm md:text-base">
                    NO TRAVEL PLANNED
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border-4 border-black"
          >
            <div className="bg-black p-3 md:p-4">
              <h3 className="text-white font-black text-lg md:text-xl uppercase flex items-center gap-2">
                <Hotel className="w-5 h-5 md:w-6 md:h-6" />
                HOTELS
              </h3>
            </div>
            <div className="p-4 md:p-6">
              {trip.hotels?.length ? (
                <div className="space-y-4">
                  {trip.hotels.map((hotel, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="border-2 border-black p-3 md:p-4"
                    >
                      <div className="font-black text-black text-base md:text-lg uppercase mb-3">
                        {hotel.title}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        {hotel.thumbnail && (
                          <div className="sm:col-span-2">
                            <img
                              src={hotel.thumbnail}
                              alt={hotel.title}
                              className="w-full h-32 object-cover border-2 border-black"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <div>
                          <span className="text-black font-bold uppercase text-xs">Location</span>
                          <div className="text-black font-medium">
                            {hotel.location || "Not Provided"}
                          </div>
                        </div>
                        <div>
                          <span className="text-black font-bold uppercase text-xs">Rating</span>
                          <div className="text-black font-medium flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            {hotel.rating || "N/A"}
                          </div>
                        </div>
                        <div>
                          <span className="text-black font-bold uppercase text-xs">Price</span>
                          <div className="text-black font-medium flex items-center gap-1">
                            <IndianRupeeIcon className="w-3 h-3" />
                            {hotel.price}
                          </div>
                        </div>
                        {hotel.amenities?.length > 0 && (
                          <div className="sm:col-span-2">
                            <span className="text-black font-bold uppercase text-xs">Amenities</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {hotel.amenities.slice(0, 4).map((amenity, idx) => (
                                <span key={idx} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 font-bold">
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Hotel className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-black font-bold uppercase text-sm md:text-base">
                    NO HOTELS BOOKED
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white border-4 border-black mt-4 md:mt-8"
        >
          <div className="bg-black p-3 md:p-4">
            <h3 className="text-white font-black text-lg md:text-xl uppercase flex items-center gap-2">
              <Compass className="w-5 h-5 md:w-6 md:h-6" />
              ACTIVITIES & EXPERIENCES
            </h3>
          </div>
          <div className="p-4 md:p-6">
            {trip.activities?.length ? (
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                {trip.activities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="border-2 border-black p-3 md:p-4"
                  >
                    <div className="flex justify-between items-start mb-3 gap-2">
                      <span className="font-black text-black text-base md:text-lg uppercase">
                        {activity.title}
                      </span>
                      {activity.time && (
                        <div className="bg-yellow-400 border-2 border-black px-2 py-1 flex-shrink-0">
                          <span className="text-black font-bold text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {activity.time}
                          </span>
                        </div>
                      )}
                    </div>
                    {activity.description && (
                      <div className="text-black font-medium text-sm mb-2">
                        {activity.description}
                      </div>
                    )}
                    {activity.address && (
                      <div className="text-black font-medium text-sm flex items-center gap-1 mb-2">
                        <MapPin className="w-3 h-3" />
                        {activity.address}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      {activity.rating > 0 && (
                        <span className="flex items-center gap-1 text-sm">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          {activity.rating}
                        </span>
                      )}
                      {activity.reviews > 0 && (
                        <span className="text-gray-600 text-xs">
                          ({activity.reviews} reviews)
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Compass className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-black font-bold uppercase text-base md:text-xl">
                  NO ACTIVITIES PLANNED YET
                </p>
                <p className="text-black font-medium text-sm mt-2">
                  Time to add some adventure to your trip!
                </p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-yellow-400 border-4 border-black p-4 md:p-6 mt-4 md:mt-8 text-center"
        >
          <p className="text-black font-black text-lg md:text-2xl uppercase tracking-wide">
            READY FOR YOUR ADVENTURE? PACK YOUR BAGS! 🎒
          </p>
        </motion.div>
      </div>
    </div>
  );
}

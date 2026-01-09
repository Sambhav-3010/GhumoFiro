"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any | null>(null);
  const [myTrips, setMyTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [travelHistory, setTravelHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch user data");

        const data = await res.json();
        setUserData(data);

        const tripsRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/trip/my-trips`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (tripsRes.ok) {
          const tripsData = await tripsRes.json();
          setMyTrips(tripsData.trips);
        } else {
          setMyTrips([]);
        }

        const placesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/trip/history`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const placesData = await placesResponse.json();
        setTravelHistory(placesData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 via-red-600 to-orange-500 flex items-center justify-center">
        <p className="text-white text-xl md:text-2xl font-bold">LOADING TRIP DETAILS...</p>
      </div>
    );
  }
  if (!userData) return null;

  return (
    <div className="min-h-screen pb-10 bg-gradient-to-br from-red-500 via-red-600 to-orange-500">
      <div className="bg-black p-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 md:gap-4">
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-white hover:bg-gray-100 text-black font-bold border-2 border-white text-sm md:text-base"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
              BACK
            </Button>
            <div className="text-white text-lg md:text-2xl font-bold">MY PROFILE</div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-4 border-black p-6 md:p-8 text-center"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 border-4 border-black bg-gray-100 flex items-center justify-center mx-auto mb-4 md:mb-6 overflow-hidden">
                <User className="w-12 h-12 md:w-16 md:h-16 text-gray-400" />
              </div>

              <h2 className="text-xl md:text-2xl font-black text-black mb-4 md:mb-6 uppercase">
                {userData.fullName}
              </h2>

              <div className="space-y-3 md:space-y-4 text-black">
                <div className="flex items-center justify-center gap-2 p-2 border-2 border-gray-200">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span className="text-xs md:text-sm font-medium truncate">{userData.email}</span>
                </div>
                <div className="flex items-center justify-center gap-2 p-2 border-2 border-gray-200">
                  <Phone className="w-4 h-4 shrink-0" />
                  <span className="text-xs md:text-sm font-medium">
                    {userData.phoneNumber ? `+91 ${userData.phoneNumber}` : ""}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 p-2 border-2 border-gray-200">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span className="text-xs md:text-sm font-medium capitalize">
                    {userData.city}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 p-2 border-2 border-gray-200">
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span className="text-xs md:text-sm font-medium">
                    {userData.age ? `${userData.age} years old` : ""}
                  </span>
                </div>
              </div>

              <div className="mt-4 md:mt-6 p-3 md:p-4 bg-yellow-400 border-2 border-black">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-black" />
                  <span className="font-black text-black uppercase text-sm md:text-base">
                    Travel Stats
                  </span>
                </div>
                <p className="text-2xl md:text-3xl font-black text-black">
                  {userData.numberOfTrips}
                </p>
                <p className="text-xs md:text-sm font-bold text-black uppercase">
                  Total Trips
                </p>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border-4 border-black p-6 md:p-8"
            >
              <h3 className="text-lg md:text-xl font-black text-black uppercase mb-3 md:mb-4">
                Recently Visited
              </h3>
              <p className="text-black font-medium text-sm md:text-base">
                {userData.recentlyVisited || "No recent visits"}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border-4 border-black p-6 md:p-8"
            >
              <div className="flex flex-wrap items-center gap-3 mb-4 md:mb-6">
                <Globe className="w-5 h-5 md:w-6 md:h-6 text-black" />
                <h3 className="text-lg md:text-xl font-black text-black uppercase">
                  Travel History
                </h3>
                <div className="bg-yellow-400 border-2 border-black px-2 md:px-3 py-1">
                  <span className="text-black font-bold text-xs md:text-sm">
                    {travelHistory?.length || 0}
                  </span>
                </div>
              </div>

              {travelHistory?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {travelHistory.map((trip: any, index: number) => (
                    <motion.div
                      key={trip._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="bg-gradient-to-br from-yellow-100 via-white to-orange-100 
                     border-4 border-black p-4 md:p-5 rounded-xl shadow-md 
                     hover:shadow-lg transition-all"
                    >
                      <h4 className="text-base md:text-lg font-extrabold text-black mb-2">
                        {trip.place_of_visit}
                      </h4>
                      <p className="text-xs md:text-sm text-gray-700 mb-1">
                        {new Date(trip.start_date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}{" "}
                        –{" "}
                        {new Date(trip.end_date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}{" "}
                      </p>
                      <p className="text-xs md:text-sm font-bold text-black">
                        Budget: ₹{trip.overall_budget.toLocaleString()}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-black font-medium text-sm md:text-base">
                  No travel history available
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div className="max-w-6xl mx-auto mt-8 md:mt-12 px-4 md:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-4 border-black p-6 md:p-8"
        >
          <h3 className="text-xl md:text-2xl font-black uppercase mb-4 md:mb-6 text-center text-black">
            My Itineraries
          </h3>

          {myTrips.length === 0 ? (
            <p className="text-center text-black font-medium text-sm md:text-base">
              No itineraries created yet
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {myTrips.map((trip, index) => (
                <motion.div
                  key={trip._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  onClick={() => router.push(`/trips/${trip._id}`)}
                  className="group relative bg-gradient-to-br from-red-300 via-red-100 to-orange-500
                       border-4 border-black p-5 md:p-6 rounded-2xl shadow-lg cursor-pointer 
                       hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
                >
                  <h4 className="text-base md:text-lg font-extrabold text-black mb-2 group-hover:underline">
                    {trip.place_of_visit}
                  </h4>
                  <p className="text-xs md:text-sm text-gray-700 mb-2">
                    {new Date(trip.start_date).toLocaleDateString("en-GB")} –{" "}
                    {new Date(trip.end_date).toLocaleDateString("en-GB")} (
                    {trip.duration_of_visit} days)
                  </p>
                  <div className="flex justify-between items-center mt-3 md:mt-4">
                    <p className="text-xs md:text-sm font-bold text-black">
                      Budget: ₹{trip.overall_budget.toLocaleString()}
                    </p>
                    <p className="text-xs md:text-sm font-medium text-red-600">
                      Spent: ₹{trip.total_spent.toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  BarChart3,
  Plane,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const getInitials = (fullName: string): string => {
  if (!fullName) return "?";
  const names = fullName.trim().split(" ").filter(Boolean);
  if (names.length === 0) return "?";
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

const getAvatarColor = (initials: string): string => {
  const colors = [
    "bg-red-500",
    "bg-purple-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-orange-500",
  ];
  const index = initials.charCodeAt(0) % colors.length;
  return colors[index];
};

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
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Plane className="w-12 h-12 text-white" />
          </motion.div>
          <p className="text-white text-xl font-bold uppercase">Loading Profile...</p>
        </div>
      </div>
    );
  }
  if (!userData) return null;

  const initials = getInitials(userData.fullName);
  const avatarColor = getAvatarColor(initials);

  return (
    <div className="min-h-screen pb-10 bg-gradient-to-br from-red-500 via-red-600 to-orange-500">
      <div className="bg-black p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-white hover:bg-gray-100 text-black font-bold border-2 border-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              BACK
            </Button>
            <div className="text-white text-2xl font-bold">MY PROFILE</div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-4 border-black p-8"
            >
              <div className={`w-32 h-32 border-4 border-black ${avatarColor} flex items-center justify-center mx-auto mb-6`}>
                <span className="text-4xl font-black text-white">
                  {initials}
                </span>
              </div>

              <h2 className="text-2xl font-black text-black mb-2 uppercase text-center">
                {userData.fullName}
              </h2>

              <p className="text-center text-gray-600 text-sm mb-4">
                Explorer & Adventure Seeker
              </p>

              <div className="space-y-3 text-black">
                <div className="flex items-center gap-3 p-3 bg-gray-50 border-2 border-black">
                  <div className="w-8 h-8 bg-red-500 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium truncate flex-1">{userData.email}</span>
                </div>

                {userData.phoneNumber && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 border-2 border-black">
                    <div className="w-8 h-8 bg-green-500 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">+91 {userData.phoneNumber}</span>
                  </div>
                )}

                {userData.city && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 border-2 border-black">
                    <div className="w-8 h-8 bg-blue-500 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium capitalize">{userData.city}</span>
                  </div>
                )}

                {userData.age && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 border-2 border-black">
                    <div className="w-8 h-8 bg-purple-500 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">{userData.age} years old</span>
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 bg-yellow-400 border-4 border-black">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <BarChart3 className="w-5 h-5 text-black" />
                  <span className="font-black text-black uppercase">
                    Travel Stats
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 text-center border-2 border-black">
                    <p className="text-2xl font-black text-black">
                      {userData.numberOfTrips || 0}
                    </p>
                    <p className="text-xs font-bold text-gray-700 uppercase">
                      Total Trips
                    </p>
                  </div>
                  <div className="bg-white p-3 text-center border-2 border-black">
                    <p className="text-2xl font-black text-black">
                      {travelHistory?.length || 0}
                    </p>
                    <p className="text-xs font-bold text-gray-700 uppercase">
                      Places Visited
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border-4 border-black p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500 flex items-center justify-center border-2 border-black">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-black text-black uppercase">
                  Recently Visited
                </h3>
              </div>
              {userData.recentlyVisited ? (
                <div className="inline-flex items-center gap-2 bg-purple-100 border-2 border-purple-400 px-4 py-2">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  <span className="font-bold text-purple-700">{userData.recentlyVisited}</span>
                </div>
              ) : (
                <p className="text-gray-500 font-medium">
                  No recent visits recorded
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border-4 border-black p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500 flex items-center justify-center border-2 border-black">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-black text-black uppercase">
                  Travel History
                </h3>
                <div className="bg-yellow-400 border-2 border-black px-3 py-1">
                  <span className="text-black font-bold text-sm">
                    {travelHistory?.length || 0} trips
                  </span>
                </div>
              </div>

              {travelHistory?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {travelHistory.map((trip: any, index: number) => (
                    <motion.div
                      key={trip._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="bg-gray-50 border-2 border-black p-4 hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-lg font-black text-black">
                          {trip.place_of_visit}
                        </h4>
                        <div className="w-8 h-8 bg-blue-500 flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {new Date(trip.start_date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        –{" "}
                        {new Date(trip.end_date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 border border-green-300">
                          ₹{trip.overall_budget.toLocaleString()}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium mb-4">
                    No travel history yet. Start exploring!
                  </p>
                  <Button
                    onClick={() => router.push("/travel-history")}
                    className="bg-blue-500 text-white font-bold border-2 border-black"
                  >
                    Add Travel History
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div className="max-w-6xl mx-auto mt-12 px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-4 border-black p-8"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-500 flex items-center justify-center border-2 border-black">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-black uppercase text-black">
              My Itineraries
            </h3>
            {myTrips.length > 0 && (
              <div className="bg-red-500 text-white text-sm font-bold px-3 py-1 border-2 border-black">
                {myTrips.length}
              </div>
            )}
          </div>

          {myTrips.length === 0 ? (
            <div className="text-center py-8">
              <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium mb-4">
                No itineraries created yet
              </p>
              <Button
                onClick={() => router.push("/manual-itinerary-builder/setup")}
                className="bg-red-500 text-white font-bold border-2 border-black"
              >
                Create Your First Trip
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myTrips.map((trip, index) => (
                <motion.div
                  key={trip._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  onClick={() => router.push(`/trips/${trip._id}`)}
                  className="group relative bg-white border-4 border-black p-5 cursor-pointer hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-black" />
                  </div>

                  <h4 className="text-xl font-black text-black mb-2 group-hover:text-red-600 transition-colors">
                    {trip.place_of_visit}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {new Date(trip.start_date).toLocaleDateString("en-GB")} –{" "}
                    {new Date(trip.end_date).toLocaleDateString("en-GB")}
                    <span className="ml-2 bg-gray-200 px-2 py-0.5 text-gray-700 font-medium">
                      {trip.duration_of_visit} days
                    </span>
                  </p>
                  <div className="flex justify-between items-center pt-3 border-t-2 border-black">
                    <div>
                      <p className="text-xs uppercase text-gray-500 font-bold">Budget</p>
                      <p className="text-sm font-bold text-black">
                        ₹{trip.overall_budget.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase text-gray-500 font-bold">Spent</p>
                      <p className="text-sm font-bold text-red-600">
                        ₹{trip.total_spent.toLocaleString()}
                      </p>
                    </div>
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

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plane, User, LogOut, Zap, MapPin, Bot, Menu, X, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import { useAlert } from "../context/AlertContext";
import RecommendationSection from "./components/RecommendationSection";

const trendingDestinations = [
  {
    id: 1,
    name: "Magical Rajasthan",
    image: "/rajasthan-palace-sunset.png",
    budget: "45000",
    duration: "7 Days",
    description: "Royal palaces and vibrant culture",
  },
  {
    id: 2,
    name: "Kerala Backwaters",
    image: "/kerala-backwaters-houseboat.png",
    budget: "35000",
    duration: "5 Days",
    description: "Serene houseboat experiences",
  },
  {
    id: 3,
    name: "Himalayan Adventure",
    image: "/placeholder.svg?height=300&width=400&text=Himalayan+Mountains",
    budget: "55000",
    duration: "10 Days",
    description: "Breathtaking mountain views",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, setUser } = useUser();
  const { showAlert } = useAlert();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [loading, user, router]);

  const handleSignOut = async () => {
    setUser(null);
    setMobileMenuOpen(false);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (!response.ok) {
      showAlert("Error signing out. Please try again");
      return;
    } else {
      await response.json();
      if (response.status === 200) {
        showAlert("Signed out successfully", "success", "Logout");
      }
      else {
        showAlert("Error signing out. Please try again");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 via-red-600 to-orange-500">
        <p className="text-white text-xl font-bold">Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-red-600 to-orange-500">
      <div className="bg-black p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-white text-xl md:text-2xl font-bold">GhumoFiro</div>
            <div className="bg-yellow-400 text-black px-2 py-1 text-xs font-bold rounded">
              BETA
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button
              onClick={() => router.push("/profile")}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold border-2 border-white"
            >
              <User className="w-4 h-4 mr-2" />
              PROFILE
            </Button>

            <Button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white font-bold border-2 border-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              SIGN OUT
            </Button>
          </div>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-black border-l-2 border-white w-64">
              <div className="flex flex-col gap-4 mt-8">
                <Button
                  onClick={() => {
                    router.push("/profile");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold border-2 border-white"
                >
                  <User className="w-4 h-4 mr-2" />
                  PROFILE
                </Button>

                <Button
                  onClick={handleSignOut}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold border-2 border-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  SIGN OUT
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-4 border-black p-4 md:p-6 mb-6 md:mb-8"
        >
          <p className="text-black font-medium text-lg md:text-xl">
            Ready to explore the world? Where wanderlust meets adventure, and
            journeys go beyond the ordinary!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 md:mb-12"
        >
          <div className="bg-yellow-400 border-4 border-black p-3 md:p-4 text-center mb-6 md:mb-8">
            <p className="text-black font-bold text-sm md:text-lg uppercase tracking-wide">
              PACK YOUR BAGS, EXPLORE THE WORLD!!!
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-black mb-4 md:mb-6 leading-none">
              FIND YOUR
              <br />
              PERFECT TRIP <Zap className="inline w-10 h-10 md:w-16 md:h-16 text-yellow-400" />
            </h1>

            <div className="bg-white border-4 border-black p-4 md:p-6 mb-6 md:mb-8">
              <p className="text-black font-medium text-base md:text-lg">
                Ready to flip the script on traveling? Where adventure meets
                discovery, and connections go beyond the journey!
              </p>
            </div>

            {user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white border-4 border-black p-4 mb-6"
              >
                <div className="flex items-center gap-3">
                  {user.profilePhoto && (
                    <img
                      src={user.profilePhoto || "/placeholder.svg"}
                      alt="Profile"
                      className="w-12 h-12 rounded-full border-2 border-black"
                    />
                  )}
                  <p className="text-black font-bold text-base md:text-lg">
                    Welcome back, {user.f_name || "Explorer"}! 🎉
                  </p>
                </div>
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
              <div className="bg-black text-white px-4 md:px-6 py-3 font-bold border-2 border-black text-center sm:text-left">
                <Plane className="inline w-5 h-5 mr-2" />
                Download on the App Store
              </div>
              <div className="bg-white border-4 border-black px-4 py-2">
                <p className="text-black font-medium text-sm md:text-base">
                  Email us at{" "}
                  <span className="text-red-600 font-bold">
                    support@ghumofiro.com
                  </span>{" "}
                  to get early access on Android
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <div className="bg-white border-4 border-black p-4 md:p-6">
              <Button
                onClick={() => router.push("/ai-trip-planner")}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-base md:text-lg h-14 md:h-16 border-2 border-black"
              >
                <Bot className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />
                AI TRIP PLANNER →
              </Button>
            </div>

            <div className="bg-white border-4 border-black p-4 md:p-6">
              <Button
                onClick={() => router.push("/manual-itinerary-builder/setup")}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold text-base md:text-lg h-14 md:h-16 border-2 border-black"
              >
                <MapPin className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />
                MANUAL TRIP BUILDER →
              </Button>
            </div>

            <div className="bg-white border-4 border-black p-4 md:p-6">
              <Button
                onClick={() => router.push("/travel-history")}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-base md:text-lg h-14 md:h-16 border-2 border-black"
              >
                <History className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />
                VIEW TRAVEL HISTORY →
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Personalized Recommendations Section */}
        <div className="mb-8 md:mb-12">
          <RecommendationSection />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <h2 className="text-2xl md:text-4xl font-black text-white mb-4 md:mb-6">
            NEED HELP OR SUPPORT?
          </h2>
          <div className="bg-white border-4 border-black p-4 md:p-6 max-w-2xl mx-auto">
            <p className="text-black font-medium text-base md:text-lg">
              Have questions about GhumoFiro? Need technical support? We're
              here to help you plan the perfect adventure!
            </p>
          </div>
        </motion.div>

        <div className="flex justify-center gap-4 mt-6 md:mt-8">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white border-2 border-black flex items-center justify-center">
            <span className="text-black font-bold">T</span>
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white border-2 border-black flex items-center justify-center">
            <span className="text-black font-bold">I</span>
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white border-2 border-black flex items-center justify-center">
            <span className="text-black font-bold">L</span>
          </div>
        </div>
      </div>
    </div>
  );
}

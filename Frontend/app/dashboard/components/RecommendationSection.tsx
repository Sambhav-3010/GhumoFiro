"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Users, MapPin, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/app/context/UserContext";
import RecommendationCard from "./RecommendationCard";

interface Recommendations {
    based_on_similar_age_group: string[];
    based_on_co_visitation: string[];
    based_on_same_city: string[];
}

interface RecommendationCategory {
    key: keyof Recommendations;
    title: string;
    subtitle: string;
    icon: typeof TrendingUp;
    gradient: string;
    category: "age_group" | "co_visitation" | "same_city";
}

const categories: RecommendationCategory[] = [
    {
        key: "based_on_similar_age_group",
        title: "Trending For You",
        subtitle: "Popular among your age group",
        icon: TrendingUp,
        gradient: "from-orange-500 to-yellow-500",
        category: "age_group",
    },
    {
        key: "based_on_co_visitation",
        title: "You Might Also Like",
        subtitle: "Places travelers like you visited",
        icon: Sparkles,
        gradient: "from-purple-500 to-pink-500",
        category: "co_visitation",
    },
    {
        key: "based_on_same_city",
        title: "Popular Nearby",
        subtitle: "Favorites from your city",
        icon: MapPin,
        gradient: "from-blue-500 to-cyan-500",
        category: "same_city",
    },
];

function LoadingSkeleton() {
    return (
        <div className="space-y-6">
            {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                    <div className="h-6 bg-gray-300 rounded w-48 mb-3" />
                    <div className="flex gap-4 overflow-hidden">
                        {[1, 2, 3].map((j) => (
                            <div
                                key={j}
                                className="min-w-[200px] h-48 bg-gray-200 border-4 border-gray-300"
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function RecommendationSection() {
    const { user, loading: userLoading } = useUser();
    const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (userLoading) {
                return;
            }

            if (!user?._id) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

                const response = await fetch(
                    `${backendUrl}/recommendations`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to fetch recommendations");
                }

                const data = await response.json();
                setRecommendations(data.recommendations);
            } catch (err: any) {
                console.error("Error fetching recommendations:", err);
                setError(err.message || "Failed to load recommendations");
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [user?._id, userLoading]);

    // Show loading skeleton while user context is loading OR we're fetching recommendations
    if (userLoading || loading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border-4 border-black p-4 md:p-6"
            >
                <div className="flex items-center gap-3 mb-4">
                    <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                    <span className="text-black font-bold uppercase">
                        Loading personalized recommendations...
                    </span>
                </div>
                <LoadingSkeleton />
            </motion.div>
        );
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-4 border-black p-4 md:p-6"
            >
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                    <h3 className="text-lg font-bold text-black uppercase mb-2">
                        Couldn't Load Recommendations
                    </h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold border-2 border-black"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                    </Button>
                </div>
            </motion.div>
        );
    }

    // If no user is logged in, show a prompt
    if (!user && !userLoading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-4 border-black p-4 md:p-6"
            >
                <div className="flex items-center gap-3 mb-4">
                    <MapPin className="w-6 h-6 text-red-500" />
                    <h2 className="text-lg md:text-xl font-black text-black uppercase">
                        Personalized Recommendations
                    </h2>
                </div>
                <p className="text-black font-medium">
                    Log in to see personalized travel recommendations based on your profile!
                </p>
            </motion.div>
        );
    }

    if (!recommendations) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-4 border-black p-4 md:p-6"
            >
                <div className="flex items-center gap-3 mb-4">
                    <MapPin className="w-6 h-6 text-red-500" />
                    <h2 className="text-lg md:text-xl font-black text-black uppercase">
                        Your Travel Picks
                    </h2>
                </div>
                <p className="text-black font-medium">
                    Loading your personalized recommendations...
                </p>
            </motion.div>
        );
    }

    const hasRecommendations = Object.values(recommendations).some(
        (arr) => arr.length > 0
    );

    if (!hasRecommendations) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-4 border-black p-4 md:p-6"
            >
                <div className="flex items-center gap-3 mb-4">
                    <MapPin className="w-6 h-6 text-red-500" />
                    <h2 className="text-lg md:text-xl font-black text-black uppercase">
                        Start Your Journey
                    </h2>
                </div>
                <p className="text-black font-medium">
                    Complete your profile and start traveling to get personalized recommendations!
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
        >
            {/* Section Header */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 border-4 border-black p-3 md:p-4">
                <div className="flex items-center gap-2 md:gap-3">
                    <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-black" />
                    <h2 className="text-base md:text-xl font-black text-black uppercase tracking-wide">
                        Your Personalized Travel Picks
                    </h2>
                </div>
            </div>

            {/* Recommendation Categories */}
            {categories.map((cat, catIndex) => {
                const cities = recommendations[cat.key];
                if (!cities || cities.length === 0) return null;

                return (
                    <motion.div
                        key={cat.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + catIndex * 0.1 }}
                        className="bg-white border-4 border-black p-4 md:p-6"
                    >
                        {/* Category Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg md:text-xl font-black text-black uppercase">
                                    {cat.title}
                                </h3>
                                <p className="text-xs md:text-sm text-gray-600 font-medium">
                                    {cat.subtitle}
                                </p>
                            </div>
                            <div
                                className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${cat.gradient} border-2 border-black flex items-center justify-center`}
                            >
                                <cat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            </div>
                        </div>

                        {/* Cards Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                            {cities.slice(0, 4).map((city, index) => (
                                <RecommendationCard
                                    key={`${cat.key}-${city}-${index}`}
                                    city={city}
                                    category={cat.category}
                                    index={index}
                                />
                            ))}
                        </div>
                    </motion.div>
                );
            })}
        </motion.div>
    );
}

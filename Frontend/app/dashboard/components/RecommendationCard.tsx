"use client";

import { motion } from "framer-motion";
import { MapPin, Sparkles, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface RecommendationCardProps {
  city: string;
  category: "age_group" | "co_visitation" | "same_city";
  index: number;
}

const categoryConfig = {
  age_group: {
    icon: TrendingUp,
    gradient: "from-orange-400 to-yellow-400",
    bgGradient: "from-orange-50 to-yellow-50",
    borderColor: "border-orange-400",
    label: "Trending",
  },
  co_visitation: {
    icon: Sparkles,
    gradient: "from-purple-400 to-pink-400",
    bgGradient: "from-purple-50 to-pink-50",
    borderColor: "border-purple-400",
    label: "Popular",
  },
  same_city: {
    icon: Users,
    gradient: "from-blue-400 to-cyan-400",
    bgGradient: "from-blue-50 to-cyan-50",
    borderColor: "border-blue-400",
    label: "Nearby",
  },
};

const cityImages: Record<string, string> = {
  mumbai: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=400&h=300&fit=crop",
  delhi: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop",
  goa: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=300&fit=crop",
  kerala: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=300&fit=crop",
  rajasthan: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&h=300&fit=crop",
  jaipur: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&h=300&fit=crop",
  udaipur: "https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=400&h=300&fit=crop",
  manali: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&h=300&fit=crop",
  shimla: "https://images.unsplash.com/photo-1597074866923-dc0589150358?w=400&h=300&fit=crop",
  varanasi: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&h=300&fit=crop",
  agra: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop",
  bangalore: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&h=300&fit=crop",
  chennai: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=300&fit=crop",
  kolkata: "https://images.unsplash.com/photo-1558431382-27e303142255?w=400&h=300&fit=crop",
  hyderabad: "https://images.unsplash.com/photo-1572445271230-a78b4a823c5b?w=400&h=300&fit=crop",
  pune: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=400&h=300&fit=crop",
  mysore: "https://images.unsplash.com/photo-1600100397608-e1bd4e0de6c5?w=400&h=300&fit=crop",
  ooty: "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=400&h=300&fit=crop",
  rishikesh: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=300&fit=crop",
  darjeeling: "https://images.unsplash.com/photo-1622308644420-27e15fb8eb0b?w=400&h=300&fit=crop",
};

const getDefaultImage = (city: string) => {
  const normalizedCity = city.toLowerCase().trim();
  return (
    cityImages[normalizedCity] ||
    `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop`
  );
};

export default function RecommendationCard({
  city,
  category,
  index,
}: RecommendationCardProps) {
  const router = useRouter();
  const config = categoryConfig[category];
  const Icon = config.icon;

  const handleClick = () => {
    const formattedCity = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
    router.push(`/manual-itinerary-builder/setup?destination=${encodeURIComponent(formattedCity)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group cursor-pointer"
      onClick={handleClick}
    >
      <div
        className={`relative bg-white border-4 border-black overflow-hidden transition-all duration-300 group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}
      >
        {/* Image Section */}
        <div className="relative h-32 md:h-40 overflow-hidden">
          <img
            src={getDefaultImage(city)}
            alt={city}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Category Badge */}
          <div
            className={`absolute top-2 left-2 bg-gradient-to-r ${config.gradient} px-2 py-1 border-2 border-black`}
          >
            <div className="flex items-center gap-1">
              <Icon className="w-3 h-3 text-black" />
              <span className="text-[10px] md:text-xs font-bold text-black uppercase">
                {config.label}
              </span>
            </div>
          </div>

          {/* City Name */}
          <div className="absolute bottom-2 left-2 right-2">
            <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-wide drop-shadow-lg">
              {city}
            </h3>
          </div>
        </div>

        {/* Action Section */}
        <div className="p-3 bg-gradient-to-r from-gray-50 to-white">
          <Button
            className={`w-full bg-gradient-to-r ${config.gradient} hover:opacity-90 text-black font-bold text-xs md:text-sm border-2 border-black h-9 md:h-10 uppercase tracking-wide transition-all`}
          >
            <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            Plan This Trip
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

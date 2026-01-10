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
    color: "bg-orange-400",
    label: "Popular",
  },
  co_visitation: {
    icon: Sparkles,
    color: "bg-purple-400",
    label: "Popular",
  },
  same_city: {
    icon: Users,
    color: "bg-blue-400",
    label: "Nearby",
  },
};

const cityImages: Record<string, string> = {
  mumbai: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=400&h=300&fit=crop",
  delhi: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop",
  "new delhi": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop",
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
  bengaluru: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&h=300&fit=crop",
  chennai: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=300&fit=crop",
  kolkata: "https://images.unsplash.com/photo-1558431382-27e303142255?w=400&h=300&fit=crop",
  hyderabad: "https://images.unsplash.com/photo-1572445271230-a78b4a823c5b?w=400&h=300&fit=crop",
  pune: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=400&h=300&fit=crop",
  mysore: "https://images.unsplash.com/photo-1600100397608-e1bd4e0de6c5?w=400&h=300&fit=crop",
  mysuru: "https://images.unsplash.com/photo-1600100397608-e1bd4e0de6c5?w=400&h=300&fit=crop",
  ooty: "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=400&h=300&fit=crop",
  rishikesh: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=300&fit=crop",
  darjeeling: "https://images.unsplash.com/photo-1622308644420-27e15fb8eb0b?w=400&h=300&fit=crop",
  vietnam: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop",
  vadodara: "https://images.unsplash.com/photo-1585128792020-803d29415281?w=400&h=300&fit=crop",
  indore: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=400&h=300&fit=crop",
  "new york": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop",
  bhopal: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=400&h=300&fit=crop",
  nepal: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop",
  "himachal pradesh": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&h=300&fit=crop",
  bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop",
  thailand: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&h=300&fit=crop",
  dubai: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop",
  singapore: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop",
  paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop",
  london: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=400&h=300&fit=crop",
  tokyo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop",
  switzerland: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=400&h=300&fit=crop",
  maldives: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=300&fit=crop",
  srinagar: "https://images.unsplash.com/photo-1593181629936-11c609b8db9b?w=400&h=300&fit=crop",
  kashmir: "https://images.unsplash.com/photo-1593181629936-11c609b8db9b?w=400&h=300&fit=crop",
  ladakh: "https://images.unsplash.com/photo-1545652985-5edd365b12eb?w=400&h=300&fit=crop",
  leh: "https://images.unsplash.com/photo-1545652985-5edd365b12eb?w=400&h=300&fit=crop",
  andaman: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
  pondicherry: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=300&fit=crop",
  coorg: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
  munnar: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=300&fit=crop",
  alleppey: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=300&fit=crop",
  jaisalmer: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&h=300&fit=crop",
  jodhpur: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&h=300&fit=crop",
  amritsar: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=400&h=300&fit=crop",
  haridwar: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=300&fit=crop",
  mcleodganj: "https://images.unsplash.com/photo-1597074866923-dc0589150358?w=400&h=300&fit=crop",
  dharamshala: "https://images.unsplash.com/photo-1597074866923-dc0589150358?w=400&h=300&fit=crop",
  nainital: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&h=300&fit=crop",
  dehradun: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=300&fit=crop",
  mussoorie: "https://images.unsplash.com/photo-1597074866923-dc0589150358?w=400&h=300&fit=crop",
};

const fallbackImages = [
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400&h=300&fit=crop",
];

const getImageForCity = (city: string): string => {
  const normalizedCity = city.toLowerCase().trim();
  if (cityImages[normalizedCity]) {
    return cityImages[normalizedCity];
  }
  let hash = 0;
  for (let i = 0; i < city.length; i++) {
    hash = city.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % fallbackImages.length;
  return fallbackImages[index];
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
      whileHover={{ y: -8 }}
      className="group cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative bg-white border-4 border-black overflow-hidden transition-all duration-300 group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="relative h-32 md:h-40 overflow-hidden">
          <img
            src={getImageForCity(city)}
            alt={city}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <div className={`absolute top-2 left-2 ${config.color} px-2 py-1 border-2 border-black`}>
            <div className="flex items-center gap-1">
              <Icon className="w-3 h-3 text-black" />
              <span className="text-[10px] md:text-xs font-bold text-black uppercase">
                {config.label}
              </span>
            </div>
          </div>

          <div className="absolute bottom-2 left-2 right-2">
            <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-wide drop-shadow-lg">
              {city}
            </h3>
          </div>
        </div>

        <div className="p-3 bg-white">
          <Button
            className={`w-full ${config.color} hover:opacity-90 text-black font-bold text-xs md:text-sm border-2 border-black h-9 md:h-10 uppercase tracking-wide`}
          >
            <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            Plan This Trip
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

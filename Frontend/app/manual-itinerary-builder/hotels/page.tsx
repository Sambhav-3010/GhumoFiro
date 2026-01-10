"use client";

import { useState, useEffect } from "react";
import { Hotel, Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { PageHeader, HotelList, LoadingSpinner, HotelItem } from "@/components/itinerary";
import { parsePrice } from "@/lib/formatUtils";

export default function HotelsPage() {
  const router = useRouter();
  const [selectedHotels, setSelectedHotels] = useState<HotelItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<"all" | "budget" | "mid" | "luxury">("all");
  const [availableHotels, setAvailableHotels] = useState<HotelItem[]>([]);
  const [adults, setAdults] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("hotel-selections");
    if (saved) setSelectedHotels(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const saved = JSON.parse(localStorage.getItem("trip-details") || "{}");
        if (!saved.destination || !saved.startDate || !saved.endDate) return;

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/hotels`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: saved.destination,
            check_in_date: saved.startDate,
            check_out_date: saved.endDate,
            adults: adults.toString(),
          }),
          credentials: "include"
        });

        if (!response.ok) return;
        const data = await response.json();

        const hotelsFromAds = (data.ads || []).map((ad: any) => ({
          id: ad.name || ad.property_token || Math.random().toString(),
          title: ad.name || "Unknown Hotel",
          description: ad.description || "",
          price: parsePrice(ad.price || ad.rate_per_night?.lowest),
          rating: ad.overall_rating || 0,
          amenities: ad.amenities || [],
          location: ad.address || "",
          thumbnail: ad.thumbnail || null,
        }));

        const hotelsFromProps = (data.properties || [])
          .filter((p: any) => p.type === "hotel")
          .map((p: any) => ({
            id: p.name || p.property_token || Math.random().toString(),
            title: p.name || "Unknown Hotel",
            description: p.description || "",
            price: parsePrice(p.rate_per_night?.lowest || p.total_rate?.lowest),
            rating: p.overall_rating || 0,
            amenities: p.amenities || [],
            location: p.location || "",
            thumbnail: p.images?.[0]?.thumbnail || null,
          }));

        setAvailableHotels([...hotelsFromAds, ...hotelsFromProps]);
      } catch (err) {
        console.error("Error fetching hotels:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [adults]);

  const handleAddHotel = (item: HotelItem) => {
    const updated = [...selectedHotels, { ...item, id: `${item.id}-${Date.now()}` }];
    setSelectedHotels(updated);
    localStorage.setItem("hotel-selections", JSON.stringify(updated));

    const progress = JSON.parse(localStorage.getItem("trip-progress") || "[]");
    if (!progress.includes("hotels")) {
      progress.push("hotels");
      localStorage.setItem("trip-progress", JSON.stringify(progress));
    }
  };

  const handleRemoveHotel = (id: string) => {
    const updated = selectedHotels.filter((item) => item.id !== id);
    setSelectedHotels(updated);
    localStorage.setItem("hotel-selections", JSON.stringify(updated));
  };

  const getFilteredResults = () => {
    return availableHotels.filter((item) => {
      const searchMatch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.location || "").toLowerCase().includes(searchQuery.toLowerCase());

      let matchesPrice = true;
      if (priceRange !== "all" && item.price > 0) {
        if (priceRange === "budget") matchesPrice = item.price < 4000;
        else if (priceRange === "mid") matchesPrice = item.price >= 4000 && item.price <= 10000;
        else if (priceRange === "luxury") matchesPrice = item.price > 10000;
      }

      return searchMatch && matchesPrice;
    });
  };

  const totalCost = selectedHotels.reduce((sum, h) => sum + h.price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-red-600 to-orange-500">
      <PageHeader
        title="HOTEL SELECTION"
        backPath="/manual-itinerary-builder"
        rightButton={{ label: "CONTINUE TO ACTIVITIES →", onClick: () => router.push("/manual-itinerary-builder/activities") }}
      />

      <div className="max-w-7xl mx-auto p-3 md:p-6">
        <div className="bg-white border-4 border-black p-3 md:p-4 mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <Users className="w-5 h-5 text-black hidden sm:block" />
            <label className="text-black font-bold text-sm md:text-base">Number of Adults:</label>
            <Select value={adults.toString()} onValueChange={(val: string) => setAdults(parseInt(val))}>
              <SelectTrigger className="w-20 md:w-24 border-2 border-black bg-white font-bold text-sm">
                <SelectValue placeholder={adults.toString()} />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white border-4 border-black p-4 md:p-6">
            <h3 className="text-base md:text-lg font-black text-black mb-4 uppercase flex items-center gap-2">
              <Hotel className="w-4 h-4 md:w-5 md:h-5" />
              Available Hotels
            </h3>

            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                <Input
                  placeholder="SEARCH HOTELS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 md:pl-10 border-2 border-black font-bold text-sm"
                />
              </div>
              <Select value={priceRange} onValueChange={(value: any) => setPriceRange(value)}>
                <SelectTrigger className="w-full sm:w-32 md:w-36 border-2 border-black font-bold text-sm">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ALL</SelectItem>
                  <SelectItem value="budget">BUDGET</SelectItem>
                  <SelectItem value="mid">MID</SelectItem>
                  <SelectItem value="luxury">LUXURY</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading && <LoadingSpinner message="Loading hotels..." color="text-green-500" />}

            <div className="max-h-[50vh] md:max-h-96 overflow-y-auto">
              <HotelList
                items={getFilteredResults()}
                selectedTitles={selectedHotels.map(h => h.title)}
                onAdd={handleAddHotel}
              />
              {!loading && availableHotels.length === 0 && (
                <div className="text-center py-8">
                  <Hotel className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-bold text-sm md:text-base">No hotels found</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border-4 border-black p-4 md:p-6">
            <h3 className="text-base md:text-lg font-black text-black mb-4 uppercase">Your Selected Hotels</h3>

            {selectedHotels.length > 0 ? (
              <div className="space-y-3 md:space-y-4">
                <HotelList
                  items={selectedHotels}
                  selectedTitles={selectedHotels.map(h => h.title)}
                  onAdd={() => { }}
                  onRemove={handleRemoveHotel}
                  showRemove
                />
                <div className="pt-3 md:pt-4 border-t-2 border-black">
                  <div className="flex justify-between items-center">
                    <span className="text-black font-bold uppercase text-sm md:text-base">Total Hotel Cost:</span>
                    <span className="text-lg md:text-xl font-black text-black">₹{totalCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 md:py-12">
                <Hotel className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-black font-bold uppercase text-sm md:text-base">No hotels selected yet</p>
                <p className="text-gray-600 text-xs md:text-sm">Choose from available options</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
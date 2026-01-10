"use client";

import { useState, useEffect } from "react";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { PageHeader, PlaceList, LoadingSpinner, PlaceItem } from "@/components/itinerary";

export default function LocalPlacesPage() {
  const router = useRouter();
  const [places, setPlaces] = useState<PlaceItem[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<PlaceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("Temples");
  const [searchLocation, setSearchLocation] = useState("New Delhi");

  useEffect(() => {
    const trip = JSON.parse(localStorage.getItem("trip-details") || "{}");
    if (trip.destination) setSearchLocation(trip.destination);

    const savedSelected = localStorage.getItem("activity-selections");
    if (savedSelected) setSelectedPlaces(JSON.parse(savedSelected));
  }, []);

  const fetchPlaces = async () => {
    if (!searchTerm || !searchLocation) return;
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/localplaces`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: searchTerm, location: searchLocation }),
        credentials: "include"
      });

      const data = await res.json();
      if (Array.isArray(data.local_results || data)) {
        setPlaces((data.local_results || data).map((p: any) => ({
          id: p.place_id || String(p.position) || Math.random().toString(),
          title: p.title || "Unknown Place",
          description: p.description || "",
          rating: Number(p.rating) || 0,
          reviews: Number(p.reviews) || 0,
          address: p.address || "Address not available",
          phone: p.phone,
          hours: p.hours,
          website: p.links?.website,
          directions: p.links?.directions
        })));
      }
    } catch (err) {
      console.error("Error fetching local places:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (place: PlaceItem) => {
    if (selectedPlaces.find((p) => p.id === place.id)) return;
    const updated = [...selectedPlaces, place];
    setSelectedPlaces(updated);
    localStorage.setItem("activity-selections", JSON.stringify(updated));

    const progress = JSON.parse(localStorage.getItem("trip-progress") || "[]");
    if (!progress.includes("activities")) {
      progress.push("activities");
      localStorage.setItem("trip-progress", JSON.stringify(progress));
    }
  };

  const handleRemove = (id: string) => {
    const updated = selectedPlaces.filter((p) => p.id !== id);
    setSelectedPlaces(updated);
    localStorage.setItem("activity-selections", JSON.stringify(updated));
  };

  const filtered = places.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-red-600 to-orange-500 overflow-x-hidden">
      <PageHeader
        title="LOCAL PLACES & ACTIVITIES"
        backPath="/manual-itinerary-builder"
        rightButton={{ label: "CONTINUE TO REVIEW →", onClick: () => router.push("/manual-itinerary-builder/review") }}
      />

      <div className="max-w-7xl mx-auto p-3 md:p-6 bg-white border-b-4 border-black">
        <div className="flex flex-col lg:flex-row gap-3 md:gap-4 items-stretch lg:items-end">
          <div className="flex-1">
            <label className="text-[10px] md:text-xs font-bold text-black mb-1 block uppercase">Type of Place</label>
            <Input
              placeholder="Temples, Parks, Beaches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-2 border-black font-bold text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="text-[10px] md:text-xs font-bold text-black mb-1 block uppercase">Location</label>
            <Input
              placeholder="Location (City/Area)"
              value={searchLocation}
              disabled
              className="border-2 border-black font-bold bg-gray-100 text-sm"
            />
          </div>
          <Button
            onClick={fetchPlaces}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white font-bold border-2 border-black h-10 px-4 md:px-6 text-sm"
          >
            <Search className="w-4 h-4 mr-1 md:mr-2" />
            SEARCH
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-3 md:p-6 grid lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white border-4 border-black p-4 md:p-6">
          <h3 className="text-base md:text-lg font-black text-black mb-4 uppercase flex items-center gap-2">
            <MapPin className="w-4 h-4 md:w-5 md:h-5" />
            Available Places
          </h3>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            <Input
              placeholder="Filter results..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 md:pl-10 border-2 border-black font-bold text-sm"
            />
          </div>

          {loading && <LoadingSpinner message="Searching places..." color="text-purple-500" />}

          <div className="max-h-[50vh] md:max-h-[500px] overflow-y-auto w-full">
            <PlaceList
              items={filtered}
              selectedIds={selectedPlaces.map(p => p.id)}
              onAdd={handleAdd}
            />
            {!loading && places.length === 0 && (
              <div className="text-center py-8 md:py-12">
                <MapPin className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 font-bold text-sm md:text-base">No places found</p>
                <p className="text-gray-500 text-xs md:text-sm">Try searching for a type of place above</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border-4 border-black p-4 md:p-6">
          <h3 className="text-base md:text-lg font-black text-black mb-4 uppercase">Your Selected Places</h3>

          {selectedPlaces.length > 0 ? (
            <div className="max-h-[50vh] md:max-h-[500px] overflow-y-auto">
              <PlaceList
                items={selectedPlaces}
                selectedIds={selectedPlaces.map(p => p.id)}
                onAdd={() => { }}
                onRemove={handleRemove}
                showRemove
              />
            </div>
          ) : (
            <div className="text-center py-8 md:py-12">
              <MapPin className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-black font-bold uppercase text-sm md:text-base">No places selected yet</p>
              <p className="text-gray-600 text-xs md:text-sm">Search and add places you want to visit</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

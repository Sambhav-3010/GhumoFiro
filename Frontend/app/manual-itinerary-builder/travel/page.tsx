"use client";

import { useState, useEffect } from "react";
import { Plane, Train, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { PageHeader, TravelList, LoadingSpinner, TravelItem } from "@/components/itinerary";
import { getAirportIataByName, getStationCodeByName } from "@/lib/cityUtils";
import { parsePrice } from "@/lib/formatUtils";

export default function TravelPage() {
  const router = useRouter();
  const [selectedTravel, setSelectedTravel] = useState<TravelItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<TravelItem[]>([]);
  const [travelMode, setTravelMode] = useState<"flight" | "train" | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedSelections = localStorage.getItem("travel-selections");
    if (savedSelections) setSelectedTravel(JSON.parse(savedSelections));

    const savedTrip = JSON.parse(localStorage.getItem("trip-details") || "{}");
    const mode = savedTrip.travelMode || "flight"; // Default to flight if missing (legacy)
    setTravelMode(mode);

    if (savedTrip.destination && savedTrip.source && savedTrip.startDate) {
      if (mode === "flight") {
        fetchFlights(savedTrip);
      } else {
        fetchTrains(savedTrip);
      }
    }
  }, []);

  const fetchFlights = async (saved: any) => {
    setLoading(true);
    try {
      const departureId = getAirportIataByName(saved.source);
      const arrivalId = getAirportIataByName(saved.destination);

      if (!departureId || !arrivalId) {
        console.error("Invalid airport codes");
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/flights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          departure_id: departureId,
          arrival_id: arrivalId,
          outbound_date: saved.startDate,
          return_date: saved.endDate,
        }),
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok && (data?.best_flights || data?.other_flights)) {
        let allFlights = data?.best_flights || [];
        if (allFlights.length === 0) allFlights = (data?.other_flights || []).slice(0, 10);

        const googleFlightsUrl = data.search_metadata?.google_flights_url;

        const mappedFlights = allFlights.map((flight: any, index: number) => {
          const firstSeg = flight.flights[0];
          const lastSeg = flight.flights[flight.flights.length - 1];
          // Try to find a booking token or link, otherwise fallback to main search
          const bookingLink = flight.booking_token ? `https://www.google.com/flights?tfs=${flight.booking_token}` : googleFlightsUrl;

          return {
            id: `flight-${index}`,
            type: "flight",
            title: `${firstSeg.departure_airport?.name || "Unknown"} → ${lastSeg.arrival_airport?.name || "Unknown"}`,
            description: `${firstSeg.airline || "Unknown"} ${firstSeg.flight_number || ""}`,
            price: `₹${Number(flight.price || 0).toLocaleString()}`,
            duration: `${flight.total_duration || 0} mins`,
            departure: firstSeg.departure_airport?.name || "Unknown",
            arrival: lastSeg.arrival_airport?.name || "Unknown",
            type_flight: flight.type || "One Way",
            link: bookingLink
          };
        });
        setResults(mappedFlights);
      }
    } catch (error) {
      console.error("Error fetching flights:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrains = async (saved: any) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/trains`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: saved.source,
          to: saved.destination,
          date: saved.startDate
        }),
        credentials: "include"
      });

      const data = await response.json();
      if (response.ok && data?.trains) {
        const trainsWithFares = await Promise.all(data.trains.slice(0, 10).map(async (train: any, index: number) => {
          const trainNumMatch = train.snippet.match(/(\d{5})/);
          let farePrice = "Check availability";

          if (trainNumMatch) {
            try {
              const fareRes = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/trainfare?trainno=${trainNumMatch[0]}&from=${encodeURIComponent(saved.source)}&to=${encodeURIComponent(saved.destination)}&date=${encodeURIComponent(saved.startDate)}`,
                { method: "GET", credentials: "include" }
              );
              const fareData = await fareRes.json();
              if (fareRes.ok && fareData.fareInfo) {
                const fareText = fareData.fareInfo.find((info: any) => info.type === 'paragraph')?.snippet || "";
                const prices = fareText.match(/₹[\d,]+/g);
                if (prices && prices.length > 0) {
                  farePrice = `${prices[0]}${prices.length > 1 ? ' - ' + prices[prices.length - 1] : ''}`;
                } else {
                  farePrice = "View Details";
                }
              }
            } catch (e) {
              console.error("Error fetching fare for train", trainNumMatch[0], e);
            }
          }

          return {
            id: `train-${index}`,
            type: "train",
            title: train.title,
            description: train.snippet,
            price: farePrice,
            duration: "See details",
            departure: saved.source,
            arrival: saved.destination,
            link: train.link
          };
        }));
        setResults(trainsWithFares);
      }
    } catch (error) {
      console.error("Error fetching trains:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTravel = (item: TravelItem) => {
    if (selectedTravel.find((t) => t.id === item.id)) return;
    const updated = [...selectedTravel, item];
    setSelectedTravel(updated);
    localStorage.setItem("travel-selections", JSON.stringify(updated));

    const progress = JSON.parse(localStorage.getItem("trip-progress") || "[]");
    if (!progress.includes("travel")) {
      progress.push("travel");
      localStorage.setItem("trip-progress", JSON.stringify(progress));
    }
  };

  const handleRemoveTravel = (id: string) => {
    const updated = selectedTravel.filter((item) => item.id !== id);
    setSelectedTravel(updated);
    localStorage.setItem("travel-selections", JSON.stringify(updated));
  };

  const filteredResults = results.filter((item) =>
    (item.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (item.description?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const totalCost = selectedTravel.reduce((sum, item) => sum + parsePrice(item.price), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-red-600 to-orange-500">
      <PageHeader
        title="TRAVEL SELECTION"
        backPath="/manual-itinerary-builder"
        rightButton={{ label: "CONTINUE TO HOTELS →", onClick: () => router.push("/manual-itinerary-builder/hotels") }}
      />

      <div className="max-w-7xl mx-auto p-3 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white border-4 border-black p-4 md:p-6">
            <h3 className="text-base md:text-lg font-black text-black mb-4 uppercase flex items-center gap-2">
              {travelMode === 'flight' ? <Plane className="w-5 h-5" /> : <Train className="w-5 h-5" />}
              Available {travelMode === 'flight' ? 'Flights' : 'Trains'}
            </h3>

            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                <Input
                  placeholder={`SEARCH ${travelMode === 'flight' ? 'FLIGHTS' : 'TRAINS'}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 md:pl-10 border-2 border-black font-bold text-sm"
                />
              </div>
            </div>

            {loading && <LoadingSpinner message={`Loading ${travelMode === 'flight' ? 'flights' : 'trains'}...`} />}

            <div className="max-h-[50vh] md:max-h-96 overflow-y-auto">
              <TravelList
                items={filteredResults}
                selectedIds={selectedTravel.map(t => t.id)}
                onAdd={handleAddTravel}
              />
              {!loading && filteredResults.length === 0 && (
                <div className="text-center py-8">
                  {travelMode === 'flight' ? (
                    <Plane className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
                  ) : (
                    <Train className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
                  )}
                  <p className="text-gray-600 font-bold text-sm md:text-base">No {travelMode}s found</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border-4 border-black p-4 md:p-6">
            <h3 className="text-base md:text-lg font-black text-black mb-4 uppercase">Your Selected Travel</h3>

            {selectedTravel.length > 0 ? (
              <div className="space-y-3 md:space-y-4">
                <TravelList
                  items={selectedTravel}
                  selectedIds={selectedTravel.map(t => t.id)}
                  onAdd={() => { }}
                  onRemove={handleRemoveTravel}
                  showRemove
                />
                <div className="pt-3 md:pt-4 border-t-2 border-black">
                  <div className="flex justify-between items-center">
                    <span className="text-black font-bold uppercase text-sm md:text-base">Total Travel Cost:</span>
                    <span className="text-lg md:text-xl font-black text-black">₹{totalCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 md:py-12">
                {travelMode === 'flight' ? (
                  <Plane className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
                ) : (
                  <Train className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
                )}
                <p className="text-black font-bold uppercase text-sm md:text-base">No travel selected yet</p>
                <p className="text-gray-600 text-xs md:text-sm">Choose from available options</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client"

import { motion } from "framer-motion"
import { Hotel, Plus, Check, Star, MapPin, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatRating } from "@/lib/formatUtils"

export interface HotelItem {
    thumbnail?: string | null
    id: string
    title: string
    description?: string
    price: number
    rating: string | number
    amenities: string[]
    location: string
}

interface HotelCardProps {
    item: HotelItem
    isSelected: boolean
    onAdd: (item: HotelItem) => void
    onRemove?: (id: string) => void
    showRemove?: boolean
}

export function HotelCard({ item, isSelected, onAdd, onRemove, showRemove = false }: HotelCardProps) {
    return (
        <div className={`border-2 border-black p-3 md:p-4 ${isSelected && !showRemove ? "bg-green-100" : "bg-gray-50"}`}>
            <div className="flex gap-2 md:gap-3">
                {showRemove && (
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-green-500 border-2 border-black flex items-center justify-center flex-shrink-0">
                        <Hotel className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    </div>
                )}
                {item.thumbnail && !showRemove && (
                    <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-16 h-16 md:w-20 md:h-20 object-cover border-2 border-black flex-shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                )}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-black text-black uppercase text-xs md:text-sm truncate">{item.title}</h4>
                        {isSelected && !showRemove && (
                            <span className="bg-green-500 text-white text-[10px] md:text-xs px-1.5 py-0.5 font-bold flex-shrink-0">
                                ✓ ADDED
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] md:text-xs text-gray-600 mb-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="font-bold">{formatRating(item.rating)}</span>
                    </div>
                    <p className="text-[10px] md:text-xs text-gray-600 font-bold mb-1 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        {item.location || "Address not available"}
                    </p>
                    <div className="bg-yellow-400 border border-black px-1.5 py-0.5 md:px-2 md:py-1 text-[10px] md:text-xs font-bold inline-block">
                        {item.price > 0 ? `₹${item.price.toLocaleString()}` : "N/A"}
                    </div>
                    {item.amenities?.length > 0 && !showRemove && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {item.amenities.slice(0, 2).map((a) => (
                                <span key={a} className="bg-blue-100 text-[10px] md:text-xs px-1.5 py-0.5 font-bold">
                                    {a}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {showRemove && onRemove ? (
                    <Button
                        onClick={() => onRemove(item.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold border-2 border-black w-7 h-7 md:w-8 md:h-8 p-0 flex-shrink-0"
                    >
                        <X className="w-3 h-3 md:w-4 md:h-4" />
                    </Button>
                ) : (
                    <Button
                        onClick={() => onAdd(item)}
                        className={`font-bold border-2 border-black w-8 h-8 md:w-10 md:h-10 p-0 flex-shrink-0 ${isSelected
                                ? "bg-green-500 text-white"
                                : "bg-yellow-400 hover:bg-yellow-500 text-black"
                            }`}
                    >
                        {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </Button>
                )}
            </div>
        </div>
    )
}

interface HotelListProps {
    items: HotelItem[]
    selectedTitles: string[]
    onAdd: (item: HotelItem) => void
    onRemove?: (id: string) => void
    showRemove?: boolean
}

export function HotelList({ items, selectedTitles, onAdd, onRemove, showRemove = false }: HotelListProps) {
    const isSelected = (title: string) => selectedTitles.includes(title)

    return (
        <div className="space-y-3">
            {items.map((item, index) => (
                <motion.div
                    key={item.id + index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <HotelCard
                        item={item}
                        isSelected={isSelected(item.title)}
                        onAdd={onAdd}
                        onRemove={onRemove}
                        showRemove={showRemove}
                    />
                </motion.div>
            ))}
        </div>
    )
}

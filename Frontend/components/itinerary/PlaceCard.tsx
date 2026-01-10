"use client"

import { motion } from "framer-motion"
import { MapPin, Phone, Plus, Star, Check, Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatRating, formatReviews } from "@/lib/formatUtils"

export interface PlaceItem {
    id: string
    title: string
    description?: string
    rating: number
    reviews: number
    address: string
    phone?: string
    hours?: string
    website?: string
    directions?: string
}

interface PlaceCardProps {
    item: PlaceItem
    isSelected: boolean
    onAdd: (item: PlaceItem) => void
    onRemove?: (id: string) => void
    showRemove?: boolean
}

export function PlaceCard({ item, isSelected, onAdd, onRemove, showRemove = false }: PlaceCardProps) {
    return (
        <div className={`border-2 border-black p-3 md:p-4 ${isSelected && !showRemove ? "bg-green-100" : "bg-gray-50"}`}>
            <div className="flex justify-between gap-2">
                <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
                    {showRemove && (
                        <div className="w-7 h-7 md:w-8 md:h-8 bg-purple-500 border-2 border-black flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h4 className="font-bold text-black text-sm break-words">{item.title}</h4>
                            {isSelected && !showRemove && (
                                <span className="bg-green-500 text-white text-[10px] md:text-xs px-1.5 py-0.5 font-bold flex-shrink-0">
                                    ✓ ADDED
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] md:text-xs text-gray-600 mb-1 flex-wrap">
                            <Star className="w-3 h-3 text-yellow-500 fill-current flex-shrink-0" />
                            <span className="font-bold">{formatRating(item.rating)}</span>
                            <span>({formatReviews(item.reviews)} reviews)</span>
                        </div>
                        {item.description && !showRemove && (
                            <p className="text-[10px] md:text-xs text-gray-700 mb-1">{item.description}</p>
                        )}
                        <p className="text-[10px] md:text-xs text-gray-600 flex items-start gap-1">
                            <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
                            <span className="break-words">{item.address}</span>
                        </p>
                        {item.phone && !showRemove && (
                            <p className="text-[10px] md:text-xs text-gray-600 flex items-start gap-1 mt-1">
                                <Phone className="w-3 h-3 flex-shrink-0 mt-0.5" />
                                <span className="break-words">{item.phone}</span>
                            </p>
                        )}
                        {item.hours && !showRemove && (
                            <p className="text-[10px] md:text-xs text-gray-600 flex items-start gap-1 mt-1">
                                <Clock className="w-3 h-3 flex-shrink-0 mt-0.5" />
                                <span className="break-words">{item.hours}</span>
                            </p>
                        )}
                    </div>
                </div>

                {showRemove && onRemove ? (
                    <Button
                        onClick={() => onRemove(item.id)}
                        className="bg-red-500 hover:bg-red-600 border-2 border-black text-white w-7 h-7 md:w-8 md:h-8 p-0 flex-shrink-0"
                    >
                        <X className="w-3 h-3 md:w-4 md:h-4" />
                    </Button>
                ) : (
                    <Button
                        onClick={() => onAdd(item)}
                        disabled={isSelected}
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

interface PlaceListProps {
    items: PlaceItem[]
    selectedIds: string[]
    onAdd: (item: PlaceItem) => void
    onRemove?: (id: string) => void
    showRemove?: boolean
}

export function PlaceList({ items, selectedIds, onAdd, onRemove, showRemove = false }: PlaceListProps) {
    const isSelected = (id: string) => selectedIds.includes(id)

    return (
        <div className="space-y-3">
            {items.map((item) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <PlaceCard
                        item={item}
                        isSelected={isSelected(item.id)}
                        onAdd={onAdd}
                        onRemove={onRemove}
                        showRemove={showRemove}
                    />
                </motion.div>
            ))}
        </div>
    )
}

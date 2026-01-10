"use client"

import { motion } from "framer-motion"
import { Plane, Train, Plus, Check, Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface TravelItem {
    id: string
    type: "flight" | "train"
    title: string
    description: string
    price: string
    duration: string
    departure: string
    arrival: string
    type_flight?: string
    trainNumber?: string
}

interface TravelCardProps {
    item: TravelItem
    isSelected: boolean
    onAdd: (item: TravelItem) => void
    onRemove?: (id: string) => void
    showRemove?: boolean
}

export function TravelCard({ item, isSelected, onAdd, onRemove, showRemove = false }: TravelCardProps) {
    return (
        <div className={`border-2 border-black p-3 md:p-4 ${isSelected && !showRemove ? "bg-green-100" : "bg-gray-50"}`}>
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
                    {showRemove && (
                        <div className={`w-7 h-7 md:w-8 md:h-8 border-2 border-black flex items-center justify-center flex-shrink-0 ${item.type === "flight" ? "bg-blue-500" : "bg-green-500"
                            }`}>
                            {item.type === "flight" ? (
                                <Plane className="w-3 h-3 md:w-4 md:h-4 text-white" />
                            ) : (
                                <Train className="w-3 h-3 md:w-4 md:h-4 text-white" />
                            )}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                            {!showRemove && (
                                item.type === "flight" ? (
                                    <Plane className="w-4 h-4 md:w-5 md:h-5 text-blue-500 flex-shrink-0" />
                                ) : (
                                    <Train className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                                )
                            )}
                            <h4 className="font-black text-black uppercase text-xs md:text-sm truncate">
                                {item.title}
                            </h4>
                            {isSelected && !showRemove && (
                                <span className="bg-green-500 text-white text-[10px] md:text-xs px-1.5 py-0.5 md:px-2 md:py-1 font-bold flex-shrink-0">
                                    ✓ SELECTED
                                </span>
                            )}
                        </div>
                        <p className="text-xs md:text-sm text-black font-medium mb-2 truncate">
                            {item.description}
                        </p>
                        <div className="flex flex-wrap gap-1 md:gap-2 text-[10px] md:text-xs text-black font-bold">
                            <span className="bg-yellow-400 px-1.5 py-0.5 md:px-2 md:py-1">
                                {item.price}
                            </span>
                            <span className="bg-gray-200 px-1.5 py-0.5 md:px-2 md:py-1 flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                {item.duration}
                            </span>
                            {item.type === "flight" && item.type_flight && (
                                <span className="bg-blue-100 px-1.5 py-0.5 md:px-2 md:py-1">
                                    {item.type_flight}
                                </span>
                            )}
                        </div>
                    </div>
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

interface TravelListProps {
    items: TravelItem[]
    selectedIds: string[]
    onAdd: (item: TravelItem) => void
    onRemove?: (id: string) => void
    showRemove?: boolean
}

export function TravelList({ items, selectedIds, onAdd, onRemove, showRemove = false }: TravelListProps) {
    const isSelected = (id: string) => selectedIds.includes(id)

    return (
        <div className="space-y-3">
            {items.map((item) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <TravelCard
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

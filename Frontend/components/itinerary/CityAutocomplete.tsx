"use client"

import { Plane, Train, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { CityOption, filterCities } from "@/lib/cityUtils"

interface CityAutocompleteProps {
    value: string
    onChange: (value: string) => void
    onSelect: (city: CityOption) => void
    cities: CityOption[]
    placeholder: string
    showDropdown: boolean
    setShowDropdown: (show: boolean) => void
    className?: string
}

export function CityAutocomplete({
    value,
    onChange,
    onSelect,
    cities,
    placeholder,
    showDropdown,
    setShowDropdown,
    className = ""
}: CityAutocompleteProps) {
    const filtered = filterCities(value, cities)

    return (
        <div className="relative">
            <div className="relative">
                <Input
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value)
                        setShowDropdown(true)
                    }}
                    onFocus={() => setShowDropdown(true)}
                    className={`border-2 border-black text-black font-medium h-10 md:h-12 text-sm md:text-lg pr-10 ${className}`}
                />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            {showDropdown && (
                <div className="absolute z-20 w-full bg-white border-2 border-black mt-1 max-h-48 overflow-y-auto">
                    {filtered.map((city, idx) => (
                        <div
                            key={`${city.code}-${idx}`}
                            onClick={() => onSelect(city)}
                            className="p-3 hover:bg-yellow-100 cursor-pointer flex items-center justify-between border-b border-gray-200"
                        >
                            <div className="flex items-center gap-2">
                                {city.type === "airport" ? (
                                    <Plane className="w-4 h-4 text-blue-500" />
                                ) : (
                                    <Train className="w-4 h-4 text-green-600" />
                                )}
                                <span className="font-medium text-black">{city.name}</span>
                            </div>
                            <span className="text-xs bg-gray-200 px-2 py-1 font-bold">{city.code}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

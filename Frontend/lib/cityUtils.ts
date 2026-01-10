import airportsData from "@/components/airport.json"
import stationsData from "@/components/stations.json"

export interface CityOption {
    name: string
    code: string
    type: "airport" | "station"
}

const airports = airportsData as Record<string, { city: string; iata: string | null; name: string }>
const stations = stationsData as Record<string, { code: string; name: string }>

const capitalizeCity = (str: string): string => {
    return str
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ")
}

export const getAllCities = (): CityOption[] => {
    const cities: CityOption[] = []

    Object.entries(airports).forEach(([_, airport]) => {
        if (airport.iata && airport.city) {
            cities.push({
                name: capitalizeCity(airport.city),
                code: airport.iata.toUpperCase(),
                type: "airport"
            })
        }
    })

    Object.entries(stations).forEach(([cityName, station]) => {
        cities.push({
            name: capitalizeCity(cityName),
            code: station.code.toUpperCase(),
            type: "station"
        })
    })

    const uniqueCities = cities.reduce((acc, curr) => {
        const key = curr.name.toLowerCase()
        if (!acc[key]) {
            acc[key] = curr
        }
        return acc
    }, {} as Record<string, CityOption>)

    return Object.values(uniqueCities).sort((a, b) => a.name.localeCompare(b.name))
}

export const filterCities = (search: string, allCities: CityOption[]): CityOption[] => {
    if (!search) return allCities.slice(0, 10)
    const lowerSearch = search.toLowerCase()
    return allCities
        .filter(city =>
            city.name.toLowerCase().includes(lowerSearch) ||
            city.code.toLowerCase().includes(lowerSearch)
        )
        .slice(0, 10)
}

export const getAirportIataByName = (city: string): string | null => {
    const lowerName = city.toLowerCase()
    for (const iata in airports) {
        const ap = airports[iata]
        if (ap.city.toLowerCase().includes(lowerName)) {
            return ap.iata || null
        }
    }
    return null
}

export const getStationCodeByName = (city: string): string | null => {
    const lowerName = city.toLowerCase().trim()
    for (const key in stations) {
        if (key.toLowerCase().includes(lowerName) || lowerName.includes(key.toLowerCase())) {
            return stations[key].code
        }
    }
    return null
}

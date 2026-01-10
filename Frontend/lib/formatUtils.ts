export const parsePrice = (price: any): number => {
    if (!price) return 0
    if (typeof price === "number") return price
    const cleaned = String(price).replace(/[₹,\s]/g, "").split("-")[0]
    const parsed = Number(cleaned)
    return isNaN(parsed) ? 0 : parsed
}

export const formatPrice = (price: any): string => {
    const num = parsePrice(price)
    if (num === 0) return "Free"
    return `₹${num.toLocaleString()}`
}

export const formatRating = (rating: any): string => {
    if (!rating || rating === 0) return "N/A"
    const num = Number(rating)
    if (isNaN(num)) return "N/A"
    return num.toFixed(1)
}

export const formatReviews = (reviews: number): string => {
    if (!reviews || isNaN(reviews)) return "0"
    return reviews.toLocaleString()
}

export const calculateDuration = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

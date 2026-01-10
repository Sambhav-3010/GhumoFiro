"use client"

import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
    message?: string
    size?: "sm" | "md" | "lg"
    color?: string
}

export function LoadingSpinner({
    message = "Loading...",
    size = "md",
    color = "text-red-500"
}: LoadingSpinnerProps) {
    const sizeClass = {
        sm: "w-4 h-4 md:w-6 md:h-6",
        md: "w-6 h-6 md:w-8 md:h-8",
        lg: "w-8 h-8 md:w-12 md:h-12"
    }

    return (
        <div className="flex items-center justify-center py-8">
            <Loader2 className={`${sizeClass[size]} animate-spin ${color}`} />
            <span className="ml-2 font-bold text-black text-sm md:text-base">{message}</span>
        </div>
    )
}

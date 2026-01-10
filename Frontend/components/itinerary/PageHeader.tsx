"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface PageHeaderProps {
    title: string
    backPath: string
    rightButton?: {
        label: string
        onClick: () => void
        variant?: "yellow" | "green" | "white"
    }
}

export function PageHeader({ title, backPath, rightButton }: PageHeaderProps) {
    const router = useRouter()

    const getButtonClass = (variant?: string) => {
        switch (variant) {
            case "green":
                return "bg-green-500 hover:bg-green-600 text-white"
            case "white":
                return "bg-white hover:bg-gray-100 text-black"
            default:
                return "bg-yellow-400 hover:bg-yellow-500 text-black"
        }
    }

    return (
        <div className="bg-black p-3 md:p-4">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 md:gap-4">
                    <Button
                        onClick={() => router.push(backPath)}
                        className="bg-white hover:bg-gray-100 text-black font-bold border-2 border-white text-xs md:text-sm px-2 md:px-4"
                    >
                        <ArrowLeft className="w-4 h-4 md:mr-2" />
                        <span className="hidden md:inline">BACK</span>
                    </Button>
                    <div className="text-white text-base md:text-2xl font-bold">{title}</div>
                </div>
                {rightButton && (
                    <Button
                        onClick={rightButton.onClick}
                        className={`${getButtonClass(rightButton.variant)} font-bold border-2 border-white text-xs md:text-sm flex items-center justify-center gap-1`}
                    >
                        {rightButton.label}
                    </Button>
                )}
            </div>
        </div>
    )
}

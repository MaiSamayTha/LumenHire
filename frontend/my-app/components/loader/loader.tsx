import { cn } from "@/lib/utils"

interface LoaderProps {
  variant?: "spinner" | "dots" | "pulse" | "bars" | "ring"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Loader({ variant = "spinner", size = "md", className }: LoaderProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  const baseClasses = cn(sizeClasses[size], className)

  switch (variant) {
    case "spinner":
      return <div className={cn("animate-spin rounded-full border-2 border-gray-300 border-t-blue-600", baseClasses)} />

    case "dots":
      return (
        <div className={cn("flex space-x-1", className)}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "rounded-full bg-blue-600 animate-pulse",
                size === "sm" ? "w-1 h-1" : size === "md" ? "w-2 h-2" : "w-3 h-3",
              )}
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: "1s",
              }}
            />
          ))}
        </div>
      )

    case "pulse":
      return <div className={cn("rounded-full bg-blue-600 animate-pulse", baseClasses)} />

    case "bars":
      return (
        <div className={cn("flex space-x-1", className)}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                "bg-blue-600 animate-pulse",
                size === "sm" ? "w-1 h-4" : size === "md" ? "w-1.5 h-6" : "w-2 h-8",
              )}
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: "0.8s",
              }}
            />
          ))}
        </div>
      )

    case "ring":
      return (
        <div className={cn("relative", baseClasses)}>
          <div className="absolute inset-0 rounded-full border-2 border-gray-300" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-600 animate-spin" />
        </div>
      )

    default:
      return <div className={cn("animate-spin rounded-full border-2 border-gray-300 border-t-blue-600", baseClasses)} />
  }
}

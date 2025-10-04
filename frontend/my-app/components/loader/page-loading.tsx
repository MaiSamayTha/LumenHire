import { Loader } from "./loader"

interface PageLoaderProps {
  message?: string
  variant?: "spinner" | "dots" | "pulse" | "bars" | "ring"
}

export function PageLoader({ message = "Loading...", variant = "spinner" }: PageLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <Loader variant={variant} size="lg" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

import type React from "react"
import { Button } from "@/components/ui/button"
import { Loader } from "./loader"
import { cn } from "@/lib/utils"

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  loadingText?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function LoadingButton({
  children,
  loading = false,
  loadingText = "Loading...",
  className,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button className={cn(className)} disabled={loading || disabled} {...props}>
      {loading && <Loader variant="spinner" size="sm" className="mr-2" />}
      {loading ? loadingText : children}
    </Button>
  )
}

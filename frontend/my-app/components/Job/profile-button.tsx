"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { logoutUser ,checkRole} from "@/data/common"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Settings, LogOut, Bell, HelpCircle, Shield, CreditCard, ChevronDown } from "lucide-react"

interface UserProfile {
  name: string
  email: string
  avatar?: string
  role?: string
  status?: "online" | "away" | "busy" | "offline"
}

interface ProfileButtonProps {
 
  variant?: "default" | "minimal" | "compact" | "detailed"
  showStatus?: boolean
  showDropdown?: boolean
 
  className?: string

}

export function ProfileButton({
 
  variant = "default",

  showDropdown = true,
  className,
 
}: ProfileButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
const router=useRouter()
  const getStatusColor = (status: UserProfile["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "busy":
        return "bg-red-500"
      case "offline":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  
  const toProfile=()=>{
    if(checkRole()=='CANDIDATE')
    router.push("/userProfile")
    else
    router.push("/recruiterProfile")
  }
  const UserLogout=()=>{
    console.log("done")
    router.push("/")
    logoutUser();
  }
  const ProfileAvatar = () => (
    <div className="relative">
      <Avatar className={variant === "compact" ? "h-8 w-8" : "h-9 w-9"}>
        <AvatarImage src={  "/placeholder.svg"} alt={"user"} />
        <AvatarFallback className="bg-primary text-primary-foreground">{"USER"}</AvatarFallback>
      </Avatar>
      <div
          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${getStatusColor(
            "online",
          )}`}
        />
    </div>
  )

  // Minimal variant - just avatar
  if (variant === "minimal") {
    if (!showDropdown) {
      return (
        <Button variant="ghost" size="icon" onClick={toProfile} className={className} aria-label="Profile">
          <ProfileAvatar />
           <span className="text-sm font-medium">{"Profile"}</span>
        </Button>
      )
    }

    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className={className} aria-label="Profile menu">
            <ProfileAvatar />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={toProfile}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={UserLogout} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Compact variant - avatar + name
  if (variant === "compact") {
    const content = (
      <div className="flex items-center space-x-2">
        <ProfileAvatar />
       
        {showDropdown && <ChevronDown className="h-4 w-4" />}
      </div>
    )

    if (!showDropdown) {
      return (
        <Button variant="ghost" onClick={toProfile} className={className}>
          {content}
        </Button>
      )
    }

    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className={className}>
            {content}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
             
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={toProfile}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={UserLogout} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Detailed variant - full profile info
  if (variant === "detailed") {
    const content = (
      <div className="flex items-center space-x-3">
        <ProfileAvatar />
        <div className="flex flex-col">
          <span className="text-sm font-medium">{"profile"}</span>

        </div>
        
        {showDropdown && <ChevronDown className="h-4 w-4" />}
      </div>
    )

    if (!showDropdown) {
      return (
        <Button variant="ghost" onClick={toProfile} className={`justify-start ${className}`}>
          {content}
        </Button>
      )
    }

    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className={`justify-start ${className}`}>
            {content}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>
            <div className="flex items-center space-x-3">
              <ProfileAvatar />
              <div className="flex flex-col space-y-1">
                
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={toProfile}>
            <User className="mr-2 h-4 w-4" />
            View Profile
          </DropdownMenuItem>
         
        
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={UserLogout} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Default variant
  const content = (
    <div className="flex items-center space-x-2">
      <ProfileAvatar />
      <span className="text-sm font-medium">{"profile"}</span>
      {showDropdown && <ChevronDown className="h-4 w-4" />}
    </div>
  )

  if (!showDropdown) {
    return (
      <Button variant="ghost" onClick={toProfile} className={className}>
        {content}
      </Button>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={className}>
          {content}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
       
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={toProfile}>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
       
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={UserLogout} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

'use client'

import { JwtResponse } from '@/data/common'
import { createContext, useContext, useState } from 'react'
const defaultContext: AuthContextType = {
  USER: null,
  changeUser: () => {}
}
type AuthContextType = {
  USER: JwtResponse | null
  changeUser: (payload: JwtResponse | null) => void
}
const AuthContext = createContext<AuthContextType>(defaultContext)
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [USER, setUSER] = useState<JwtResponse | null>(null)

    const changeUser=(payload:JwtResponse|null)=>{
        setUSER(payload)
    }
    
  return (
    <AuthContext.Provider value={{ USER, changeUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

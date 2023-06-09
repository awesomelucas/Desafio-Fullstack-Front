import { ReactNode, createContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

import { LoginData } from "../pages/Login/validator"
import { api } from "../services/api";

interface AuthProviderProps {
  children: ReactNode
}

interface AuthContextValues {
  signIn: (data: LoginData) => void
  loading: boolean
}

export const AuthContext = createContext<AuthContextValues>({} as AuthContextValues);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("your-token:token")

    if(!token) {
      setLoading(false)
      return
    }

    api.defaults.headers.common.authorization = `Bearer ${token}`
    setLoading(false)
  }, [])

  const signIn = async (data: LoginData) => {
    
    try {
      const response = await api.post("/login", {...data})

      api.defaults.headers.common.authorization = `Bearer ${response.data.login}`
      localStorage.setItem("your-token:token", response.data.login)

      navigate('dashboard')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
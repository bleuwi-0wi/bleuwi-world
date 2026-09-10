// BLEUWI WORLD - Global Authentication Context with 2FA
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState('login') // 'login' | 'signup'
  const [userOrdersModalOpen, setUserOrdersModalOpen] = useState(false)

  // Verify session on mount
  const checkAuth = useCallback(async () => {
    try {
      const currentUser = await api.getMe()
      setUser(currentUser)
    } catch (e) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const login = async (identifier, password) => {
    const res = await api.login(identifier, password)
    // If 2FA is required, we do NOT set the user yet — modal will show 2FA screen
    if (res && res.user && !res.requires2FA) {
      setUser(res.user)
      setAuthModalOpen(false)
    }
    return res
  }

  const verify2FA = async (preAuthToken, code) => {
    const res = await api.verify2FA(preAuthToken, code)
    if (res && res.user) {
      setUser(res.user)
      setAuthModalOpen(false)
    }
    return res
  }

  const resend2FA = async (preAuthToken) => {
    return await api.resend2FA(preAuthToken)
  }

  const signup = async (formData) => {
    const res = await api.signup(formData)
    if (res && res.user) {
      setUser(res.user)
      setAuthModalOpen(false)
    }
    return res
  }

  const logout = () => {
    api.logout()
    setUser(null)
    if (window.location.search.includes('view=admin')) {
      window.history.pushState({}, '', window.location.pathname)
      window.location.reload()
    }
  }

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab)
    setAuthModalOpen(true)
  }

  const closeAuthModal = () => {
    setAuthModalOpen(false)
  }

  const openUserOrdersModal = () => {
    setUserOrdersModalOpen(true)
  }

  const closeUserOrdersModal = () => {
    setUserOrdersModalOpen(false)
  }

  const isAdmin = user?.role === 'admin'

  const value = {
    user,
    loading,
    isAdmin,
    login,
    verify2FA,
    resend2FA,
    signup,
    logout,
    refreshUser: checkAuth,
    authModalOpen,
    authModalTab,
    openAuthModal,
    closeAuthModal,
    userOrdersModalOpen,
    openUserOrdersModal,
    closeUserOrdersModal,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

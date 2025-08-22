import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, User, Menu, Globe } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { useAuthStore } from '../../lib/stores/authStore'
import { Badge } from '../ui/Badge'
import { useTranslation } from 'react-i18next'
import { MiniCartToggle } from '../ui/MiniCart'

export function Header() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuthStore()
  const [searchQuery, setSearchQuery] = React.useState('')
  const { t, i18n } = useTranslation()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const changeLanguage = (lng: 'en' | 'ar') => {
    i18n.changeLanguage(lng);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">M</span>
          </div>
          <span className="font-bold text-xl">MotoGear</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute start-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('header.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-10 pe-4"
            />
          </div>
        </form>

        {/* Navigation Icons */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Language Switcher */}
          <div className="relative group">
            <Button variant="ghost" size="icon" className="focus-ring" aria-label="Change language">
              <Globe className="h-5 w-5" />
            </Button>
            <div className="absolute end-0 top-full mt-2 w-32 bg-background border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-1">
                <Button variant={i18n.language === 'en' ? 'secondary' : 'ghost'} size="sm" className="w-full justify-start" onClick={() => changeLanguage('en')}>{t('languages.en')}</Button>
                <Button variant={i18n.language === 'ar' ? 'secondary' : 'ghost'} size="sm" className="w-full justify-start" onClick={() => changeLanguage('ar')}>{t('languages.ar')}</Button>
              </div>
            </div>
          </div>

          {/* Mini Cart Toggle */}
          <MiniCartToggle />

          {/* User Menu */}
          {isAuthenticated && user ? (
            <div className="relative group">
              <Button
                variant="ghost"
                size="icon"
                className="focus-ring"
                aria-label={t('header.userMenu')}
              >
                <User className="h-5 w-5" />
              </Button>
              
              {/* Dropdown Menu */}
              <div className="absolute end-0 top-full mt-2 w-48 bg-background border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  <div className="px-3 py-2 text-sm font-medium">
                    {user.name}
                  </div>
                  <div className="px-3 py-1 text-xs text-muted-foreground">
                    {user.email}
                  </div>
                  <div className="border-t mt-2 pt-2">
                    <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => navigate('/account')}>{t('header.myAccount')}</Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => navigate('/orders')}>{t('header.myOrders')}</Button>
                    {user.role === 'admin' && (
                      <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => navigate('/admin')}>{t('header.adminPanel')}</Button>
                    )}
                    <Button variant="ghost" size="sm" className="w-full justify-start text-destructive hover:text-destructive" onClick={handleLogout}>{t('header.signOut')}</Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/login')}
              className="focus-ring"
              aria-label={t('header.signIn')}
            >
              <User className="h-5 w-5" />
            </Button>
          )}

          {/* Mobile Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden focus-ring"
            aria-label={t('header.menu')}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden border-t p-4">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute start-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('header.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-10 pe-4"
            />
          </div>
        </form>
      </div>
    </header>
  )
}

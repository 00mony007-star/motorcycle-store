'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X,
  LogIn,
  UserPlus,
  Settings,
  LogOut
} from 'lucide-react'
import { useCartStore } from '@/lib/stores/cart-store'
import { CartDrawer } from '@/components/cart/cart-drawer'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const { itemCount } = useCartStore()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search results
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-orange-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="font-bold text-xl">MotoGear</span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/catalog" className="text-sm font-medium hover:text-orange-500 transition-colors">
              Catalog
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:text-orange-500 transition-colors">
              Categories
            </Link>
            <Link href="/brands" className="text-sm font-medium hover:text-orange-500 transition-colors">
              Brands
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-orange-500 transition-colors">
              About
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search motorcycle gear..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCartOpen(true)}
              className="relative"
              aria-label={`Shopping cart with ${itemCount} items`}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Button>

            {/* User Menu */}
            <div className="hidden md:flex items-center space-x-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/register">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </Link>
              </Button>
            </div>

            {/* Admin Link */}
            <Button asChild variant="ghost" size="sm" className="hidden md:flex">
              <Link href="/admin">
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Link>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="container px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="flex">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </form>

              {/* Mobile Navigation */}
              <nav className="space-y-2">
                <Link href="/catalog" className="block py-2 text-sm font-medium">
                  Catalog
                </Link>
                <Link href="/categories" className="block py-2 text-sm font-medium">
                  Categories
                </Link>
                <Link href="/brands" className="block py-2 text-sm font-medium">
                  Brands
                </Link>
                <Link href="/about" className="block py-2 text-sm font-medium">
                  About
                </Link>
              </nav>

              {/* Mobile Auth */}
              <div className="space-y-2 pt-4 border-t">
                <Link href="/login" className="block py-2 text-sm font-medium">
                  Login
                </Link>
                <Link href="/register" className="block py-2 text-sm font-medium">
                  Sign Up
                </Link>
                <Link href="/admin" className="block py-2 text-sm font-medium text-orange-500">
                  Admin Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
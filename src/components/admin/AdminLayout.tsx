import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { useAuthStore } from '../../lib/stores/authStore'
import { Button } from '../ui/Button'
import { LayoutDashboard, ShoppingBag, Tag, ListOrdered, FileJson, Settings, LogOut, Home } from 'lucide-react'
import { cn } from '../../lib/utils'

const adminNavItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/products', icon: ShoppingBag, label: 'Products' },
  { to: '/admin/categories', icon: Tag, label: 'Categories' },
  { to: '/admin/orders', icon: ListOrdered, label: 'Orders' },
  { to: '/admin/data', icon: FileJson, label: 'Data Mgmt' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
]

export function AdminLayout() {
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    // Navigate to home, NavLink will not work as it's outside router context
    window.location.href = '/'
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="hidden w-64 flex-col border-r bg-background sm:flex">
        <div className="flex h-16 items-center border-b px-6">
          <NavLink to="/" className="flex items-center gap-2 font-semibold">
            <div className="h-6 w-6 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">M</span>
            </div>
            <span>MotoGear Admin</span>
          </NavLink>
        </div>
        <nav className="flex-1 space-y-2 p-4">
          {adminNavItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) => cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                isActive && "bg-muted text-primary"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto p-4 border-t">
            <div className="text-sm font-semibold">{user?.name}</div>
            <div className="text-xs text-muted-foreground">{user?.email}</div>
            <div className="flex flex-col space-y-2 mt-2">
                <Button variant="ghost" size="sm" className="justify-start" asChild>
                    <a href="/" target="_blank" rel="noopener noreferrer"><Home className="mr-2 h-4 w-4"/>View Store</a>
                </Button>
                <Button variant="ghost" size="sm" className="justify-start text-destructive hover:text-destructive" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4"/>Sign Out
                </Button>
            </div>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

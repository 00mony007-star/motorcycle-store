import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuthStore } from '../lib/stores/authStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { User, MapPin, Package } from 'lucide-react'

export function AccountPage() {
  const { user, isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
        <p className="text-muted-foreground">Manage your account and view your orders.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <Link to="/account/profile">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader>
              <User className="h-8 w-8 text-primary mb-2" />
              <CardTitle>My Profile</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link to="/orders">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader>
              <Package className="h-8 w-8 text-primary mb-2" />
              <CardTitle>My Orders</CardTitle>
              <CardDescription>View your order history and status.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link to="/account/addresses">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader>
              <MapPin className="h-8 w-8 text-primary mb-2" />
              <CardTitle>My Addresses</CardTitle>
              <CardDescription>Manage your shipping addresses.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}

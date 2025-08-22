import React, { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuthStore } from '../lib/stores/authStore'
import { getApi } from '../lib/api'
import { Order } from '../lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Loader2 } from 'lucide-react'
import { formatCurrency, formatDate } from '../lib/utils'
import { Badge } from '../components/ui/Badge'

const api = getApi()

export function OrderHistoryPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return
      setIsLoading(true)
      try {
        const userOrders = await api.orders.list(user.id)
        setOrders(userOrders.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchOrders()
    }
  }, [user])

  if (authLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
          <CardDescription>Here is a list of your past orders.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map(order => (
                <Card key={order.id}>
                  <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Order #{order.number}</h3>
                      <p className="text-sm text-muted-foreground">Placed on {formatDate(new Date(order.createdAt))}</p>
                    </div>
                    <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>{order.status}</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <p className="font-bold">{formatCurrency(order.total)}</p>
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/order/${order.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold">No orders yet</h3>
              <p className="text-muted-foreground mt-2">You haven't placed any orders with us.</p>
              <Button asChild className="mt-4">
                <Link to="/category/all">Start Shopping</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

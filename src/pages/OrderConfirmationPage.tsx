import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getApi } from '../lib/api'
import { Order } from '../lib/types'
import { Loader2, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { formatCurrency } from '../lib/utils'
import { Separator } from '../components/ui/Separator'

const api = getApi()

export function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchOrder() {
      if (!id) return
      setIsLoading(true)
      try {
        const fetchedOrder = await api.orders.get(id)
        setOrder(fetchedOrder)
      } catch (error) {
        console.error("Failed to fetch order:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  if (isLoading) {
    return <div className="flex justify-center items-center h-[80vh]"><Loader2 className="h-12 w-12 animate-spin" /></div>
  }

  if (!order) {
    return <div className="text-center py-20">Order not found.</div>
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <CardTitle className="text-3xl">Thank You For Your Order!</CardTitle>
          <p className="text-muted-foreground">Your order #{order.number} has been placed successfully.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-sm space-y-4">
            <h3 className="font-semibold text-lg">Order Summary</h3>
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p>{item.productSnapshot.title}</p>
                  <p className="text-muted-foreground">Quantity: {item.quantity}</p>
                </div>
                <p>{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{formatCurrency(order.shipping)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>{formatCurrency(order.tax)}</span></div>
              <Separator />
              <div className="flex justify-between font-bold"><span>Total</span><span>{formatCurrency(order.total)}</span></div>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold text-lg mb-2">Shipping Address</h3>
            <div className="text-sm text-muted-foreground">
              <p>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
          <div className="text-center pt-4">
            <Button asChild>
              <Link to="/category/all">Continue Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../lib/stores/cartStore'
import { formatCurrency } from '../lib/utils'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/Card'
import { Separator } from '../components/ui/Separator'
import { X, Plus, Minus, Tag } from 'lucide-react'
import { getApi } from '../lib/api'
import { useToast } from '../hooks/use-toast'

const api = getApi()

export function CartPage() {
  const { cart, updateItemQuantity, removeItem, applyCoupon, removeCoupon } = useCartStore()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [couponCode, setCouponCode] = useState('')

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    updateItemQuantity(itemId, newQuantity)
  }
  
  const handleApplyCoupon = async () => {
    if (!couponCode) return
    try {
      const coupon = await api.coupons.getByCode(couponCode)
      if (coupon && coupon.active) {
        applyCoupon(coupon)
        toast({ title: "Success", description: `Coupon "${coupon.code}" applied.` })
      } else {
        toast({ variant: "destructive", title: "Error", description: "Invalid or expired coupon code." })
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not apply coupon." })
    }
  }

  const handleRemoveCoupon = () => {
    removeCoupon()
    toast({ title: "Coupon removed" })
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild>
          <Link to="/category/all">Start Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map(item => (
            <Card key={item.id} className="flex items-center p-4">
              <img src={item.productSnapshot.image} alt={item.productSnapshot.title} className="w-24 h-24 object-cover rounded-md mr-4" />
              <div className="flex-grow">
                <h3 className="font-semibold">{item.productSnapshot.title}</h3>
                <p className="text-sm text-muted-foreground">{item.productSnapshot.variantInfo}</p>
                <p className="text-sm font-medium mt-1">{formatCurrency(item.price)}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-md">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="font-semibold w-24 text-right">{formatCurrency(item.price * item.quantity)}</p>
                <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{cart.shipping === 0 ? 'Free' : formatCurrency(cart.shipping)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (8%)</span>
                <span>{formatCurrency(cart.tax)}</span>
              </div>
              
              <Separator />
              
              {!cart.couponCode ? (
                <div className="flex space-x-2">
                  <Input placeholder="Coupon Code" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} />
                  <Button onClick={handleApplyCoupon}>Apply</Button>
                </div>
              ) : (
                <div className="flex justify-between items-center text-sm text-green-600 dark:text-green-400">
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    <span>Coupon "{cart.couponCode}" applied</span>
                  </div>
                  <span>-{formatCurrency(cart.discount || 0)}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleRemoveCoupon}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <Separator />
              
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatCurrency(cart.total)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="lg" className="w-full" onClick={() => navigate('/checkout')}>
                Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

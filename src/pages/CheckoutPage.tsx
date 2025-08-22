import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCartStore } from '../lib/stores/cartStore'
import { useAuthStore } from '../lib/stores/authStore'
import { formatCurrency } from '../lib/utils'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/Label'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Separator } from '../components/ui/Separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs'
import { CreditCard, Landmark, Truck, Wallet } from 'lucide-react'
import { getApi } from '../lib/api'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../hooks/use-toast'
import { useTranslation } from 'react-i18next'
import { FaApplePay } from 'react-icons/fa'

const api = getApi()

const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  line1: z.string().min(5, "Address line is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(5, "Invalid postal code"),
  country: z.string().min(2, "Country is required"),
})

type AddressFormValues = z.infer<typeof addressSchema>

export function CheckoutPage() {
  const { cart, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { t } = useTranslation()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')

  const { register, handleSubmit, formState: { errors } } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      country: 'Saudi Arabia'
    }
  })

  const onSubmit = async (data: AddressFormValues) => {
    if (!cart) return
    setIsProcessing(true)
    try {
      const orderData = {
        userId: user?.id,
        items: cart.items,
        subtotal: cart.subtotal,
        shipping: cart.shipping,
        tax: cart.tax,
        total: cart.total,
        currency: 'SAR',
        payment: paymentMethod as any,
        shippingAddress: { id: '', ...data },
        billingAddress: { id: '', ...data },
      }
      const newOrder = await api.orders.create(orderData)
      toast({ title: "Order Placed!", description: `Your order #${newOrder.number} has been confirmed.` })
      clearCart()
      navigate(`/order/${newOrder.id}`)
    } catch (error) {
      toast({ variant: 'destructive', title: "Order Failed", description: "There was a problem placing your order." })
      setIsProcessing(false)
    }
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">{t('cartPage.emptyTitle')}</h1>
        <p className="text-muted-foreground">{setTimeout(() => navigate('/'), 2000)}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">{t('checkoutPage.title')}</h1>
      <div className="grid lg:grid-cols-2 gap-12">
        <div>
          <Card>
            <CardHeader><CardTitle>{t('checkoutPage.shippingInfo')}</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><Label htmlFor="fullName">Full Name</Label><Input id="fullName" {...register('fullName')} /><p className="text-destructive text-xs mt-1">{errors.fullName?.message}</p></div>
              <div className="col-span-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" {...register('email')} /><p className="text-destructive text-xs mt-1">{errors.email?.message}</p></div>
              <div className="col-span-2"><Label htmlFor="phone">Phone</Label><Input id="phone" {...register('phone')} /><p className="text-destructive text-xs mt-1">{errors.phone?.message}</p></div>
              <div className="col-span-2"><Label htmlFor="line1">Address Line 1</Label><Input id="line1" {...register('line1')} /><p className="text-destructive text-xs mt-1">{errors.line1?.message}</p></div>
              <div className="col-span-2"><Label htmlFor="line2">Address Line 2 (Optional)</Label><Input id="line2" {...register('line2')} /></div>
              <div><Label htmlFor="city">City</Label><Input id="city" {...register('city')} /><p className="text-destructive text-xs mt-1">{errors.city?.message}</p></div>
              <div><Label htmlFor="state">State / Province</Label><Input id="state" {...register('state')} /><p className="text-destructive text-xs mt-1">{errors.state?.message}</p></div>
              <div><Label htmlFor="postalCode">Postal Code</Label><Input id="postalCode" {...register('postalCode')} /><p className="text-destructive text-xs mt-1">{errors.postalCode?.message}</p></div>
              <div><Label htmlFor="country">Country</Label><Input id="country" {...register('country')} /><p className="text-destructive text-xs mt-1">{errors.country?.message}</p></div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="mb-8">
            <CardHeader><CardTitle>{t('checkoutPage.paymentMethod')}</CardTitle></CardHeader>
            <CardContent>
              <Tabs defaultValue="card" className="w-full" onValueChange={setPaymentMethod}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="card"><CreditCard className="me-2 h-4 w-4"/>{t('checkoutPage.payment.card')}</TabsTrigger>
                  <TabsTrigger value="tabby"><Wallet className="me-2 h-4 w-4"/>{t('checkoutPage.payment.tabby')}</TabsTrigger>
                  <TabsTrigger value="applepay"><FaApplePay className="me-2 h-5 w-5"/>{t('checkoutPage.payment.applepay')}</TabsTrigger>
                  <TabsTrigger value="cod" disabled><Truck className="me-2 h-4 w-4"/>{t('checkoutPage.payment.cod')}</TabsTrigger>
                </TabsList>
                <TabsContent value="card" className="mt-4 space-y-4">
                  <div><Label htmlFor="cardNumber">Card Number</Label><Input id="cardNumber" placeholder="**** **** **** ****" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label htmlFor="expiry">Expiry Date</Label><Input id="expiry" placeholder="MM / YY" /></div>
                    <div><Label htmlFor="cvc">CVC</Label><Input id="cvc" placeholder="***" /></div>
                  </div>
                </TabsContent>
                <TabsContent value="tabby" className="mt-4 text-center">
                    <img src="https://www.tabby.ai/images/logo.svg" alt="Tabby" className="h-8 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">{t('checkoutPage.tabbyInfo')}</p>
                    <div className="flex justify-around mt-4 text-xs">
                        {Array.from({length: 4}).map((_, i) => (
                            <div key={i} className="text-center">
                                <p className="font-bold">{formatCurrency(cart.total / 4)}</p>
                                <p className="text-muted-foreground">Month {i+1}</p>
                            </div>
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="applepay" className="mt-4">
                    <p className="text-sm text-center text-muted-foreground mb-4">{t('checkoutPage.applePayInfo')}</p>
                    <Button variant="default" className="w-full bg-black text-white hover:bg-gray-800 h-12 text-lg" disabled>
                        <FaApplePay className="me-2 h-6 w-6"/> Pay
                    </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>{t('checkoutPage.orderSummary')}</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              {cart.items.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.productSnapshot.title} x {item.quantity}</span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between"><span>{t('cartPage.subtotal')}</span><span>{formatCurrency(cart.subtotal)}</span></div>
              <div className="flex justify-between"><span>{t('cartPage.shipping')}</span><span>{formatCurrency(cart.shipping)}</span></div>
              <div className="flex justify-between"><span>{t('cartPage.tax')}</span><span>{formatCurrency(cart.tax)}</span></div>
              {cart.discount && <div className="flex justify-between text-green-500"><span>Discount</span><span>-{formatCurrency(cart.discount)}</span></div>}
              <Separator />
              <div className="flex justify-between font-bold text-base"><span>{t('cartPage.total')}</span><span>{formatCurrency(cart.total)}</span></div>
            </CardContent>
          </Card>
          <Button type="submit" size="lg" className="w-full mt-8" disabled={isProcessing}>
            {isProcessing ? t('checkoutPage.processing') : t('checkoutPage.placeOrder', { total: formatCurrency(cart.total) })}
          </Button>
        </div>
      </div>
    </form>
  )
}

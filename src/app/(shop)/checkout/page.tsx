'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Lock, CreditCard, Truck, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { useCartStore } from '@/lib/stores/cart-store'
import { formatPrice } from '@/lib/utils'
import { motion } from 'framer-motion'

const steps = [
  { id: 1, name: 'Shipping', icon: Truck },
  { id: 2, name: 'Payment', icon: CreditCard },
  { id: 3, name: 'Review', icon: CheckCircle }
]

export default function CheckoutPage() {
  const { 
    items, 
    subtotalCents, 
    taxCents, 
    shippingCents, 
    discountCents, 
    totalCents,
    couponCode
  } = useCartStore()

  const [currentStep, setCurrentStep] = useState(1)
  const [shippingForm, setShippingForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    saveInfo: false
  })
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    billingAddressSame: true
  })

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="text-8xl mb-6">🛒</div>
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Add some items to your cart before checking out.
            </p>
            <Link href="/catalog">
              <Button>Browse Products</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cart">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-muted-foreground">
              Complete your order securely
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  currentStep >= step.id 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <step.icon className="h-4 w-4" />
                  <span className="font-medium">{step.name}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    currentStep > step.id ? 'bg-orange-500' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Contact Information */}
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={shippingForm.email}
                        onChange={(e) => setShippingForm(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>

                    {/* Name */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          value={shippingForm.firstName}
                          onChange={(e) => setShippingForm(prev => ({ ...prev, firstName: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          value={shippingForm.lastName}
                          onChange={(e) => setShippingForm(prev => ({ ...prev, lastName: e.target.value }))}
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        placeholder="123 Main Street"
                        value={shippingForm.address}
                        onChange={(e) => setShippingForm(prev => ({ ...prev, address: e.target.value }))}
                      />
                    </div>

                    {/* City, State, ZIP */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="New York"
                          value={shippingForm.city}
                          onChange={(e) => setShippingForm(prev => ({ ...prev, city: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          placeholder="NY"
                          value={shippingForm.state}
                          onChange={(e) => setShippingForm(prev => ({ ...prev, state: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          placeholder="10001"
                          value={shippingForm.zipCode}
                          onChange={(e) => setShippingForm(prev => ({ ...prev, zipCode: e.target.value }))}
                        />
                      </div>
                    </div>

                    {/* Save Info */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="save-info"
                        checked={shippingForm.saveInfo}
                        onCheckedChange={(checked) => 
                          setShippingForm(prev => ({ ...prev, saveInfo: checked as boolean }))
                        }
                      />
                      <Label htmlFor="save-info" className="text-sm">
                        Save this information for next time
                      </Label>
                    </div>

                    <Button
                      onClick={() => setCurrentStep(2)}
                      className="w-full"
                      disabled={!shippingForm.email || !shippingForm.firstName || !shippingForm.lastName || !shippingForm.address}
                    >
                      Continue to Payment
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Payment Information */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Payment Methods */}
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="h-12 justify-start">
                        <span className="text-xl mr-2">💳</span>
                        Credit Card
                      </Button>
                      <Button variant="outline" className="h-12 justify-start">
                        <span className="text-xl mr-2">🅿️</span>
                        PayPal
                      </Button>
                    </div>

                    {/* Card Information */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={paymentForm.cardNumber}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, cardNumber: e.target.value }))}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={paymentForm.expiryDate}
                            onChange={(e) => setPaymentForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={paymentForm.cvv}
                            onChange={(e) => setPaymentForm(prev => ({ ...prev, cvv: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="nameOnCard">Name on Card</Label>
                        <Input
                          id="nameOnCard"
                          placeholder="John Doe"
                          value={paymentForm.nameOnCard}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, nameOnCard: e.target.value }))}
                        />
                      </div>
                    </div>

                    {/* Billing Address */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="billing-same"
                        checked={paymentForm.billingAddressSame}
                        onCheckedChange={(checked) => 
                          setPaymentForm(prev => ({ ...prev, billingAddressSame: checked as boolean }))
                        }
                      />
                      <Label htmlFor="billing-same" className="text-sm">
                        Billing address same as shipping
                      </Label>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={() => setCurrentStep(3)}
                        className="flex-1"
                        disabled={!paymentForm.cardNumber || !paymentForm.nameOnCard}
                      >
                        Review Order
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Order Review */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Review Your Order
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Shipping Address */}
                    <div>
                      <h4 className="font-semibold mb-2">Shipping Address</h4>
                      <div className="text-sm text-muted-foreground">
                        <p>{shippingForm.firstName} {shippingForm.lastName}</p>
                        <p>{shippingForm.address}</p>
                        <p>{shippingForm.city}, {shippingForm.state} {shippingForm.zipCode}</p>
                        <p>{shippingForm.country}</p>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h4 className="font-semibold mb-2">Payment Method</h4>
                      <div className="text-sm text-muted-foreground">
                        <p>**** **** **** {paymentForm.cardNumber.slice(-4)}</p>
                        <p>{paymentForm.nameOnCard}</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h4 className="font-semibold mb-3">Order Items</h4>
                      <div className="space-y-3">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-3 bg-muted rounded-md">
                            <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-md flex items-center justify-center">
                              <span className="text-xl">{item.image}</span>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">{item.variant}</p>
                              <p className="text-sm">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-semibold">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(2)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        className="flex-1"
                        size="lg"
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Place Order
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Items Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-md flex items-center justify-center">
                        <span className="text-xl">{item.image}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.variant} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatPrice(subtotalCents)}</span>
                  </div>
                  
                  {discountCents > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({couponCode}):</span>
                      <span>-{formatPrice(discountCents)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span>Shipping:</span>
                    <span>
                      {shippingCents === 0 ? 'Free' : formatPrice(shippingCents)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Tax:</span>
                    <span>{formatPrice(taxCents)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>{formatPrice(totalCents)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Badges */}
            <Card>
              <CardContent className="p-4">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Lock className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Secure Checkout</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your payment information is encrypted and secure
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-3">
                    <div className="text-lg">🔒</div>
                    <div className="text-lg">🛡️</div>
                    <div className="text-lg">✅</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Support */}
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm font-medium mb-1">Need Help?</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Our customer support team is here to help
                </p>
                <Button variant="outline" size="sm">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
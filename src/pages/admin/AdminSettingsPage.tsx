import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getApi } from '../../lib/api'
import { Settings } from '../../lib/types'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { useToast } from '../../hooks/use-toast'

const api = getApi()

const settingsSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  currency: z.enum(['USD', 'EUR', 'SAR']),
  taxRate: z.coerce.number().min(0).max(100),
  shippingFlatRate: z.coerce.number().min(0),
  freeShippingThreshold: z.coerce.number().min(0),
})

type SettingsFormValues = z.infer<typeof settingsSchema>

export function AdminSettingsPage() {
  const { toast } = useToast()
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
  })

  useEffect(() => {
    async function fetchSettings() {
      const settings = await api.settings.get()
      if (settings) {
        reset(settings)
      }
    }
    fetchSettings()
  }, [reset])

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      await api.settings.update(data)
      toast({ title: "Settings saved successfully" })
      reset(data) // To reset the dirty state
    } catch (error) {
      toast({ variant: 'destructive', title: "Failed to save settings" })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Settings</CardTitle>
        <CardDescription>Manage your store's general settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
          <div><Label htmlFor="storeName">Store Name</Label><Input id="storeName" {...register('storeName')} /><p className="text-destructive text-xs mt-1">{errors.storeName?.message}</p></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label htmlFor="taxRate">Tax Rate (%)</Label><Input id="taxRate" type="number" {...register('taxRate')} /><p className="text-destructive text-xs mt-1">{errors.taxRate?.message}</p></div>
            <div><Label htmlFor="currency">Currency</Label><Input id="currency" {...register('currency')} disabled /><p className="text-muted-foreground text-xs mt-1">Currency cannot be changed.</p></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label htmlFor="shippingFlatRate">Shipping Flat Rate</Label><Input id="shippingFlatRate" type="number" {...register('shippingFlatRate')} /><p className="text-destructive text-xs mt-1">{errors.shippingFlatRate?.message}</p></div>
            <div><Label htmlFor="freeShippingThreshold">Free Shipping Threshold</Label><Input id="freeShippingThreshold" type="number" {...register('freeShippingThreshold')} /><p className="text-destructive text-xs mt-1">{errors.freeShippingThreshold?.message}</p></div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={!isDirty}>Save Changes</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

import React, { useEffect, useState } from 'react'
import { getApi } from '../../lib/api'
import { Order } from '../../lib/types'
import { StatCard } from '../../components/admin/StatCard'
import { SalesChart } from '../../components/admin/SalesChart'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { DollarSign, ShoppingCart, Users, Activity } from 'lucide-react'
import { formatCurrency } from '../../lib/utils'
import { Loader2 } from 'lucide-react'

const api = getApi()

export function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedOrders = await api.orders.list()
        setOrders(fetchedOrders)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = orders.length
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Total Orders" value={totalOrders} icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Avg. Order Value" value={formatCurrency(avgOrderValue)} icon={<Activity className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Customers" value="2" description="Mock data" icon={<Users className="h-4 w-4 text-muted-foreground" />} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesChart orders={orders} />
        </CardContent>
      </Card>
    </div>
  )
}

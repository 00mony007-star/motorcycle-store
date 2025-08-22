'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  TrendingUp,
  AlertTriangle,
  Eye,
  Plus
} from 'lucide-react'
import Link from 'next/link'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Mock analytics data
const salesData = [
  { date: 'Mon', revenue: 2400, orders: 12 },
  { date: 'Tue', revenue: 1398, orders: 8 },
  { date: 'Wed', revenue: 9800, orders: 24 },
  { date: 'Thu', revenue: 3908, orders: 16 },
  { date: 'Fri', revenue: 4800, orders: 20 },
  { date: 'Sat', revenue: 3800, orders: 18 },
  { date: 'Sun', revenue: 4300, orders: 22 },
]

const recentOrders = [
  { id: 'MG20250822001', customer: 'John Doe', amount: 299.99, status: 'processing' },
  { id: 'MG20250822002', customer: 'Jane Smith', amount: 199.99, status: 'shipped' },
  { id: 'MG20250822003', customer: 'Mike Johnson', amount: 449.99, status: 'delivered' },
  { id: 'MG20250822004', customer: 'Sarah Wilson', amount: 159.99, status: 'pending' },
]

const lowStockProducts = [
  { name: 'Premium Racing Helmet', stock: 3, threshold: 5 },
  { name: 'Carbon Fiber Gloves', stock: 2, threshold: 5 },
  { name: 'Sport Touring Jacket', stock: 1, threshold: 5 },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-orange-500 to-slate-900 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time overview of your motorcycle store
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Live Updates Active</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Revenue',
            value: '$24,580',
            change: '+12.5%',
            icon: DollarSign,
            color: 'text-green-500'
          },
          {
            title: 'Orders',
            value: '156',
            change: '+8.2%',
            icon: ShoppingCart,
            color: 'text-blue-500'
          },
          {
            title: 'Customers',
            value: '89',
            change: '+23.1%',
            icon: Users,
            color: 'text-purple-500'
          },
          {
            title: 'Products',
            value: '234',
            change: '+2.4%',
            icon: Package,
            color: 'text-orange-500'
          },
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {metric.title}
                    </p>
                    <p className="text-3xl font-bold">
                      {metric.value}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-500">
                        {metric.change} from last month
                      </span>
                    </div>
                  </div>
                  <div className={`${metric.color}`}>
                    <metric.icon className="w-8 h-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                <span>Revenue Trend</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#f97316"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Low Stock Alerts */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <span>Low Stock Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {lowStockProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                  <div>
                    <h4 className="font-medium text-sm">{product.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      Only {product.stock} left (threshold: {product.threshold})
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Restock
                  </Button>
                </div>
              ))}
              
              <Button asChild className="w-full" variant="outline">
                <Link href="/admin/inventory">
                  View All Inventory
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-orange-500" />
                <span>Recent Orders</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Live
                </span>
              </div>
              <Button asChild size="sm">
                <Link href="/admin/orders">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">Order #{order.id.slice(-3)}</h4>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold">${order.amount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Button asChild className="h-20 bg-orange-500 hover:bg-orange-600">
          <Link href="/admin/products/new" className="flex flex-col items-center space-y-2">
            <Plus className="w-6 h-6" />
            <span>Add Product</span>
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="h-20">
          <Link href="/admin/orders" className="flex flex-col items-center space-y-2">
            <ShoppingCart className="w-6 h-6" />
            <span>Manage Orders</span>
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="h-20">
          <Link href="/admin/analytics" className="flex flex-col items-center space-y-2">
            <TrendingUp className="w-6 h-6" />
            <span>View Analytics</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}
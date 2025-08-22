import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  Package, 
  DollarSign,
  AlertTriangle,
  Eye,
  Zap
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { useRealtimeStore } from '../../lib/stores/realtimeStore'
import { useTranslation } from 'react-i18next'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface DashboardMetric {
  id: string
  title: string
  value: string | number
  change: number
  changeLabel: string
  icon: React.ReactNode
  color: string
}

interface SalesData {
  date: string
  revenue: number
  orders: number
  visitors: number
}

export function RealtimeDashboard() {
  const { 
    isConnected, 
    connectionStatus, 
    liveOrders, 
    liveProducts, 
    notifications,
    markNotificationRead 
  } = useRealtimeStore()
  
  const { t } = useTranslation()
  const [metrics, setMetrics] = useState<DashboardMetric[]>([])
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([])
  const [recentOrders, setRecentOrders] = useState<any[]>([])

  // Simulate real-time metrics
  useEffect(() => {
    const updateMetrics = () => {
      const totalRevenue = Array.from(liveOrders.values()).reduce((sum, order) => sum + order.total, 0)
      const totalOrders = liveOrders.size
      const activeUsers = Math.floor(Math.random() * 50) + 10
      const lowStockCount = Array.from(liveProducts.values()).filter(p => p.stock <= 5).length

      setMetrics([
        {
          id: 'revenue',
          title: 'Total Revenue',
          value: `$${totalRevenue.toLocaleString()}`,
          change: 12.5,
          changeLabel: '+12.5% from last month',
          icon: <DollarSign className="w-6 h-6" />,
          color: 'text-green-500'
        },
        {
          id: 'orders',
          title: 'Total Orders',
          value: totalOrders,
          change: 8.2,
          changeLabel: '+8.2% from last week',
          icon: <ShoppingCart className="w-6 h-6" />,
          color: 'text-blue-500'
        },
        {
          id: 'users',
          title: 'Active Users',
          value: activeUsers,
          change: -2.1,
          changeLabel: '-2.1% from yesterday',
          icon: <Users className="w-6 h-6" />,
          color: 'text-purple-500'
        },
        {
          id: 'inventory',
          title: 'Low Stock Items',
          value: lowStockCount,
          change: lowStockCount > 0 ? 15.3 : 0,
          changeLabel: lowStockCount > 0 ? 'Needs attention' : 'All good',
          icon: <Package className="w-6 h-6" />,
          color: lowStockCount > 0 ? 'text-red-500' : 'text-green-500'
        }
      ])
    }

    updateMetrics()
    const interval = setInterval(updateMetrics, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [liveOrders, liveProducts])

  // Generate sample sales data
  useEffect(() => {
    const generateSalesData = () => {
      const data: SalesData[] = []
      const now = new Date()
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        
        data.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          revenue: Math.floor(Math.random() * 5000) + 1000,
          orders: Math.floor(Math.random() * 50) + 10,
          visitors: Math.floor(Math.random() * 200) + 50
        })
      }
      
      setSalesData(data)
    }

    generateSalesData()
  }, [])

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold heading-premium">
          {t('admin.dashboard.title', 'Real-time Dashboard')}
        </h1>
        
        <motion.div
          animate={{ scale: isConnected ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center space-x-2"
        >
          <div className={`w-3 h-3 rounded-full ${
            isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          }`} />
          <span className="text-sm font-medium">
            {isConnected ? 'Live Updates Active' : 'Disconnected'}
          </span>
        </motion.div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="premium-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {metric.title}
                    </p>
                    <motion.p 
                      key={metric.value}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="text-3xl font-bold"
                    >
                      {metric.value}
                    </motion.p>
                    <div className="flex items-center mt-2">
                      {metric.change > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500 me-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500 me-1" />
                      )}
                      <span className={`text-sm ${
                        metric.change > 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {metric.changeLabel}
                      </span>
                    </div>
                  </div>
                  <div className={`${metric.color}`}>
                    {metric.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>Revenue Trend</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Orders Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <span>Orders & Visitors</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="visitors"
                    stroke="#8884d8"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-primary" />
                <span>Live Activity</span>
                <Badge variant="destructive" className="animate-pulse">
                  {notifications.filter(n => !n.read).length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-80 overflow-y-auto">
              {notifications.slice(0, 10).map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    notification.read 
                      ? 'bg-muted/50 border-border' 
                      : 'bg-primary/5 border-primary/20 shadow-sm'
                  }`}
                  onClick={() => markNotificationRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notification.type === 'success' ? 'bg-green-500' :
                      notification.type === 'warning' ? 'bg-yellow-500' :
                      notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {notifications.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Low Stock Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <span>Inventory Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-80 overflow-y-auto">
              {Array.from(liveProducts.values())
                .filter(product => product.stock <= 5)
                .slice(0, 5)
                .map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-medium text-sm">{product.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {product.category.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={product.stock === 0 ? 'destructive' : 'secondary'}
                        className="mb-1"
                      >
                        {product.stock === 0 ? 'Out of Stock' : `${product.stock} left`}
                      </Badge>
                      <Button size="sm" variant="outline" className="text-xs">
                        Restock
                      </Button>
                    </div>
                  </motion.div>
                ))}
              
              {Array.from(liveProducts.values()).filter(p => p.stock <= 5).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>All products are well stocked</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="premium-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              <span>Recent Orders</span>
              <Badge variant="secondary">Live</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from(liveOrders.values())
                .slice(-5)
                .reverse()
                .map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Order #{order.id.slice(-8)}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold">${order.total.toFixed(2)}</p>
                      <Badge 
                        variant={
                          order.status === 'completed' ? 'default' :
                          order.status === 'processing' ? 'secondary' :
                          order.status === 'shipped' ? 'outline' : 'destructive'
                        }
                        className="mt-1"
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              
              {liveOrders.size === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No recent orders</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// Real-time connection indicator component
export function ConnectionIndicator() {
  const { isConnected, connectionStatus } = useRealtimeStore()
  
  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connected':
        return { color: 'bg-green-500', text: 'Connected', animate: true }
      case 'connecting':
        return { color: 'bg-yellow-500', text: 'Connecting...', animate: true }
      case 'disconnected':
        return { color: 'bg-gray-500', text: 'Disconnected', animate: false }
      case 'error':
        return { color: 'bg-red-500', text: 'Connection Error', animate: false }
      default:
        return { color: 'bg-gray-500', text: 'Unknown', animate: false }
    }
  }

  const config = getStatusConfig()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center space-x-2 text-sm"
    >
      <motion.div
        animate={config.animate ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        className={`w-2 h-2 rounded-full ${config.color}`}
      />
      <span className="font-medium">{config.text}</span>
    </motion.div>
  )
}
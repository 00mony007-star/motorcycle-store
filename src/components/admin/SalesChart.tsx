import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { Order } from '../../lib/types'
import { formatCurrency } from '../../lib/utils'

interface SalesChartProps {
  orders: Order[]
}

export function SalesChart({ orders }: SalesChartProps) {
  const salesData = orders
    .filter(o => o.status === 'delivered' || o.status === 'shipped')
    .reduce((acc, order) => {
      const date = new Date(order.createdAt).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
      acc[date] = (acc[date] || 0) + order.total
      return acc
    }, {} as Record<string, number>)

  const chartData = Object.entries(salesData)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([date, revenue]) => ({
      date,
      revenue: Math.round(revenue * 100) / 100, // Round to 2 decimal places
      formattedRevenue: formatCurrency(revenue)
    }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-primary">
            Sales: {formatCurrency(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  if (chartData.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            📊
          </div>
          <p>No sales data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
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
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#salesGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Analytics query schema
const AnalyticsQuerySchema = z.object({
  period: z.enum(['7d', '30d', '90d', '1y']).default('30d'),
  metric: z.enum(['revenue', 'orders', 'customers', 'products']).optional()
})

// Mock analytics data
const mockAnalytics = {
  kpis: {
    totalRevenue: 125750,
    totalOrders: 342,
    totalCustomers: 1247,
    totalProducts: 156,
    averageOrderValue: 36780,
    conversionRate: 3.2,
    returnRate: 2.1,
    customerSatisfaction: 4.6
  },
  
  revenueData: [
    { date: '2024-01-01', revenue: 12500, orders: 25 },
    { date: '2024-01-02', revenue: 15200, orders: 31 },
    { date: '2024-01-03', revenue: 18900, orders: 38 },
    { date: '2024-01-04', revenue: 14300, orders: 29 },
    { date: '2024-01-05', revenue: 22100, orders: 45 },
    { date: '2024-01-06', revenue: 19800, orders: 42 },
    { date: '2024-01-07', revenue: 16750, orders: 34 },
    { date: '2024-01-08', revenue: 21200, orders: 43 },
    { date: '2024-01-09', revenue: 17600, orders: 36 },
    { date: '2024-01-10', revenue: 23400, orders: 48 },
    { date: '2024-01-11', revenue: 20300, orders: 41 },
    { date: '2024-01-12', revenue: 18700, orders: 37 },
    { date: '2024-01-13', revenue: 25600, orders: 52 },
    { date: '2024-01-14', revenue: 22900, orders: 46 },
    { date: '2024-01-15', revenue: 19500, orders: 39 }
  ],
  
  topProducts: [
    { id: '1', name: 'Premium Racing Helmet', sales: 45, revenue: 269955 },
    { id: '2', name: 'Leather Racing Jacket', sales: 32, revenue: 127968 },
    { id: '3', name: 'Waterproof Gloves', sales: 67, revenue: 87093 },
    { id: '4', name: 'Sport Riding Boots', sales: 28, revenue: 69972 },
    { id: '5', name: 'Carbon Fiber Knee Guards', sales: 23, revenue: 43677 }
  ],
  
  topCategories: [
    { category: 'Helmets', sales: 89, revenue: 445566 },
    { category: 'Jackets', sales: 67, revenue: 234567 },
    { category: 'Gloves', sales: 123, revenue: 156789 },
    { category: 'Boots', sales: 45, revenue: 123456 },
    { category: 'Protection', sales: 34, revenue: 98765 }
  ],
  
  recentOrders: [
    {
      id: 'ord1',
      orderNumber: 'ORD-1705123456-ABC123',
      customer: 'John Doe',
      email: 'john@example.com',
      total: 59999,
      status: 'confirmed',
      createdAt: '2024-01-15T14:30:00Z'
    },
    {
      id: 'ord2',
      orderNumber: 'ORD-1705123400-DEF456',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      total: 39999,
      status: 'processing',
      createdAt: '2024-01-15T14:25:00Z'
    },
    {
      id: 'ord3',
      orderNumber: 'ORD-1705123350-GHI789',
      customer: 'Mike Johnson',
      email: 'mike@example.com',
      total: 12999,
      status: 'shipped',
      createdAt: '2024-01-15T14:20:00Z'
    }
  ],
  
  lowStockAlerts: [
    { id: '4', name: 'Sport Riding Boots', stockCount: 0, category: 'Boots' },
    { id: '2', name: 'Leather Racing Jacket', stockCount: 3, category: 'Jackets' },
    { id: '5', name: 'Carbon Fiber Knee Guards', stockCount: 2, category: 'Protection' }
  ]
}

// GET /api/admin/analytics - Fetch analytics data
export async function GET(request: NextRequest) {
  try {
    // Check admin authentication (in real app)
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication required' 
        },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const query = AnalyticsQuerySchema.parse(Object.fromEntries(searchParams))

    // Filter data based on period
    let filteredData = { ...mockAnalytics }

    switch (query.period) {
      case '7d':
        filteredData.revenueData = mockAnalytics.revenueData.slice(-7)
        break
      case '30d':
        filteredData.revenueData = mockAnalytics.revenueData.slice(-30)
        break
      case '90d':
        // For demo, just use all available data
        break
      case '1y':
        // For demo, just use all available data
        break
    }

    // If specific metric requested, return only that data
    if (query.metric) {
      const metricData = {
        revenue: { 
          current: filteredData.kpis.totalRevenue,
          data: filteredData.revenueData 
        },
        orders: { 
          current: filteredData.kpis.totalOrders,
          data: filteredData.revenueData.map(d => ({ date: d.date, orders: d.orders }))
        },
        customers: { 
          current: filteredData.kpis.totalCustomers,
          growth: 12.5 
        },
        products: { 
          current: filteredData.kpis.totalProducts,
          active: 145,
          inactive: 11
        }
      }

      return NextResponse.json({
        success: true,
        data: metricData[query.metric]
      })
    }

    return NextResponse.json({
      success: true,
      data: filteredData
    })

  } catch (error) {
    console.error('Analytics API Error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid query parameters', 
          details: error.errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch analytics data' 
      },
      { status: 500 }
    )
  }
}
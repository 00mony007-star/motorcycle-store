import React, { useEffect, useState } from 'react'
import { getApi } from '../../lib/api'
import { Order } from '../../lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table'
import { Badge } from '../../components/ui/Badge'
import { formatCurrency, formatDate } from '../../lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/Select'
import { useToast } from '../../hooks/use-toast'
import { Button } from '../../components/ui/Button'
import { Printer } from 'lucide-react'
import { generateInvoicePdf } from '../../lib/pdfGenerator'

const api = getApi()

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const { toast } = useToast()

  const fetchOrders = async () => {
    const fetchedOrders = await api.orders.list()
    setOrders(fetchedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    try {
      await api.orders.update(orderId, { status })
      toast({ title: 'Order status updated' })
      fetchOrders()
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to update status' })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <CardDescription>View and manage all customer orders.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.number}</TableCell>
                <TableCell>{formatDate(new Date(order.createdAt))}</TableCell>
                <TableCell>{order.shippingAddress.fullName}</TableCell>
                <TableCell>{formatCurrency(order.total)}</TableCell>
                <TableCell>
                  <Select value={order.status} onValueChange={(value) => handleStatusChange(order.id, value as Order['status'])}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="canceled">Canceled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                    <Button variant="outline" size="icon" onClick={() => generateInvoicePdf(order)}>
                        <Printer className="h-4 w-4" />
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

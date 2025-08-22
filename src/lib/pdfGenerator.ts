import jsPDF from 'jspdf'
import { Order } from './types'
import { formatCurrency, formatDate } from './utils'

export function generateInvoicePdf(order: Order) {
  const doc = new jsPDF()
  let y = 20

  // Header
  doc.setFontSize(22)
  doc.text('Invoice', 105, y, { align: 'center' })
  y += 10

  // Order Details
  doc.setFontSize(12)
  doc.text(`Order #: ${order.number}`, 20, y)
  doc.text(`Date: ${formatDate(new Date(order.createdAt))}`, 180, y, { align: 'right' })
  y += 10

  // Shipping Address
  doc.setFontSize(10)
  doc.text('Ship To:', 20, y)
  const addr = order.shippingAddress
  doc.text(`${addr.fullName}`, 20, y + 5)
  doc.text(`${addr.line1}`, 20, y + 10)
  if (addr.line2) doc.text(`${addr.line2}`, 20, y + 15)
  doc.text(`${addr.city}, ${addr.state} ${addr.postalCode}`, 20, y + 20)
  y += 30

  // Table Header
  doc.setDrawColor(0)
  doc.setFillColor(230, 230, 230)
  doc.rect(20, y, 170, 7, 'F')
  doc.text('Item', 22, y + 5)
  doc.text('Qty', 130, y + 5)
  doc.text('Price', 150, y + 5)
  doc.text('Total', 180, y + 5, { align: 'right' })
  y += 10

  // Table Rows
  order.items.forEach(item => {
    doc.text(item.productSnapshot.title, 22, y)
    doc.text(item.quantity.toString(), 130, y)
    doc.text(formatCurrency(item.price), 150, y)
    doc.text(formatCurrency(item.price * item.quantity), 180, y, { align: 'right' })
    y += 7
  })

  // Totals
  y += 5
  doc.line(130, y, 190, y) // separator
  y += 7
  doc.text('Subtotal:', 130, y)
  doc.text(formatCurrency(order.subtotal), 180, y, { align: 'right' })
  y += 7
  doc.text('Shipping:', 130, y)
  doc.text(formatCurrency(order.shipping), 180, y, { align: 'right' })
  y += 7
  doc.text('Tax:', 130, y)
  doc.text(formatCurrency(order.tax), 180, y, { align: 'right' })
  y += 7
  doc.setFont('helvetica', 'bold')
  doc.text('Total:', 130, y)
  doc.text(formatCurrency(order.total), 180, y, { align: 'right' })

  // Footer
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text('Thank you for your business!', 105, y + 20, { align: 'center' })

  doc.save(`Invoice-${order.number}.pdf`)
}

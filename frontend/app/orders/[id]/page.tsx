'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/toast'
import { getOrderById, updateOrderStatus, Order } from '@/lib/api/order'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils/format'

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true)
        const data = await getOrderById(orderId)
        setOrder(data)
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Error',
          description: 'Failed to load order details',
        })
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [orderId])

  const handleMarkAsPaid = async () => {
    if (!order) return

    try {
      setUpdating(true)
      const updated = await updateOrderStatus(orderId, 'Paid')
      setOrder(updated)
      addToast({
        type: 'success',
        title: 'Success',
        description: 'Order marked as paid',
      })
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Failed to update order status',
      })
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <p>Loading...</p>
  if (!order) return <p className="text-gray-600">Order not found</p>

  const getStatusBadgeVariant = (status: string) => {
    return status === 'Paid' ? 'success' : 'secondary'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Order Details</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Back to Orders
        </Button>
      </div>

      {/* Order Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Order {order._id.substring(order._id.length - 8).toUpperCase()}</CardTitle>
              <CardDescription>
                Created on {formatDateTime(order.createdAt)}
              </CardDescription>
            </div>
            <Badge variant={getStatusBadgeVariant(order.status)}>
              {order.status}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Info */}
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Order Date</p>
              <p className="text-lg">{formatDate(order.orderDate)}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-600">Status</p>
              <Badge className="mt-2" variant={getStatusBadgeVariant(order.status)}>
                {order.status}
              </Badge>
            </div>
            {order.paymentMode && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-gray-600">Payment Mode</p>
                  <p className="text-lg">{order.paymentMode}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Totals */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600">Subtotal</span>
              <span>{formatCurrency(order.subTotal)}</span>
            </div>
            {order.discount && order.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Discount</span>
                <span className="text-green-600">-{formatCurrency(order.discount)}</span>
              </div>
            )}
            {order.tax && order.tax > 0 && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Tax</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Grand Total</span>
              <span>{formatCurrency(order.grandTotal)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Line Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.itemNameSnapshot}</TableCell>
                    <TableCell>{formatCurrency(item.unitPriceSnapshot)}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatCurrency(item.lineTotal)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      {order.status === 'Created' && (
        <div className="flex gap-2">
          <Button
            onClick={handleMarkAsPaid}
            disabled={updating}
            className="bg-green-600 hover:bg-green-700"
          >
            {updating ? 'Processing...' : 'Mark as Paid'}
          </Button>
        </div>
      )}
    </div>
  )
}

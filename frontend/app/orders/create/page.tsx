'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/toast'
import { getCustomers, Customer } from '@/lib/api/customer'
import { getMenuItems, MenuItem } from '@/lib/api/menu'
import { createOrder } from '@/lib/api/order'
import { formatCurrency } from '@/lib/utils/format'

interface CartItem extends MenuItem {
  quantity: number
  lineTotal: number
}

export default function CreateOrderPage() {
  const router = useRouter()
  const { addToast } = useToast()

  // Customer selection
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customerSearch, setCustomerSearch] = useState('')
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false)

  // Menu items
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [itemSearch, setItemSearch] = useState('')
  const [itemDropdownOpen, setItemDropdownOpen] = useState(false)

  // Cart
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [discount, setDiscount] = useState(0)
  const [tax, setTax] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  // Payment
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Card'>('Cash')
  const [simulateStatus, setSimulateStatus] = useState<
    'Success' | 'CardDeclined' | 'InsufficientFunds' | 'CardLimitExceeded'
  >('Success')
  const [paymentError, setPaymentError] = useState<string | null>(null)

  // Load customers
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await getCustomers(1, 100, customerSearch)
        setCustomers(data)
      } catch (error) {
        addToast({ type: 'error', title: 'Error', description: 'Failed to load customers' })
      }
    }
    loadCustomers()
  }, [customerSearch])

  // Load menu items
  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        const data = await getMenuItems(1, 100, itemSearch)
        setMenuItems(data)
      } catch (error) {
        addToast({ type: 'error', title: 'Error', description: 'Failed to load menu items' })
      }
    }
    loadMenuItems()
  }, [itemSearch])

  const addToCart = (item: MenuItem) => {
    const existing = cartItems.find((c) => c._id === item._id)
    if (existing) {
      updateCartQuantity(item._id, existing.quantity + 1)
    } else {
      setCartItems([
        ...cartItems,
        {
          ...item,
          quantity: 1,
          lineTotal: item.price,
        },
      ])
    }
    setItemSearch('')
    setItemDropdownOpen(false)
  }

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
    } else {
      setCartItems(
        cartItems.map((item) =>
          item._id === itemId
            ? { ...item, quantity, lineTotal: item.price * quantity }
            : item
        )
      )
    }
  }

  const removeFromCart = (itemId: string) => {
    setCartItems(cartItems.filter((item) => item._id !== itemId))
  }

  const subTotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0)
  const grandTotal = subTotal - discount + tax

  const handleSubmit = async () => {
    if (!selectedCustomer) {
      addToast({ type: 'error', title: 'Error', description: 'Please select a customer' })
      return
    }

    if (cartItems.length === 0) {
      addToast({ type: 'error', title: 'Error', description: 'Please add items to the order' })
      return
    }

    setPaymentError(null)

    try {
      setSubmitting(true)
      const order = await createOrder({
        customerId: selectedCustomer._id,
        items: cartItems.map((item) => ({
          menuItemId: item._id,
          quantity: item.quantity,
        })),
        discount: discount > 0 ? discount : undefined,
        tax: tax > 0 ? tax : undefined,
        paymentMode,
        simulateStatus,
      })

      addToast({ type: 'success', title: 'Success', description: 'Order created successfully' })
      router.push(`/orders/${order._id}`)
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to create order'
      setPaymentError(errorMsg)
      addToast({
        type: 'error',
        title: 'Error',
        description: errorMsg,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create New Order</h1>

      {/* Customer Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Customer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Input
              placeholder="Search customers..."
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              onFocus={() => setCustomerDropdownOpen(true)}
              className="w-full"
            />
            {customerDropdownOpen && customerSearch && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto z-10">
                {customers.length === 0 ? (
                  <div className="p-2 text-gray-500">No customers found</div>
                ) : (
                  customers.map((customer) => (
                    <div
                      key={customer._id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedCustomer(customer)
                        setCustomerSearch('')
                        setCustomerDropdownOpen(false)
                      }}
                    >
                      <div className="font-medium">{customer.fullName}</div>
                      <div className="text-sm text-gray-600">{customer.phone}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {selectedCustomer && (
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="font-medium">{selectedCustomer.fullName}</p>
              <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
              {selectedCustomer.email && (
                <p className="text-sm text-gray-600">{selectedCustomer.email}</p>
              )}
              {/* Customer Notes - Display if notes exist */}
              {selectedCustomer.notes && selectedCustomer.notes.trim() && (
                <div className="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-700 font-medium text-sm flex-shrink-0">
                      📝 Note:
                    </span>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap max-h-24 overflow-y-auto">
                      {selectedCustomer.notes}
                    </p>
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => setSelectedCustomer(null)}
              >
                Change Customer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Items Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Add Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Input
              placeholder="Search menu items..."
              value={itemSearch}
              onChange={(e) => setItemSearch(e.target.value)}
              onFocus={() => setItemDropdownOpen(true)}
              className="w-full"
            />
            {itemDropdownOpen && itemSearch && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto z-10">
                {menuItems.length === 0 ? (
                  <div className="p-2 text-gray-500">No items found</div>
                ) : (
                  menuItems.map((item) => (
                    <div
                      key={item._id}
                      className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between"
                      onClick={() => addToCart(item)}
                    >
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-600">{formatCurrency(item.price)}</div>
                      </div>
                      {!item.isAvailable && (
                        <Badge variant="destructive">Unavailable</Badge>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Cart Items */}
          {cartItems.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Line Total</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{formatCurrency(item.price)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateCartQuantity(item._id, item.quantity - 1)
                            }
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateCartQuantity(item._id, item.quantity + 1)
                            }
                          >
                            +
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(item.lineTotal)}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeFromCart(item._id)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Details */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>Select payment method and simulation state</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="paymentMode" className="block text-sm font-medium">
                Payment Method
              </label>
              <select
                id="paymentMode"
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as 'Cash' | 'UPI' | 'Card')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="simulateStatus" className="block text-sm font-medium">
                Simulate Payment Result (Testing)
              </label>
              <select
                id="simulateStatus"
                value={simulateStatus}
                onChange={(e) =>
                  setSimulateStatus(
                    e.target.value as
                      | 'Success'
                      | 'CardDeclined'
                      | 'InsufficientFunds'
                      | 'CardLimitExceeded'
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Success">✅ Success</option>
                <option value="CardDeclined">❌ Card Declined</option>
                <option value="InsufficientFunds">💳 Insufficient Funds</option>
                <option value="CardLimitExceeded">📊 Card Limit Exceeded</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                This simulates different payment scenarios for testing
              </p>
            </div>
          </div>

          {paymentError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm font-medium text-red-900">{paymentError}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="font-medium">Subtotal:</span>
            <span>{formatCurrency(subTotal)}</span>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Discount (Optional)</label>
            <Input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Tax (Optional)</label>
            <Input
              type="number"
              value={tax}
              onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
              placeholder="0"
              min="0"
            />
          </div>

          <Separator />

          <div className="flex justify-between text-lg font-bold">
            <span>Grand Total:</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          onClick={handleSubmit}
          disabled={submitting || !selectedCustomer || cartItems.length === 0}
          className="bg-green-600 hover:bg-green-700"
        >
          {submitting ? 'Creating...' : 'Create Order'}
        </Button>
        <Button
          variant="outline"
          onClick={() => router.back()}
          disabled={submitting}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}

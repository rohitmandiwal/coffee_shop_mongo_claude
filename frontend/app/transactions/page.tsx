'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { transactionApi, Transaction } from '@/lib/api/transaction'
import { formatCurrency, formatDate } from '@/lib/utils/format'

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    try {
      const data = await transactionApi.getAll(1, 50)
      setTransactions(data)
    } catch (error) {
      console.error('Failed to load transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    return status === 'Success' ? 'success' : 'destructive'
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Payment Transactions</h1>
        <p className="text-gray-600">View all payment transactions and their statuses</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>Complete history of payment attempts</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8">Loading...</p>
          ) : transactions.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No transactions found</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Mode</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Order</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx._id}>
                      <TableCell className="font-mono text-xs">{tx.gatewayTransactionId}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(tx.amount)}</TableCell>
                      <TableCell>{tx.paymentMode}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(tx.status)}>
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{formatDate(tx.createdAt)}</TableCell>
                      <TableCell>
                        {tx.orderId ? (
                          <Link
                            href={`/orders/${tx.orderId}`}
                            className="text-blue-600 hover:underline"
                          >
                            View Order
                          </Link>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

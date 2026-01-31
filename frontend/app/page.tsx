'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { reportApi, DashboardKPIs } from '@/lib/api/report'

export default function Home() {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadKPIs()
  }, [])

  const loadKPIs = async () => {
    try {
      const data = await reportApi.getDashboardKPIs()
      setKpis(data)
    } catch (error) {
      console.error('Failed to load KPIs:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-12">
      <h1 className="text-4xl font-bold mb-2">Welcome to Coffee Shop Management</h1>
      <p className="text-gray-600 mb-8">Manage your coffee shop inventory and customers efficiently</p>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Today's Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? '...' : kpis?.todayOrders || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Paid orders today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Today's Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{loading ? '...' : kpis?.todayRevenue.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-gray-500 mt-1">Total revenue today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Top Item Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">
              {loading ? '...' : kpis?.topSellingItemToday?.itemName || 'No sales yet'}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {kpis?.topSellingItemToday ? `${kpis.topSellingItemToday.totalQuantity} sold` : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Regular Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">
              {loading ? '...' : kpis?.mostRegularCustomerMTD?.customerName || 'No data'}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {kpis?.mostRegularCustomerMTD ? `${kpis.mostRegularCustomerMTD.orderCount} orders MTD` : ''}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/menu">
          <Card className="cursor-pointer hover:shadow-lg transition">
            <CardHeader>
              <CardTitle>📋 Menu Items</CardTitle>
              <CardDescription>Manage your coffee shop menu</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Add, edit, and organize your menu items. Control availability and pricing.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/customers">
          <Card className="cursor-pointer hover:shadow-lg transition">
            <CardHeader>
              <CardTitle>👥 Customers</CardTitle>
              <CardDescription>Manage your customer database</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Keep track of your customers and their contact information.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/orders">
          <Card className="cursor-pointer hover:shadow-lg transition">
            <CardHeader>
              <CardTitle>📦 Orders</CardTitle>
              <CardDescription>Manage customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Create, track, and manage customer orders with itemized details and payment status.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/reports">
          <Card className="cursor-pointer hover:shadow-lg transition">
            <CardHeader>
              <CardTitle>📊 Reports</CardTitle>
              <CardDescription>Analytics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">View sales reports, top selling items, and customer analytics.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/transactions">
          <Card className="cursor-pointer hover:shadow-lg transition">
            <CardHeader>
              <CardTitle>💳 Transactions</CardTitle>
              <CardDescription>Payment history</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">View all payment transactions and their statuses.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { reportApi, TopSellingItem, MostSoldCoffee, MostRegularCustomer, SalesSummaryItem } from '@/lib/api/report'

export default function ReportsPage() {
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [bucket, setBucket] = useState<'day' | 'week'>('day')
  const [sortBy, setSortBy] = useState<'orders' | 'spend'>('orders')
  const [loading, setLoading] = useState(false)

  const [topItems, setTopItems] = useState<TopSellingItem[]>([])
  const [mostCoffee, setMostCoffee] = useState<MostSoldCoffee | null>(null)
  const [regularCustomer, setRegularCustomer] = useState<MostRegularCustomer | null>(null)
  const [salesSummary, setSalesSummary] = useState<SalesSummaryItem[]>([])

  const handleGenerateReports = async () => {
    if (!fromDate || !toDate) {
      alert('Please select both from and to dates')
      return
    }

    setLoading(true)
    try {
      const from = new Date(fromDate).toISOString()
      const to = new Date(toDate).toISOString()

      const [items, coffee, customer, summary] = await Promise.all([
        reportApi.getTopSellingItems(from, to, 10),
        reportApi.getMostSoldCoffee(from, to),
        reportApi.getMostRegularCustomer(from, to, sortBy),
        reportApi.getSalesSummary(from, to, bucket),
      ])

      setTopItems(items)
      setMostCoffee(coffee)
      setRegularCustomer(customer)
      setSalesSummary(summary)
    } catch (error) {
      console.error('Failed to generate reports:', error)
      alert('Failed to generate reports')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">View sales reports and business insights</p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>Select date range and options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <Label htmlFor="fromDate">From Date</Label>
              <Input
                id="fromDate"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="toDate">To Date</Label>
              <Input
                id="toDate"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="bucket">Sales Summary</Label>
              <Select value={bucket} onValueChange={(value: 'day' | 'week') => setBucket(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">By Day</SelectItem>
                  <SelectItem value="week">By Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sortBy">Customer Sort</Label>
              <Select value={sortBy} onValueChange={(value: 'orders' | 'spend') => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="orders">By Orders</SelectItem>
                  <SelectItem value="spend">By Spend</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleGenerateReports} disabled={loading}>
            {loading ? 'Loading...' : 'Generate Reports'}
          </Button>
        </CardContent>
      </Card>

      {/* Top Selling Items */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Top Selling Items</CardTitle>
          <CardDescription>Most popular items by quantity sold</CardDescription>
        </CardHeader>
        <CardContent>
          {topItems.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No data available. Generate reports above.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead className="text-right">Quantity Sold</TableHead>
                  <TableHead className="text-right">Total Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topItems.map((item, index) => (
                  <TableRow key={item.menuItemId}>
                    <TableCell>
                      <Badge variant={index < 3 ? 'default' : 'secondary'}>#{index + 1}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{item.itemName}</TableCell>
                    <TableCell className="text-right">{item.totalQuantity}</TableCell>
                    <TableCell className="text-right">₹{item.totalRevenue.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Most Sold Coffee & Regular Customer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Most Sold Coffee</CardTitle>
            <CardDescription>Top coffee item by quantity</CardDescription>
          </CardHeader>
          <CardContent>
            {mostCoffee ? (
              <div>
                <div className="text-2xl font-bold mb-2">{mostCoffee.itemName}</div>
                <div className="flex gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Quantity Sold</div>
                    <div className="text-xl font-semibold">{mostCoffee.totalQuantity}</div>
                  </div>
                  <Separator orientation="vertical" />
                  <div>
                    <div className="text-sm text-gray-500">Revenue</div>
                    <div className="text-xl font-semibold">₹{mostCoffee.totalRevenue.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Regular Customer</CardTitle>
            <CardDescription>Top customer by {sortBy === 'orders' ? 'orders' : 'spend'}</CardDescription>
          </CardHeader>
          <CardContent>
            {regularCustomer ? (
              <div>
                <div className="text-2xl font-bold mb-1">{regularCustomer.customerName}</div>
                <div className="text-sm text-gray-500 mb-3">{regularCustomer.customerPhone}</div>
                <div className="flex gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Orders</div>
                    <div className="text-xl font-semibold">{regularCustomer.orderCount}</div>
                  </div>
                  <Separator orientation="vertical" />
                  <div>
                    <div className="text-sm text-gray-500">Total Spend</div>
                    <div className="text-xl font-semibold">₹{regularCustomer.totalSpend.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sales Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Summary</CardTitle>
          <CardDescription>Sales breakdown by {bucket}</CardDescription>
        </CardHeader>
        <CardContent>
          {salesSummary.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No data available. Generate reports above.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{bucket === 'day' ? 'Date' : 'Week'}</TableHead>
                  <TableHead className="text-right">Total Orders</TableHead>
                  <TableHead className="text-right">Total Revenue</TableHead>
                  <TableHead className="text-right">Avg Order Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesSummary.map((item) => (
                  <TableRow key={item.date}>
                    <TableCell className="font-medium">{item.date}</TableCell>
                    <TableCell className="text-right">{item.totalOrders}</TableCell>
                    <TableCell className="text-right">₹{item.totalRevenue.toFixed(2)}</TableCell>
                    <TableCell className="text-right">₹{item.avgOrderValue.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

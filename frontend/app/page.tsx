'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="py-12">
      <h1 className="text-4xl font-bold mb-2">Welcome to Coffee Shop Management</h1>
      <p className="text-gray-600 mb-8">Manage your coffee shop inventory and customers efficiently</p>

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
      </div>
    </div>
  )
}

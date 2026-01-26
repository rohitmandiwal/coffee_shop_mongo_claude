'use client'

import { useState, useEffect } from 'react'
import { MenuDialog } from '@/components/menu/MenuDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/components/ui/toast'
import { getMenuItems, deleteMenuItem, toggleMenuItemAvailability, MenuItem } from '@/lib/api/menu'
import { formatCurrency } from '@/lib/utils/format'

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const { addToast } = useToast()

  const loadItems = async () => {
    try {
      setLoading(true)
      const data = await getMenuItems(1, 100, search)
      setItems(data)
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Failed to load menu items',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [search])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      await deleteMenuItem(id)
      addToast({
        type: 'success',
        title: 'Success',
        description: 'Menu item deleted',
      })
      loadItems()
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Failed to delete menu item',
      })
    }
  }

  const handleToggleAvailability = async (id: string) => {
    try {
      await toggleMenuItemAvailability(id)
      loadItems()
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Failed to toggle availability',
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Menu Items</h1>
        <MenuDialog onSuccess={loadItems} />
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Search menu items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-600">No menu items found</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                  <TableCell>{formatCurrency(item.price)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={item.isAvailable ? 'success' : 'destructive'}
                      onClick={() => handleToggleAvailability(item._id)}
                      className="cursor-pointer"
                    >
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </Badge>
                  </TableCell>
                  <TableCell className="space-x-2">
                    <MenuDialog item={item} onSuccess={loadItems} />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

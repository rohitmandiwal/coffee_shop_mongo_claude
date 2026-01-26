'use client'

import { useState, useEffect } from 'react'
import { CustomerDialog } from '@/components/customer/CustomerDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/components/ui/toast'
import { getCustomers, deleteCustomer, Customer } from '@/lib/api/customer'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const { addToast } = useToast()

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const data = await getCustomers(1, 100, search)
      setCustomers(data)
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Failed to load customers',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [search])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return

    try {
      await deleteCustomer(id)
      addToast({
        type: 'success',
        title: 'Success',
        description: 'Customer deleted',
      })
      loadCustomers()
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Failed to delete customer',
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Customers</h1>
        <CustomerDialog onSuccess={loadCustomers} />
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : customers.length === 0 ? (
        <p className="text-gray-600">No customers found</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer._id}>
                  <TableCell className="font-medium">{customer.fullName}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.email || '-'}</TableCell>
                  <TableCell className="max-w-xs truncate">{customer.notes || '-'}</TableCell>
                  <TableCell className="space-x-2">
                    <CustomerDialog customer={customer} onSuccess={loadCustomers} />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(customer._id)}
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

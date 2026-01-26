'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast'
import { customerFormSchema, CustomerFormData } from '@/lib/schemas/customer'
import { createCustomer, updateCustomer, Customer } from '@/lib/api/customer'

interface CustomerDialogProps {
  customer?: Customer
  onSuccess?: () => void
}

export function CustomerDialog({ customer, onSuccess }: CustomerDialogProps) {
  const [open, setOpen] = useState(false)
  const { addToast } = useToast()
  const isEditing = !!customer

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: customer || {},
  })

  const onSubmit = async (data: CustomerFormData) => {
    try {
      if (isEditing && customer) {
        await updateCustomer(customer._id, data)
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Customer updated successfully',
        })
      } else {
        await createCustomer(data)
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Customer created successfully',
        })
      }
      reset()
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save customer',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
        {isEditing ? 'Edit' : 'Add Customer'}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              {...register('fullName')}
              placeholder="Full name"
            />
            {errors.fullName && <span className="text-red-600 text-sm">{errors.fullName.message}</span>}
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="Phone number"
            />
            {errors.phone && <span className="text-red-600 text-sm">{errors.phone.message}</span>}
          </div>

          <div>
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="Email address"
            />
            {errors.email && <span className="text-red-600 text-sm">{errors.email.message}</span>}
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Additional notes"
            />
            {errors.notes && <span className="text-red-600 text-sm">{errors.notes.message}</span>}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast'
import { menuFormSchema, MenuFormData } from '@/lib/schemas/menu'
import { createMenuItem, updateMenuItem, MenuItem } from '@/lib/api/menu'

interface MenuDialogProps {
  item?: MenuItem
  onSuccess?: () => void
}

export function MenuDialog({ item, onSuccess }: MenuDialogProps) {
  const [open, setOpen] = useState(false)
  const { addToast } = useToast()
  const isEditing = !!item

  const { register, handleSubmit, formState: { errors }, reset } = useForm<MenuFormData>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: item || {
      isAvailable: true,
    },
  })

  const onSubmit = async (data: MenuFormData) => {
    try {
      if (isEditing && item) {
        await updateMenuItem(item._id, data)
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Menu item updated successfully',
        })
      } else {
        await createMenuItem(data)
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Menu item created successfully',
        })
      }
      reset()
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save menu item',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
        {isEditing ? 'Edit' : 'Add Menu Item'}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Item name"
            />
            {errors.name && <span className="text-red-600 text-sm">{errors.name.message}</span>}
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select {...register('category')} id="category">
              <option value="">Select a category</option>
              <option value="Coffee">Coffee</option>
              <option value="Tea">Tea</option>
              <option value="Pastry">Pastry</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Dessert">Dessert</option>
              <option value="Beverage">Beverage</option>
            </Select>
            {errors.category && <span className="text-red-600 text-sm">{errors.category.message}</span>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Item description"
            />
            {errors.description && <span className="text-red-600 text-sm">{errors.description.message}</span>}
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              {...register('price')}
              placeholder="0.00"
            />
            {errors.price && <span className="text-red-600 text-sm">{errors.price.message}</span>}
          </div>

          <div className="flex items-center gap-2">
            <input
              id="isAvailable"
              type="checkbox"
              {...register('isAvailable')}
              className="h-4 w-4"
            />
            <Label htmlFor="isAvailable" className="m-0 cursor-pointer">Available</Label>
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

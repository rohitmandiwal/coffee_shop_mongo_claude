'use client'

import * as React from "react"
import { cn } from "@/lib/utils/cn"

type ToastActionElement = React.ReactElement<any>

export interface Toast {
  id: string
  title?: string
  description?: string
  action?: ToastActionElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
  type?: 'default' | 'success' | 'error' | 'warning'
}

const ToastContext = React.createContext<{
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
} | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id, open: true }
    setToasts((prev) => [...prev, newToast])

    setTimeout(() => {
      removeToast(id)
    }, 3000)
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

function ToastContainer() {
  const { toasts } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useToast()

  const typeStyles = {
    default: 'bg-gray-900 text-white',
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    warning: 'bg-yellow-600 text-white',
  }

  return (
    <div
      className={cn(
        'p-4 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-4',
        typeStyles[toast.type || 'default']
      )}
      role="alert"
    >
      {toast.title && <div className="font-semibold">{toast.title}</div>}
      {toast.description && <div className="text-sm mt-1">{toast.description}</div>}
      <button
        onClick={() => removeToast(toast.id)}
        className="absolute top-2 right-2 text-white hover:opacity-70"
      >
        ✕
      </button>
    </div>
  )
}

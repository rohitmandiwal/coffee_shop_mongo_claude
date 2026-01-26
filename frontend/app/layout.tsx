import type { Metadata } from 'next'
import { ToastProvider } from '@/components/ui/toast'
import './globals.css'

export const metadata: Metadata = {
  title: 'Coffee Shop Management',
  description: 'Manage your coffee shop menu and customers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <nav className="bg-blue-600 text-white shadow">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold">☕ Coffee Shop</h1>
              <div className="flex gap-4">
                <a href="/" className="hover:bg-blue-700 px-3 py-2 rounded">Home</a>
                <a href="/menu" className="hover:bg-blue-700 px-3 py-2 rounded">Menu</a>
                <a href="/customers" className="hover:bg-blue-700 px-3 py-2 rounded">Customers</a>
              </div>
            </div>
          </nav>
          <main className="max-w-6xl mx-auto px-4 py-8">
            {children}
          </main>
        </ToastProvider>
      </body>
    </html>
  )
}

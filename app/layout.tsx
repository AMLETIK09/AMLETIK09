import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import { CartProvider } from '@/components/CartProvider'

export const metadata: Metadata = {
  title: 'Marketplace',
  description: 'Покупайте и продавайте товары',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>
        <AuthProvider>
          <CartProvider>
          {/* Mobile blocker: visible only on small screens (hide on md and up) */}
          <div className="md:hidden fixed inset-0 z-[9999] bg-white flex items-center justify-center p-6">
            <div className="max-w-md text-center">
              <h1 className="text-2xl font-bold mb-4">Сайт только для ПК</h1>
              <p className="text-gray-700 mb-4">В данный момент сайт оптимизирован только для просмотра с компьютера. Пожалуйста, откройте сайт на десктопном устройстве для корректной работы.</p>
              <p className="text-sm text-gray-500">Если вы всё же хотите продолжить, откройте сайт в настольном браузере на вашем устройстве.</p>
            </div>
          </div>
          {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
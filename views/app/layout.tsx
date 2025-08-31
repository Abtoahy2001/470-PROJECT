import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Navbar } from '@/components/navbar'
import { Toaster } from '@/components/ui/sonner'
import { Footer } from '@/components/footer'
import Footer04Page from '@/components/footer-04/footer-04'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ShopHub - Your Ultimate Shopping Destination',
  description: 'Discover amazing products at great prices',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer04Page/>
            <Toaster />
          </ThemeProvider>
      </body>
    </html>
  )
}

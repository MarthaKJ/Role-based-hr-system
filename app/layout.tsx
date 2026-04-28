import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/context/auth-context'
import { EmployeesProvider } from '@/context/employees-context'
import { RequestsProvider } from '@/context/requests-context'
import { PayslipsProvider } from '@/context/payslips-context'
import { StoreProvider } from '@/context/store-context'
import { AppraisalsProvider } from '@/context/appraisals-context'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'IDRC HR Management System',
  description: 'Employee HR Management Portal',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <EmployeesProvider>
            <AuthProvider>
              <RequestsProvider>
                <PayslipsProvider>
                  <StoreProvider>
                    <AppraisalsProvider>{children}</AppraisalsProvider>
                  </StoreProvider>
                </PayslipsProvider>
              </RequestsProvider>
            </AuthProvider>
          </EmployeesProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

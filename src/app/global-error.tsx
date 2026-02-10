'use client'

import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="container flex min-h-screen flex-col items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-16 w-16 text-destructive" />
            <h2 className="mt-4 text-2xl font-bold">Error Global</h2>
            <p className="mt-2 text-muted-foreground">
              Terjadi kesalahan sistem yang serius.
            </p>
            <Button onClick={reset} className="mt-4">
              Restart Aplikasi
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}

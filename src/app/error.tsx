'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <AlertTriangle className="mx-auto h-16 w-16 text-destructive" />
        <h2 className="mt-4 text-2xl font-bold">Terjadi Kesalahan</h2>
        <p className="mt-2 text-muted-foreground">
          Maaf, terjadi kesalahan yang tidak terduga.
        </p>
        <Button onClick={reset} className="mt-4">
          Coba Lagi
        </Button>
      </div>
    </div>
  )
}

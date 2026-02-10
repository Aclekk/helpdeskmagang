export default function Loading() {
  return (
    <div className="container flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-2 text-muted-foreground">Memuat...</p>
      </div>
    </div>
  )
}

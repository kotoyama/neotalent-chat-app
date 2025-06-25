export const qs = (params: Record<string, unknown>) => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
      searchParams.set(k, String(v))
    }
  })

  const result = searchParams.toString()
  return result ? `?${result}` : ''
}

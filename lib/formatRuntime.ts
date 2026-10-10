/** A runtime in minutes as hours and minutes: 166 → "2h 46m", 120 → "2h", 45 → "45m". */
export const formatRuntime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) {
    return `${rest}m`
  }
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`
}

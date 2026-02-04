export const getLocalDateStringByTimeZone = (timeZone: string, timestamp?: number) => {
  if (!timestamp) {
    timestamp = Date.now()
  }

  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  return formatter.format(new Date(timestamp))
}

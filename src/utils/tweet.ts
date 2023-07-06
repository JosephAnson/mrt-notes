export function tweet(): void {
  const width = 575
  const height = 400
  const left = (window.screen.width - width) / 2
  const top = (window.screen.height - height) / 2
  const url = `https://twitter.com/share?url=${encodeURIComponent(
    'https://mrt-notes.vercel.app/',
  )}&text=MRT Notes: Quick build MRT Notes to use in WoW&hashtags=MRTNotes`
  const opts = `status=1,width=${width},height=${height},top=${top},left=${left}`

  window.open(url, '', opts)
}

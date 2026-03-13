export const compressImage = async (file: File) => {
  const imageUrl = URL.createObjectURL(file)
  try {
    const image = new Image()
    const imageLoaded = new Promise<HTMLImageElement>((resolve, reject) => {
      image.onload = () => resolve(image)
      image.onerror = (event) => reject(event)
    })
    image.src = imageUrl

    const img = await imageLoaded
    const maxSize = 1280
    const ratio = Math.min(1, maxSize / Math.max(img.width, img.height))
    const width = Math.round(img.width * ratio)
    const height = Math.round(img.height * ratio)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    if (!ctx) return file

    ctx.drawImage(img, 0, 0, width, height)

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.8)
    })

    if (!blob) return file

    return new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
      type: 'image/jpeg',
      lastModified: Date.now(),
    })
  } finally {
    URL.revokeObjectURL(imageUrl)
  }
}

export interface CompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  maxSizeKB?: number
}

export const compressImage = (
  file: File, 
  options: CompressionOptions = {}
): Promise<File> => {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    maxSizeKB = 512
  } = options

  return new Promise((resolve, reject) => {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      resolve(file) // Return original file if not an image
      return
    }

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }

      canvas.width = width
      canvas.height = height

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to compress image'))
          return
        }

        // Check if compressed size is acceptable
        const compressedSizeKB = blob.size / 1024
        
        if (compressedSizeKB > maxSizeKB) {
          // Try with lower quality
          const lowerQuality = Math.max(0.1, quality - 0.2)
          canvas.toBlob((secondBlob) => {
            if (!secondBlob) {
              reject(new Error('Failed to compress image'))
              return
            }
            
            const compressedFile = new File([secondBlob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(compressedFile)
          }, file.type, lowerQuality)
        } else {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          })
          resolve(compressedFile)
        }
      }, file.type, quality)
    }

    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}
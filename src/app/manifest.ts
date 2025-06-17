import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Viet Lien',
    short_name: 'Viet Lien',
    description: 'Task Management System',
    start_url: '/login',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: 'public/images/icons/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'public/images/icons/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
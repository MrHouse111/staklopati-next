import './globals.css'

export const metadata = {
  title: 'ŠtaKlopati',
  description: 'Lokalni AI jelovnik i vodič kroz restorane',
}

export default function RootLayout({ children }) {
  return (
    <html lang="sr">
      <body className="bg-[#121212] text-white">{children}</body>
    </html>
  )
}

import './globals.css'

export const metadata = {
  title: 'LightLife',
  description: 'Tu libreta de vida',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}

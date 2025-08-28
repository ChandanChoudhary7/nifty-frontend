import './globals.css'

export const metadata = {
  title: 'Live Nifty Tracker',
  description: 'Real-time Nifty 50 price tracking with live data',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

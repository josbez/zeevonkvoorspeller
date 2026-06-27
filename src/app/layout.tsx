import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Zeevonkvoorspeller',
  description:
    'Wanneer en waar is zeevonk zichtbaar? Dagelijkse kansvoorspelling per locatie voor de Nederlandse en Belgische kust en estuaria.',
  keywords: ['zeevonk', 'bioluminescentie', 'Noctiluca scintillans', 'voorspelling', 'kust'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className="h-full">
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  )
}

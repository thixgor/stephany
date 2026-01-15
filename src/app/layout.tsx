import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Dra. Stephany Rodrigues | Medicina Veterinária Domiciliar - Rio de Janeiro',
  description: 'Atendimento veterinário domiciliar no Rio de Janeiro. Consultas para cães, gatos e pets exóticos (aves, répteis, roedores). Dra. Stephany Rodrigues - CRMV-RJ 22404.',
  keywords: [
    'veterinário domiciliar',
    'veterinária a domicílio',
    'veterinário Rio de Janeiro',
    'pets exóticos',
    'aves',
    'répteis',
    'roedores',
    'vacinação pet',
    'consulta veterinária',
    'Dra. Stephany Rodrigues',
    'CRMV-RJ 22404',
  ],
  authors: [{ name: 'Dra. Stephany Rodrigues' }],
  creator: 'Dra. Stephany Rodrigues',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://stephanyrodrigues.vet.br',
    title: 'Dra. Stephany Rodrigues | Medicina Veterinária Domiciliar',
    description: 'Atendimento veterinário domiciliar com carinho e profissionalismo. Cães, gatos e pets exóticos.',
    siteName: 'Stephany Rodrigues Medicina Veterinária',
    images: [
      {
        url: 'https://i.imgur.com/TS2KcZh.png',
        width: 1200,
        height: 630,
        alt: 'Stephany Rodrigues Medicina Veterinária',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dra. Stephany Rodrigues | Medicina Veterinária Domiciliar',
    description: 'Atendimento veterinário domiciliar no Rio de Janeiro.',
    images: ['https://i.imgur.com/TS2KcZh.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
                <link rel="icon" href="/favicon.svg" />
        <meta name="theme-color" content="#06695C" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

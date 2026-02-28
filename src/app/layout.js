import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Product Store - Next.js 14 App',
  description: 'A sample e-commerce store built with Next.js 14 and React 18',
  keywords: ['nextjs', 'react', 'e-commerce'],
  openGraph: {
    title: 'Product Store',
    description: 'Browse our amazing products',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="navbar">
          <a href="/">Home</a>
          <a href="/products">Products</a>
        </nav>
        <main>{children}</main>
        <footer>
          <p>&copy; 2024 Product Store</p>
        </footer>
      </body>
    </html>
  );
}

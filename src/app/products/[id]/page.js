import Link from 'next/link';
import { notFound } from 'next/navigation';

const products = [
  { id: 1, name: 'Wireless Headphones', price: 79.99, category: 'electronics', description: 'Premium noise-cancelling wireless headphones with 30-hour battery life.' },
  { id: 2, name: 'Running Shoes', price: 129.99, category: 'clothing', description: 'Lightweight running shoes with responsive cushioning for everyday training.' },
  { id: 3, name: 'JavaScript: The Good Parts', price: 29.99, category: 'books', description: 'A deep dive into the beautiful features of JavaScript by Douglas Crockford.' },
  { id: 4, name: 'USB-C Hub', price: 49.99, category: 'electronics', description: '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and PD charging.' },
  { id: 5, name: 'Winter Jacket', price: 199.99, category: 'clothing', description: 'Insulated waterproof winter jacket rated for temperatures down to -20°F.' },
];

// Next.js 14: params is a plain object, accessed synchronously
// Next.js 15 BREAKING CHANGE: params becomes a Promise, must be awaited
export async function generateMetadata({ params }) {
  // Synchronous access — works in Next 14, breaks in Next 15
  const product = products.find((p) => p.id === parseInt(params.id, 10));

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: `${product.name} - Product Store`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
    },
  };
}

// Next.js 14: params.id accessed synchronously
// Next.js 15 BREAKING CHANGE: params must be awaited
export default function ProductDetailPage({ params }) {
  const productId = parseInt(params.id, 10);
  const product = products.find((p) => p.id === productId);

  if (!product) {
    notFound();
  }

  return (
    <div className="product-detail">
      <Link href="/products" className="back-link">
        &larr; Back to Products
      </Link>

      <h1>{product.name}</h1>
      <p className="price">${product.price.toFixed(2)}</p>
      <p className="category">Category: {product.category}</p>
      <p className="description">{product.description}</p>

      <div className="actions">
        <button className="add-to-cart">Add to Cart</button>
        <button className="wishlist">Add to Wishlist</button>
      </div>

      <div className="related">
        <h2>Related Products</h2>
        {products
          .filter((p) => p.category === product.category && p.id !== product.id)
          .map((p) => (
            <Link key={p.id} href={`/products/${p.id}`} className="related-item">
              {p.name} — ${p.price.toFixed(2)}
            </Link>
          ))}
      </div>
    </div>
  );
}

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container">
      <h1>Welcome to Product Store</h1>
      <p>Browse our amazing collection of products.</p>

      <div className="hero-section">
        <h2>Featured Products</h2>
        <p>Discover the best deals and newest arrivals.</p>
        <Link href="/products">
          Browse All Products
        </Link>
      </div>

      <div className="categories">
        <div className="category-card">
          <h3>Electronics</h3>
          <Link href="/products?category=electronics">Shop Now</Link>
        </div>
        <div className="category-card">
          <h3>Clothing</h3>
          <Link href="/products?category=clothing">Shop Now</Link>
        </div>
        <div className="category-card">
          <h3>Books</h3>
          <Link href="/products?category=books">Shop Now</Link>
        </div>
      </div>
    </div>
  );
}

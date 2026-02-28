import Link from 'next/link';

// Mock product data — in production this would come from a database
const products = [
  { id: 1, name: 'Wireless Headphones', price: 79.99, category: 'electronics' },
  { id: 2, name: 'Running Shoes', price: 129.99, category: 'clothing' },
  { id: 3, name: 'JavaScript: The Good Parts', price: 29.99, category: 'books' },
  { id: 4, name: 'USB-C Hub', price: 49.99, category: 'electronics' },
  { id: 5, name: 'Winter Jacket', price: 199.99, category: 'clothing' },
];

// Next.js 14: searchParams is a plain object accessed synchronously
// Next.js 15 BREAKING CHANGE: searchParams becomes a Promise, must be awaited
export default function ProductsPage({ searchParams }) {
  // Synchronous access — works in Next 14, breaks in Next 15
  const category = searchParams.category;
  const sort = searchParams.sort || 'name';
  const page = parseInt(searchParams.page || '1', 10);

  const filteredProducts = category
    ? products.filter((p) => p.category === category)
    : products;

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === 'price') return a.price - b.price;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="products-page">
      <h1>Products</h1>

      {category && (
        <p className="filter-info">
          Filtering by: <strong>{category}</strong>
          {' — '}
          <Link href="/products">Clear filter</Link>
        </p>
      )}

      <div className="sort-controls">
        <Link href={`/products?sort=name${category ? `&category=${category}` : ''}`}>
          Sort by Name
        </Link>
        <Link href={`/products?sort=price${category ? `&category=${category}` : ''}`}>
          Sort by Price
        </Link>
      </div>

      <div className="product-grid">
        {sortedProducts.map((product) => (
          <div key={product.id} className="product-card">
            <h2>{product.name}</h2>
            <p className="price">${product.price.toFixed(2)}</p>
            <p className="category">{product.category}</p>
            <Link href={`/products/${product.id}`}>View Details</Link>
          </div>
        ))}
      </div>

      <p className="page-info">Page {page}</p>
    </div>
  );
}

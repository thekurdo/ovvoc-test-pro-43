import React from 'react';
import Link from 'next/link';

// React 18: defaultProps is supported but deprecated
// React 19 BREAKING CHANGE: defaultProps removed for function components
const ProductCard = React.forwardRef(function ProductCard(
  { id, name, price, category, featured, onAddToCart },
  ref
) {
  const formattedPrice = `$${price.toFixed(2)}`;

  return (
    <div
      ref={ref}
      className={`product-card ${featured ? 'product-card--featured' : ''}`}
      data-category={category}
    >
      {featured && <span className="badge">Featured</span>}

      <div className="product-card__content">
        <h3 className="product-card__name">{name}</h3>
        <p className="product-card__price">{formattedPrice}</p>
        <p className="product-card__category">{category}</p>
      </div>

      <div className="product-card__actions">
        <Link href={`/products/${id}`} className="product-card__link">
          View Details
        </Link>
        <button
          onClick={() => onAddToCart({ id, name, price })}
          className="product-card__add-btn"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
});

// React 18 pattern — defaultProps for function components
// React 19 BREAKING CHANGE: defaultProps no longer applied for function components
ProductCard.defaultProps = {
  featured: false,
  category: 'uncategorized',
  onAddToCart: () => {},
};

ProductCard.displayName = 'ProductCard';

export default ProductCard;

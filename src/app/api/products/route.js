import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';

const products = [
  { id: 1, name: 'Wireless Headphones', price: 79.99, category: 'electronics' },
  { id: 2, name: 'Running Shoes', price: 129.99, category: 'clothing' },
  { id: 3, name: 'JavaScript: The Good Parts', price: 29.99, category: 'books' },
  { id: 4, name: 'USB-C Hub', price: 49.99, category: 'electronics' },
  { id: 5, name: 'Winter Jacket', price: 199.99, category: 'clothing' },
];

// Next.js 14: cookies() and headers() are synchronous
// Next.js 15 BREAKING CHANGE: cookies() and headers() return Promises, must be awaited
export async function GET(request) {
  // Synchronous access — works in Next 14, breaks in Next 15
  const cookieStore = cookies();
  const headersList = headers();

  const authToken = cookieStore.get('auth-token');
  const userAgent = headersList.get('user-agent');
  const acceptLanguage = headersList.get('accept-language');

  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  let result = products;

  if (category) {
    result = result.filter((p) => p.category === category);
  }

  result = result.slice(0, limit);

  return NextResponse.json({
    products: result,
    total: result.length,
    authenticated: !!authToken,
    meta: {
      userAgent: userAgent || 'unknown',
      language: acceptLanguage || 'en',
    },
  });
}

export async function POST(request) {
  // Synchronous access — works in Next 14, breaks in Next 15
  const cookieStore = cookies();
  const authToken = cookieStore.get('auth-token');

  if (!authToken) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const body = await request.json();

  if (!body.name || !body.price || !body.category) {
    return NextResponse.json(
      { error: 'Missing required fields: name, price, category' },
      { status: 400 }
    );
  }

  const newProduct = {
    id: products.length + 1,
    name: body.name,
    price: parseFloat(body.price),
    category: body.category,
  };

  return NextResponse.json(newProduct, { status: 201 });
}

const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  PASS: ${name}`);
    passed++;
  } catch (err) {
    console.log(`  FAIL: ${name}`);
    console.log(`        ${err.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

const root = path.resolve(__dirname, '..');

console.log('Running ovvoc-test-pro-43 tests...\n');

// ── next.config.js structure tests ──

const configPath = path.join(root, 'next.config.js');
const configContent = fs.readFileSync(configPath, 'utf8');

test('next.config.js exists', () => {
  assert(fs.existsSync(configPath), 'next.config.js not found');
});

test('next.config.js exports nextConfig', () => {
  assert(configContent.includes('module.exports = nextConfig'), 'Missing module.exports = nextConfig');
});

test('next.config.js has images.domains (v14 style)', () => {
  assert(configContent.includes('domains:'), 'Missing images.domains');
  assert(configContent.includes("'cdn.example.com'"), 'Missing cdn.example.com domain');
  assert(configContent.includes("'api.example.com'"), 'Missing api.example.com domain');
});

test('next.config.js has experimental.serverComponentsExternalPackages', () => {
  assert(
    configContent.includes('serverComponentsExternalPackages'),
    'Missing experimental.serverComponentsExternalPackages'
  );
  assert(configContent.includes("'bcrypt'"), 'Missing bcrypt in external packages');
});

test('next.config.js has webpack customization', () => {
  assert(configContent.includes('webpack:'), 'Missing webpack config');
  assert(configContent.includes('isServer'), 'Missing isServer check in webpack');
});

test('next.config.js has reactStrictMode', () => {
  assert(configContent.includes('reactStrictMode: true'), 'Missing reactStrictMode');
});

// ── package.json version tests ──

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

test('package.json has next 14.x', () => {
  assert(pkg.dependencies.next.startsWith('14.'), `Expected next 14.x, got ${pkg.dependencies.next}`);
});

test('package.json has react 18.x', () => {
  assert(pkg.dependencies.react.startsWith('18.'), `Expected react 18.x, got ${pkg.dependencies.react}`);
});

test('package.json has react-dom 18.x', () => {
  assert(pkg.dependencies['react-dom'].startsWith('18.'), `Expected react-dom 18.x, got ${pkg.dependencies['react-dom']}`);
});

// ── Page file existence tests ──

test('src/app/layout.js exists', () => {
  assert(fs.existsSync(path.join(root, 'src/app/layout.js')), 'layout.js not found');
});

test('src/app/page.js exists', () => {
  assert(fs.existsSync(path.join(root, 'src/app/page.js')), 'page.js not found');
});

test('src/app/products/page.js exists', () => {
  assert(fs.existsSync(path.join(root, 'src/app/products/page.js')), 'products/page.js not found');
});

test('src/app/products/[id]/page.js exists', () => {
  assert(fs.existsSync(path.join(root, 'src/app/products/[id]/page.js')), 'products/[id]/page.js not found');
});

test('src/app/api/products/route.js exists', () => {
  assert(fs.existsSync(path.join(root, 'src/app/api/products/route.js')), 'api/products/route.js not found');
});

// ── Component file tests ──

test('src/components/ProductCard.js exists', () => {
  assert(fs.existsSync(path.join(root, 'src/components/ProductCard.js')), 'ProductCard.js not found');
});

const cardContent = fs.readFileSync(path.join(root, 'src/components/ProductCard.js'), 'utf8');

test('ProductCard uses React.forwardRef', () => {
  assert(cardContent.includes('React.forwardRef'), 'Missing React.forwardRef');
});

test('ProductCard has defaultProps (v18 pattern)', () => {
  assert(cardContent.includes('defaultProps'), 'Missing defaultProps');
  assert(cardContent.includes("featured: false"), 'Missing featured default');
});

// ── Products page pattern tests ──

const productsContent = fs.readFileSync(path.join(root, 'src/app/products/page.js'), 'utf8');

test('Products page uses synchronous searchParams (v14 pattern)', () => {
  assert(productsContent.includes('{ searchParams }'), 'Missing searchParams destructuring');
  assert(productsContent.includes('searchParams.category'), 'Missing synchronous searchParams.category access');
  assert(!productsContent.includes('await searchParams'), 'Should NOT await searchParams in v14');
});

// ── Product detail page pattern tests ──

const detailContent = fs.readFileSync(path.join(root, 'src/app/products/[id]/page.js'), 'utf8');

test('Product detail uses synchronous params (v14 pattern)', () => {
  assert(detailContent.includes('params.id'), 'Missing synchronous params.id access');
  assert(!detailContent.includes('await params'), 'Should NOT await params in v14');
});

test('Product detail has generateMetadata', () => {
  assert(detailContent.includes('generateMetadata'), 'Missing generateMetadata');
});

// ── API route pattern tests ──

const routeContent = fs.readFileSync(path.join(root, 'src/app/api/products/route.js'), 'utf8');

test('API route uses synchronous cookies() (v14 pattern)', () => {
  assert(routeContent.includes('cookies()'), 'Missing cookies() call');
  assert(!routeContent.includes('await cookies()'), 'Should NOT await cookies() in v14');
});

test('API route uses synchronous headers() (v14 pattern)', () => {
  assert(routeContent.includes('headers()'), 'Missing headers() call');
  assert(!routeContent.includes('await headers()'), 'Should NOT await headers() in v14');
});

test('API route uses NextResponse', () => {
  assert(routeContent.includes('NextResponse.json'), 'Missing NextResponse.json');
});

// ── Layout tests ──

const layoutContent = fs.readFileSync(path.join(root, 'src/app/layout.js'), 'utf8');

test('Layout exports metadata', () => {
  assert(layoutContent.includes('export const metadata'), 'Missing metadata export');
});

test('Layout has RootLayout default export', () => {
  assert(layoutContent.includes('export default function RootLayout'), 'Missing RootLayout export');
});

// ── Summary ──

console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  process.exit(1);
}

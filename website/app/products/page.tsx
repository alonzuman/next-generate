import { listProducts } from './actions';
  import Link from 'next/link';
  
  export default async function ProductsPage() {
    const products = await listProducts();
  
    return (
      <div>
        <h1>Products</h1>
        <Link href="/products/new">Create New Product</Link>
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <Link href={`/products/${product.id}`}>
                <pre>
                  {JSON.stringify(product, null, 2)}
                </pre>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
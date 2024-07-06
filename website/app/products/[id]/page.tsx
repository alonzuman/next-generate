
  import { getProduct } from '../actions';
  import { notFound } from 'next/navigation';
  
  export default async function ProductPage({ params }: { params: { id: string } }) {
    const product = await getProduct(params.id);
  
    if (!product) {
      return notFound()
    }
  
    return (
      <div>
        <h1>Product Details</h1>
        <pre>{JSON.stringify(product, null, 2)}</pre>
      </div>
    );
  }
  
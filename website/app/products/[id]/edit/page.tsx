
  import { ProductForm } from '../../product-form';
  import { getProduct, updateProduct } from '../../actions';
  import { notFound } from 'next/navigation';
  
  export default async function EditProductPage({ params }: { params: { id: string } }) {
    const product = await getProduct(params.id);
  
    if (!product) {
      return notFound()
    }
  
    return (
      <div>
        <h1>Edit Product</h1>
        <ProductForm action={updateProduct} defaultValues={product} />
      </div>
    );
  }
  

  import { ProductForm } from '../product-form';
  import { createProduct } from '../actions';
  
  export default function NewProductPage() {
    return (
      <div>
        <h1>Create New Product</h1>
        <ProductForm action={createProduct} />
      </div>
    );
  }
  
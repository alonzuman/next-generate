"use server";
  
  import {
    CreateProductInputSchema,
    UpdateProductInputSchema,
    DeleteProductInputSchema,
    createProductInputSchema,
    updateProductInputSchema,
    deleteProductInputSchema,
    ProductSchema,
  } from "./schemas";
  
  export async function createProduct(
    data: CreateProductInputSchema
  ): Promise<ProductSchema> {
    // TODO: Implement authentication and authorization logic
    const validated = createProductInputSchema.parse(data);
    // TODO: Implement create logic
    console.log("Creating Product:", validated);
  }
  
  export async function getProduct(id: string): Promise<ProductSchema> {
    // TODO: Implement authentication and authorization logic  
    // TODO: Implement get logic
    console.log("Getting Product with id:", id);
  }
  
  export async function updateProduct(
    data: UpdateProductInputSchema
  ): Promise<ProductSchema | null> {
    // TODO: Implement authentication and authorization logic
    const validated = updateProductInputSchema.parse(data);
    // TODO: Implement update logic
    console.log("Updating Product:", validated);
  }
  
  export async function deleteProduct(data: DeleteProductInputSchema): Promise<void> {
    // TODO: Implement authentication and authorization logic  
    const validated = deleteProductInputSchema.parse(data);
    // TODO: Implement delete logic
    console.log("Deleting Product with id:", validated.id);
  }
  
  export async function listProducts(): Promise<ProductSchema[]> {
    // TODO: Implement authentication and authorization logic  
    // TODO: Implement list logic
    console.log("Listing Products");
    return []
  }
  
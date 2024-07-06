
  import { z } from 'zod';
  
  export const productSchema = z.object({
    id: z.number(),
    name: z.string().min(3),
    price: z.number().positive(),
    category: z.string().optional()
  });
  export type ProductSchema = z.infer<typeof productSchema>;
  
  export const createProductInputSchema = productSchema.omit({ id: true });
  export type CreateProductInputSchema = z.infer<typeof createProductInputSchema>;
  
  export const updateProductInputSchema = productSchema;
  export type UpdateProductInputSchema = z.infer<typeof updateProductInputSchema>;
  
  export const deleteProductInputSchema = z.object({ id: z.string() });
  export type DeleteProductInputSchema = z.infer<typeof deleteProductInputSchema>;
  
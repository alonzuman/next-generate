
  import { z } from 'zod';
  
  export const postSchema = z.object({
    id: z.string().uuid(),
    title: z.string().max(100),
    content: z.string(),
    published: z.boolean()
  });
  export type PostSchema = z.infer<typeof postSchema>;
  
  export const createPostInputSchema = postSchema.omit({ id: true });
  export type CreatePostInputSchema = z.infer<typeof createPostInputSchema>;
  
  export const updatePostInputSchema = postSchema;
  export type UpdatePostInputSchema = z.infer<typeof updatePostInputSchema>;
  
  export const deletePostInputSchema = z.object({ id: z.string() });
  export type DeletePostInputSchema = z.infer<typeof deletePostInputSchema>;
  

import { z } from 'zod';

export const postSchema = z.object({
  id: z.string(),
title: z.string().min(1).max(100),
body: z.string().min(5),
slug: z.string().regex(/^[a-z0-9-]+$/).min(3).max(50)
});
export type PostSchema = z.infer<typeof postSchema>;

export const createPostInputSchema = postSchema.omit({ id: true });
export type CreatePostInputSchema = z.infer<typeof createPostInputSchema>;

export const updatePostInputSchema = postSchema;
export type UpdatePostInputSchema = z.infer<typeof updatePostInputSchema>;

export const deletePostInputSchema = z.object({ id: z.string() });
export type DeletePostInputSchema = z.infer<typeof deletePostInputSchema>;
    
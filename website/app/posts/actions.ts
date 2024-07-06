"use server";
  
  import {
    CreatePostInputSchema,
    UpdatePostInputSchema,
    DeletePostInputSchema,
    createPostInputSchema,
    updatePostInputSchema,
    deletePostInputSchema,
    PostSchema,
  } from "./schemas";
  
  export async function createPost(
    data: CreatePostInputSchema
  ): Promise<PostSchema> {
    // TODO: Implement authentication and authorization logic
    const validated = createPostInputSchema.parse(data);
    // TODO: Implement create logic
    console.log("Creating Post:", validated);
  }
  
  export async function getPost(id: string): Promise<PostSchema> {
    // TODO: Implement authentication and authorization logic  
    // TODO: Implement get logic
    console.log("Getting Post with id:", id);
  }
  
  export async function updatePost(
    data: UpdatePostInputSchema
  ): Promise<PostSchema | null> {
    // TODO: Implement authentication and authorization logic
    const validated = updatePostInputSchema.parse(data);
    // TODO: Implement update logic
    console.log("Updating Post:", validated);
  }
  
  export async function deletePost(data: DeletePostInputSchema): Promise<void> {
    // TODO: Implement authentication and authorization logic  
    const validated = deletePostInputSchema.parse(data);
    // TODO: Implement delete logic
    console.log("Deleting Post with id:", validated.id);
  }
  
  export async function listPosts(): Promise<PostSchema[]> {
    // TODO: Implement authentication and authorization logic  
    // TODO: Implement list logic
    console.log("Listing Posts");
    return []
  }
  
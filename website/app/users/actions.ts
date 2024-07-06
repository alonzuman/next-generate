"use server";
  
  import {
    CreateUserInputSchema,
    UpdateUserInputSchema,
    DeleteUserInputSchema,
    createUserInputSchema,
    updateUserInputSchema,
    deleteUserInputSchema,
    UserSchema,
  } from "./schemas";
  
  export async function createUser(
    data: CreateUserInputSchema
  ): Promise<UserSchema> {
    // TODO: Implement authentication and authorization logic
    const validated = createUserInputSchema.parse(data);
    // TODO: Implement create logic
    console.log("Creating User:", validated);
  }
  
  export async function getUser(id: string): Promise<UserSchema> {
    // TODO: Implement authentication and authorization logic  
    // TODO: Implement get logic
    console.log("Getting User with id:", id);
  }
  
  export async function updateUser(
    data: UpdateUserInputSchema
  ): Promise<UserSchema | null> {
    // TODO: Implement authentication and authorization logic
    const validated = updateUserInputSchema.parse(data);
    // TODO: Implement update logic
    console.log("Updating User:", validated);
  }
  
  export async function deleteUser(data: DeleteUserInputSchema): Promise<void> {
    // TODO: Implement authentication and authorization logic  
    const validated = deleteUserInputSchema.parse(data);
    // TODO: Implement delete logic
    console.log("Deleting User with id:", validated.id);
  }
  
  export async function listUsers(): Promise<UserSchema[]> {
    // TODO: Implement authentication and authorization logic  
    // TODO: Implement list logic
    console.log("Listing Users");
    return []
  }
  
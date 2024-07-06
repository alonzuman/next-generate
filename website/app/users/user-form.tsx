"use client";
  import React, { useState } from "react";
  import {
    CreateUserInputSchema,
    UserSchema,
    UpdateUserInputSchema,
  } from "./schemas";
  import { useRouter } from "next/navigation";
  
  interface UserFormProps {
    action: (
      data: CreateUserInputSchema | UpdateUserInputSchema
    ) => Promise<UserSchema>;
    defaultValues?: UpdateUserInputSchema;
  }
  
  export function UserForm({ action, defaultValues }: UserFormProps) {
    const [formData, setFormData] = useState<Partial<UpdateUserInputSchema>>(
      defaultValues || {}
    );
    const router = useRouter();
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        await action(formData as UpdateUserInputSchema);
        // Handle successful submission (e.g., show a success message, redirect, etc.)
        // For example:
        router.push(`/users`);
      } catch (error) {
        // Handle error (e.g., show error message)
        console.error("Error submitting form:", error);
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        
          <div>
            <label htmlFor="image">Image</label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image || ''}
              onChange={handleInputChange}
              required
            />
          </div>
    

          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              required
            />
          </div>
    

          <div>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email || ''}
              onChange={handleInputChange}
              required
            />
          </div>
    

          <div>
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age || ''}
              onChange={handleInputChange}
              required
            />
          </div>
    
        <button type="submit">Submit</button>
      </form>
    );
  }
  
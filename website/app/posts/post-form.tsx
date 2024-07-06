"use client";
  import React, { useState } from "react";
  import {
    CreatePostInputSchema,
    PostSchema,
    UpdatePostInputSchema,
  } from "./schemas";
  import { useRouter } from "next/navigation";
  
  interface PostFormProps {
    action: (
      data: CreatePostInputSchema | UpdatePostInputSchema
    ) => Promise<PostSchema>;
    defaultValues?: UpdatePostInputSchema;
  }
  
  export function PostForm({ action, defaultValues }: PostFormProps) {
    const [formData, setFormData] = useState<Partial<UpdatePostInputSchema>>(
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
        await action(formData as UpdatePostInputSchema);
        // Handle successful submission (e.g., show a success message, redirect, etc.)
        // For example:
        router.push(`/posts`);
      } catch (error) {
        // Handle error (e.g., show error message)
        console.error("Error submitting form:", error);
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        
          <div>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title || ''}
              onChange={handleInputChange}
              required
            />
          </div>
    

          <div>
            <label htmlFor="body">Body</label>
            <input
              type="text"
              id="body"
              name="body"
              value={formData.body || ''}
              onChange={handleInputChange}
              required
            />
          </div>
    
        <button type="submit">Submit</button>
      </form>
    );
  }
  
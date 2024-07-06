"use client";
  import React, { useState } from "react";
  import {
    CreateProductInputSchema,
    ProductSchema,
    UpdateProductInputSchema,
  } from "./schemas";
  import { useRouter } from "next/navigation";
  
  interface ProductFormProps {
    action: (
      data: CreateProductInputSchema | UpdateProductInputSchema
    ) => Promise<ProductSchema>;
    defaultValues?: UpdateProductInputSchema;
  }
  
  export function ProductForm({ action, defaultValues }: ProductFormProps) {
    const [formData, setFormData] = useState<Partial<UpdateProductInputSchema>>(
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
        await action(formData as UpdateProductInputSchema);
        // Handle successful submission (e.g., show a success message, redirect, etc.)
        // For example:
        router.push(`/products`);
      } catch (error) {
        // Handle error (e.g., show error message)
        console.error("Error submitting form:", error);
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        
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
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price || ''}
              onChange={handleInputChange}
              required
            />
          </div>
    

          <div>
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category || ''}
              onChange={handleInputChange}
              required
            />
          </div>
    
        <button type="submit">Submit</button>
      </form>
    );
  }
  
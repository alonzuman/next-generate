# Nextjs Generate

A CLI tool for generating Next.js (app dir) components, pages, schemas and actions (CRUD operations) with [Zod](https://zod.dev/) schema validation.

<!-- Say something about how its inspired by ruby on rails scaffolding -->

This project is inspired by the Rails scaffolding feature in Ruby on Rails.

## Installation

```bash
npm install -D nextjs-generate
```

## Usage

```bash
npx next-generate <modelName> "<field1:type1() field2:type2() ...>"
```

### Examples

1. Generate a simple Post model:

   ```bash
   npx next-generate post "id: z.string().uuid() title: z.string() content:z.string() published:z.boolean()"
   ```

2. Generate a User model with Zod validations:

   ```bash
   npx next-generate user "id: z.string().uuid() image: z.string().url() name: z.string().min(2).max(50) email: z.string().email() age: z.number().min(18)"
   ```

3. Generate a Product model with custom Zod validations:
   ```bash
   npx next-generate product "id: z.number() name: z.string().min(3) price: z.number().positive() category: z.string().optional()"
   ```

## Features

- Generates Next.js pages for List, View, Create and Update model pages.
- Implements server actions for handling CRUD operations.
- Creates Zod schemas for robust type checking and validation.
- Generates TypeScript types based on Zod schemas.
- Creates a reusable form component for the model.

## Roadmap

- [x] Basic CRUD generation
- [x] Zod schema integration
- [x] TypeScript support
- [x] Server actions
- [ ] Support zod enums
- [ ] Apply validations on the form fields
- [ ] Support optional parameters, in case someone doesn't want to generate schemas, pages, components and actions, but only parts of it.
- [ ] Integration with popular form libraries (e.g., React Hook Form, Formik etc.) (?)
- [ ] Integration with popular ORMs (e.g., Prisma, Drizzle, TypeORM etc.)
  - [ ] Support for relationships between models
- [ ] Generate API routes
- [ ] Add unit tests for generated code (?)
- [ ] Support for authentication and authorization in generated code (?)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

#!/usr/bin/env node

import fs from "fs";
import path from "path";
import chalk from "chalk";

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function pluralize(str: string) {
  const irregulars: { [key: string]: string } = {
    person: "people",
    man: "men",
    woman: "women",
    child: "children",
    tooth: "teeth",
    foot: "feet",
    mouse: "mice",
    goose: "geese",
  };

  if (irregulars[str.toLowerCase()]) {
    return irregulars[str.toLowerCase()];
  }

  const rules = [
    { regex: /([^aeiou]ese)$/, replacement: "$1" },
    { regex: /(ax|test)is$/, replacement: "$1es" },
    { regex: /(alias|status)$/, replacement: "$1es" },
    { regex: /(bu)s$/, replacement: "$1ses" },
    { regex: /(buffal|tomat)o$/, replacement: "$1oes" },
    { regex: /([ti])um$/, replacement: "$1a" },
    { regex: /sis$/, replacement: "ses" },
    { regex: /(?:([^f])fe|([lr])f)$/, replacement: "$1$2ves" },
    { regex: /(hive)$/, replacement: "$1s" },
    { regex: /([^aeiouy]|qu)y$/, replacement: "$1ies" },
    { regex: /(x|ch|ss|sh)$/, replacement: "$1es" },
    { regex: /(matr|vert|ind)ix|ex$/, replacement: "$1ices" },
    { regex: /([m|l])ouse$/, replacement: "$1ice" },
    { regex: /^(ox)$/, replacement: "$1en" },
    { regex: /(quiz)$/, replacement: "$1zes" },
    { regex: /s$/, replacement: "s" },
    { regex: /$/, replacement: "s" },
  ];

  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    if (str.match(rule.regex)) {
      return str.replace(rule.regex, rule.replacement);
    }
  }

  return str + "s";
}

type FieldType = "string" | "number" | "boolean" | "date";

interface ModelField {
  name: string;
  type: FieldType;
  validations: string[];
}

function tokenizeSchema(schema: string): string[] {
  const regex = /([a-zA-Z]+(?:\.[a-zA-Z]+)*\([^)]*\))|([a-zA-Z]+)/g;
  return schema.match(regex) || [];
}
class NextGenerator {
  private modelName = "";
  private fields: ModelField[] = [];

  parseArguments(): ModelField[] {
    const args = process.argv.slice(2);
    if (args.length < 2) {
      throw new Error(
        'Usage: npx next-generate <modelName> "<field1:type1() field2:type2() ...>"'
      );
    }

    this.modelName = args[0];
    const fieldsString = args[1];

    const fieldDefinitions = fieldsString.split(/(?<=\)) /);
    const fields: ModelField[] = fieldDefinitions.map((def) => {
      const [name, ...rest] = def.split(":");
      const schema = rest.join(":");

      if (!name || !schema) {
        throw new Error(`Invalid field format: ${def}`);
      }

      const { type, validations } = this.parseSchema(schema);
      return { name, type, validations };
    });

    return fields;
  }

  private parseSchema(schema: string): {
    type: FieldType;
    validations: string[];
  } {
    const tokens = this.tokenizeSchema(schema);
    let type: FieldType;
    let validations: string[] = [];

    if (tokens[0].startsWith("z.")) {
      type = tokens[0].slice(2) as FieldType;
      validations = tokens.slice(1);
    } else {
      type = tokens[0] as FieldType;
      validations = tokens.slice(1);
    }

    this.validateZodMethods(type, validations);

    return { type, validations };
  }

  private tokenizeSchema(schema: string): string[] {
    const regex =
      /z?\.(string|number|boolean|date)(?:\(\))?(?:\.([a-zA-Z]+(?:\([^)]*\))?))*/g;
    const matches = schema.matchAll(regex);
    const tokens: string[] = [];

    for (const match of matches) {
      tokens.push(match[1]); // type
      if (match[2]) {
        tokens.push(...match[2].split(".").filter(Boolean));
      }
    }

    if (tokens.length === 0) {
      throw new Error(`Invalid schema format: ${schema}`);
    }

    return tokens;
  }

  private validateZodMethods(type: FieldType, methods: string[]): void {
    const validMethods: Record<FieldType, string[]> = {
      string: [
        "min",
        "max",
        "length",
        "email",
        "url",
        "uuid",
        "cuid",
        "regex",
        "optional",
        "nullable",
      ],
      number: [
        "min",
        "max",
        "int",
        "positive",
        "negative",
        "nonpositive",
        "nonnegative",
        "optional",
        "nullable",
      ],
      boolean: ["optional", "nullable"],
      date: ["min", "max", "optional", "nullable"],
    };

    for (const method of methods) {
      const methodName = method.split("(")[0];
      if (!validMethods[type].includes(methodName)) {
        throw new Error(
          `Invalid Zod method "${methodName}" for type "${type}"`
        );
      }
    }
  }

  private generateFormComponent(
    _modelName: string,
    dir: string,
    fields: ModelField[]
  ) {
    const modelName = capitalize(_modelName);

    function getInputType(fieldType: ModelField["type"]) {
      switch (fieldType) {
        case "string":
          return "text";
        case "number":
          return "number";
        case "boolean":
          return "checkbox";
        case "date":
          return "date";
        default:
          return "text";
      }
    }

    const filteredFields = fields.filter(
      (field) =>
        field.name !== "id" &&
        field.name !== "createdAt" &&
        field.name !== "updatedAt" &&
        field.name !== "deletedAt" &&
        !field.name.endsWith("Id")
    );

    const formFields = filteredFields
      .map(
        (field) => `
          <div>
            <label htmlFor="${field.name}">${capitalize(field.name)}</label>
            <input
              type="${getInputType(field.type)}"
              id="${field.name}"
              name="${field.name}"
              value={formData.${field.name} || ''}
              onChange={handleInputChange}
              required
            />
          </div>
    `
      )
      .join("\n");

    const content = `"use client";
  import React, { useState } from "react";
  import {
    Create${modelName}InputSchema,
    ${modelName}Schema,
    Update${modelName}InputSchema,
  } from "./schemas";
  import { useRouter } from "next/navigation";
  
  interface ${modelName}FormProps {
    action: (
      data: Create${modelName}InputSchema | Update${modelName}InputSchema
    ) => Promise<${modelName}Schema>;
    defaultValues?: Update${modelName}InputSchema;
  }
  
  export function ${modelName}Form({ action, defaultValues }: ${modelName}FormProps) {
    const [formData, setFormData] = useState<Partial<Update${modelName}InputSchema>>(
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
        await action(formData as Update${modelName}InputSchema);
        // Handle successful submission (e.g., show a success message, redirect, etc.)
        // For example:
        router.push(\`/${modelName.toLowerCase()}s\`);
      } catch (error) {
        // Handle error (e.g., show error message)
        console.error("Error submitting form:", error);
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        ${formFields}
        <button type="submit">Submit</button>
      </form>
    );
  }
  `;

    fs.writeFileSync(
      path.join(dir, `${modelName.toLowerCase()}-form.tsx`),
      content
    );
  }

  private generateListPage(_modelName: string, dir: string) {
    const modelName = capitalize(_modelName);
    const pluralModelName = pluralize(modelName);

    const content = `import { list${pluralModelName} } from './actions';
  import Link from 'next/link';
  
  export default async function ${pluralModelName}Page() {
    const ${pluralModelName.toLowerCase()} = await list${pluralModelName}();
  
    return (
      <div>
        <h1>${pluralModelName}</h1>
        <Link href="/${pluralModelName.toLowerCase()}/new">Create New ${modelName}</Link>
        <ul>
          {${pluralModelName.toLowerCase()}.map((${_modelName.toLowerCase()}) => (
            <li key={${_modelName.toLowerCase()}.id}>
              <Link href={\`/${pluralModelName.toLowerCase()}/\${${_modelName.toLowerCase()}.id}\`}>
                <pre>
                  {JSON.stringify(${_modelName.toLowerCase()}, null, 2)}
                </pre>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  `;

    // Create the plural directory and write the list page there
    const pluralDir = path.join(
      path.dirname(dir),
      pluralModelName.toLowerCase()
    );
    fs.mkdirSync(pluralDir, { recursive: true });
    fs.writeFileSync(path.join(pluralDir, "page.tsx"), content);

    // Ensure the list${pluralModelName} function is in actions.ts
    const actionsPath = path.join(dir, "actions.ts");
    let actionsContent = fs.readFileSync(actionsPath, "utf8");

    if (!actionsContent.includes(`list${pluralModelName}`)) {
      actionsContent += `
  export async function list${pluralModelName}() {
    // TODO: Implement fetching all ${pluralModelName.toLowerCase()}
    console.log('Fetching all ${pluralModelName.toLowerCase()}');
    return []; // Return an empty array for now
  }
  `;
      fs.writeFileSync(actionsPath, actionsContent);
    }
  }

  private generateNewPage(_modelName: string, dir: string) {
    const modelName = capitalize(_modelName);
    const content = `
  import { ${modelName}Form } from '../${modelName.toLowerCase()}-form';
  import { create${modelName} } from '../actions';
  
  export default function New${modelName}Page() {
    return (
      <div>
        <h1>Create New ${modelName}</h1>
        <${modelName}Form action={create${modelName}} />
      </div>
    );
  }
  `;

    const newDir = path.join(dir, "new");
    fs.mkdirSync(newDir, { recursive: true });
    fs.writeFileSync(path.join(newDir, "page.tsx"), content);
  }

  private generateEditPage(_modelName: string, dir: string) {
    const modelName = capitalize(_modelName);
    const content = `
  import { ${modelName}Form } from '../../${modelName.toLowerCase()}-form';
  import { get${modelName}, update${modelName} } from '../../actions';
  import { notFound } from 'next/navigation';
  
  export default async function Edit${modelName}Page({ params }: { params: { id: string } }) {
    const ${modelName.toLowerCase()} = await get${modelName}(params.id);
  
    if (!${modelName.toLowerCase()}) {
      return notFound()
    }
  
    return (
      <div>
        <h1>Edit ${modelName}</h1>
        <${modelName}Form action={update${modelName}} defaultValues={${modelName.toLowerCase()}} />
      </div>
    );
  }
  `;

    const editDir = path.join(dir, "[id]", "edit");
    fs.mkdirSync(editDir, { recursive: true });
    fs.writeFileSync(path.join(editDir, "page.tsx"), content);
  }

  private generateViewPage(_modelName: string, dir: string) {
    const modelName = capitalize(_modelName);
    const content = `
  import { get${modelName} } from '../actions';
  import { notFound } from 'next/navigation';
  
  export default async function ${modelName}Page({ params }: { params: { id: string } }) {
    const ${modelName.toLowerCase()} = await get${modelName}(params.id);
  
    if (!${modelName.toLowerCase()}) {
      return notFound()
    }
  
    return (
      <div>
        <h1>${modelName} Details</h1>
        <pre>{JSON.stringify(${modelName.toLowerCase()}, null, 2)}</pre>
      </div>
    );
  }
  `;

    const idDir = path.join(dir, "[id]");
    fs.mkdirSync(idDir, { recursive: true });
    fs.writeFileSync(path.join(idDir, "page.tsx"), content);
  }

  private generateSchemas(
    _modelName: string,
    dir: string,
    fields: ModelField[]
  ) {
    const modelName = capitalize(_modelName);
    const schemaFields = fields
      .map((field, index) => {
        const validations =
          field.validations.length > 0 ? `.${field.validations.join(".")}` : "";
        const fieldDefinition = `${field.name}: z.${field.type}()${validations}`;
        return index === 0 ? fieldDefinition : `    ${fieldDefinition}`;
      })
      .join(",\n");

    const content = `
  import { z } from 'zod';
  
  export const ${modelName.toLowerCase()}Schema = z.object({
    ${schemaFields}
  });
  export type ${modelName}Schema = z.infer<typeof ${modelName.toLowerCase()}Schema>;
  
  export const create${modelName}InputSchema = ${modelName.toLowerCase()}Schema.omit({ id: true });
  export type Create${modelName}InputSchema = z.infer<typeof create${modelName}InputSchema>;
  
  export const update${modelName}InputSchema = ${modelName.toLowerCase()}Schema;
  export type Update${modelName}InputSchema = z.infer<typeof update${modelName}InputSchema>;
  
  export const delete${modelName}InputSchema = z.object({ id: z.string() });
  export type Delete${modelName}InputSchema = z.infer<typeof delete${modelName}InputSchema>;
  `;

    fs.writeFileSync(path.join(dir, "schemas.ts"), content);
  }

  private generateActions(_modelName: string, dir: string) {
    const modelName = capitalize(_modelName);
    const content = `"use server";
  
  import {
    Create${modelName}InputSchema,
    Update${modelName}InputSchema,
    Delete${modelName}InputSchema,
    create${modelName}InputSchema,
    update${modelName}InputSchema,
    delete${modelName}InputSchema,
    ${modelName}Schema,
  } from "./schemas";
  
  export async function create${modelName}(
    data: Create${modelName}InputSchema
  ): Promise<${modelName}Schema> {
    // TODO: Implement authentication and authorization logic
    const validated = create${modelName}InputSchema.parse(data);
    // TODO: Implement create logic
    console.log("Creating ${modelName}:", validated);
  }
  
  export async function get${modelName}(id: string): Promise<${modelName}Schema> {
    // TODO: Implement authentication and authorization logic  
    // TODO: Implement get logic
    console.log("Getting ${modelName} with id:", id);
  }
  
  export async function update${modelName}(
    data: Update${modelName}InputSchema
  ): Promise<${modelName}Schema | null> {
    // TODO: Implement authentication and authorization logic
    const validated = update${modelName}InputSchema.parse(data);
    // TODO: Implement update logic
    console.log("Updating ${modelName}:", validated);
  }
  
  export async function delete${modelName}(data: Delete${modelName}InputSchema): Promise<void> {
    // TODO: Implement authentication and authorization logic  
    const validated = delete${modelName}InputSchema.parse(data);
    // TODO: Implement delete logic
    console.log("Deleting ${modelName} with id:", validated.id);
  }
  
  export async function list${modelName}s(): Promise<${modelName}Schema[]> {
    // TODO: Implement authentication and authorization logic  
    // TODO: Implement list logic
    console.log("Listing ${modelName}s");
    return []
  }
  `;

    fs.writeFileSync(path.join(dir, "actions.ts"), content);
  }

  private generateModel() {
    const pluralModelName = pluralize(this.modelName);
    const modelDir = path.join(
      process.cwd(),
      "app",
      pluralModelName.toLowerCase()
    );
    fs.mkdirSync(modelDir, { recursive: true });

    this.generateActions(this.modelName, modelDir);
    this.generateSchemas(this.modelName, modelDir, this.fields);
    this.generateNewPage(this.modelName, modelDir);
    this.generateViewPage(this.modelName, modelDir);
    this.generateListPage(this.modelName, modelDir);
    this.generateEditPage(this.modelName, modelDir);
    this.generateFormComponent(this.modelName, modelDir, this.fields);

    // TODO improve the log to say what was created
    console.log(
      chalk.green(
        `Model ${chalk.bold(
          capitalize(this.modelName)
        )} generated successfully at ${chalk.cyan(
          `/app/${pluralize(this.modelName.toLowerCase())}`
        )} 🎉`
      )
    );
  }

  public run() {
    const args = process.argv.slice(2);
    this.modelName = args[0];
    this.fields = this.parseArguments();
    this.generateModel();
  }
}

try {
  console.log("Running next-generate...");
  const generator = new NextGenerator();
  generator.run();
} catch (error) {
  if (error instanceof Error) {
    console.error(chalk.red(error.message));
  } else {
    console.error(chalk.red("An unknown error occurred"));
  }
}

process.exit(0);

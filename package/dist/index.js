#!/usr/bin/env node
import s from"fs";import c from"path";import d from"chalk";function p(i){return i.charAt(0).toUpperCase()+i.slice(1)}function h(i){let o={person:"people",man:"men",woman:"women",child:"children",tooth:"teeth",foot:"feet",mouse:"mice",goose:"geese"};if(o[i.toLowerCase()])return o[i.toLowerCase()];let n=[{regex:/([^aeiou]ese)$/,replacement:"$1"},{regex:/(ax|test)is$/,replacement:"$1es"},{regex:/(alias|status)$/,replacement:"$1es"},{regex:/(bu)s$/,replacement:"$1ses"},{regex:/(buffal|tomat)o$/,replacement:"$1oes"},{regex:/([ti])um$/,replacement:"$1a"},{regex:/sis$/,replacement:"ses"},{regex:/(?:([^f])fe|([lr])f)$/,replacement:"$1$2ves"},{regex:/(hive)$/,replacement:"$1s"},{regex:/([^aeiouy]|qu)y$/,replacement:"$1ies"},{regex:/(x|ch|ss|sh)$/,replacement:"$1es"},{regex:/(matr|vert|ind)ix|ex$/,replacement:"$1ices"},{regex:/([m|l])ouse$/,replacement:"$1ice"},{regex:/^(ox)$/,replacement:"$1en"},{regex:/(quiz)$/,replacement:"$1zes"},{regex:/s$/,replacement:"s"},{regex:/$/,replacement:"s"}];for(let e=0;e<n.length;e++){let t=n[e];if(i.match(t.regex))return i.replace(t.regex,t.replacement)}return i+"s"}var $=class{constructor(){this.modelName="";this.fields=[]}parseArguments(){let o=process.argv.slice(2);if(o.length<2)throw new Error('Usage: npx next-generate <modelName> "<field1:type1() field2:type2() ...>"');return this.modelName=o[0],o[1].split(/(?<=\)) /).map(a=>{let[u,...l]=a.split(":"),m=l.join(":");if(!u||!m)throw new Error(`Invalid field format: ${a}`);let{type:r,validations:g}=this.parseSchema(m);return{name:u,type:r,validations:g}})}parseSchema(o){let n=this.tokenizeSchema(o),e,t=[];return n[0].startsWith("z.")?(e=n[0].slice(2),t=n.slice(1)):(e=n[0],t=n.slice(1)),this.validateZodMethods(e,t),{type:e,validations:t}}tokenizeSchema(o){let n=/z?\.(string|number|boolean|date)(?:\(\))?(?:\.([a-zA-Z]+(?:\([^)]*\))?))*/g,e=o.matchAll(n),t=[];for(let a of e)t.push(a[1]),a[2]&&t.push(...a[2].split(".").filter(Boolean));if(t.length===0)throw new Error(`Invalid schema format: ${o}`);return t}validateZodMethods(o,n){let e={string:["min","max","length","email","url","uuid","cuid","regex","optional","nullable"],number:["min","max","int","positive","negative","nonpositive","nonnegative","optional","nullable"],boolean:["optional","nullable"],date:["min","max","optional","nullable"]};for(let t of n){let a=t.split("(")[0];if(!e[o].includes(a))throw new Error(`Invalid Zod method "${a}" for type "${o}"`)}}generateFormComponent(o,n,e){let t=p(o);function a(r){switch(r){case"string":return"text";case"number":return"number";case"boolean":return"checkbox";case"date":return"date";default:return"text"}}let l=e.filter(r=>r.name!=="id"&&r.name!=="createdAt"&&r.name!=="updatedAt"&&r.name!=="deletedAt"&&!r.name.endsWith("Id")).map(r=>`
          <div>
            <label htmlFor="${r.name}">${p(r.name)}</label>
            <input
              type="${a(r.type)}"
              id="${r.name}"
              name="${r.name}"
              value={formData.${r.name} || ''}
              onChange={handleInputChange}
              required
            />
          </div>
    `).join(`
`),m=`"use client";
  import React, { useState } from "react";
  import {
    Create${t}InputSchema,
    ${t}Schema,
    Update${t}InputSchema,
  } from "./schemas";
  import { useRouter } from "next/navigation";
  
  interface ${t}FormProps {
    action: (
      data: Create${t}InputSchema | Update${t}InputSchema
    ) => Promise<${t}Schema>;
    defaultValues?: Update${t}InputSchema;
  }
  
  export function ${t}Form({ action, defaultValues }: ${t}FormProps) {
    const [formData, setFormData] = useState<Partial<Update${t}InputSchema>>(
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
        await action(formData as Update${t}InputSchema);
        // Handle successful submission (e.g., show a success message, redirect, etc.)
        // For example:
        router.push(\`/${t.toLowerCase()}s\`);
      } catch (error) {
        // Handle error (e.g., show error message)
        console.error("Error submitting form:", error);
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        ${l}
        <button type="submit">Submit</button>
      </form>
    );
  }
  `;s.writeFileSync(c.join(n,`${t.toLowerCase()}-form.tsx`),m)}generateListPage(o,n){let e=p(o),t=h(e),a=`import { list${t} } from './actions';
  import Link from 'next/link';
  
  export default async function ${t}Page() {
    const ${t.toLowerCase()} = await list${t}();
  
    return (
      <div>
        <h1>${t}</h1>
        <Link href="/${t.toLowerCase()}/new">Create New ${e}</Link>
        <ul>
          {${t.toLowerCase()}.map((${o.toLowerCase()}) => (
            <li key={${o.toLowerCase()}.id}>
              <Link href={\`/${t.toLowerCase()}/\${${o.toLowerCase()}.id}\`}>
                <pre>
                  {JSON.stringify(${o.toLowerCase()}, null, 2)}
                </pre>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  `,u=c.join(c.dirname(n),t.toLowerCase());s.mkdirSync(u,{recursive:!0}),s.writeFileSync(c.join(u,"page.tsx"),a);let l=c.join(n,"actions.ts"),m=s.readFileSync(l,"utf8");m.includes(`list${t}`)||(m+=`
  export async function list${t}() {
    // TODO: Implement fetching all ${t.toLowerCase()}
    console.log('Fetching all ${t.toLowerCase()}');
    return []; // Return an empty array for now
  }
  `,s.writeFileSync(l,m))}generateNewPage(o,n){let e=p(o),t=`
  import { ${e}Form } from '../${e.toLowerCase()}-form';
  import { create${e} } from '../actions';
  
  export default function New${e}Page() {
    return (
      <div>
        <h1>Create New ${e}</h1>
        <${e}Form action={create${e}} />
      </div>
    );
  }
  `,a=c.join(n,"new");s.mkdirSync(a,{recursive:!0}),s.writeFileSync(c.join(a,"page.tsx"),t)}generateEditPage(o,n){let e=p(o),t=`
  import { ${e}Form } from '../../${e.toLowerCase()}-form';
  import { get${e}, update${e} } from '../../actions';
  import { notFound } from 'next/navigation';
  
  export default async function Edit${e}Page({ params }: { params: { id: string } }) {
    const ${e.toLowerCase()} = await get${e}(params.id);
  
    if (!${e.toLowerCase()}) {
      return notFound()
    }
  
    return (
      <div>
        <h1>Edit ${e}</h1>
        <${e}Form action={update${e}} defaultValues={${e.toLowerCase()}} />
      </div>
    );
  }
  `,a=c.join(n,"[id]","edit");s.mkdirSync(a,{recursive:!0}),s.writeFileSync(c.join(a,"page.tsx"),t)}generateViewPage(o,n){let e=p(o),t=`
  import { get${e} } from '../actions';
  import { notFound } from 'next/navigation';
  
  export default async function ${e}Page({ params }: { params: { id: string } }) {
    const ${e.toLowerCase()} = await get${e}(params.id);
  
    if (!${e.toLowerCase()}) {
      return notFound()
    }
  
    return (
      <div>
        <h1>${e} Details</h1>
        <pre>{JSON.stringify(${e.toLowerCase()}, null, 2)}</pre>
      </div>
    );
  }
  `,a=c.join(n,"[id]");s.mkdirSync(a,{recursive:!0}),s.writeFileSync(c.join(a,"page.tsx"),t)}generateSchemas(o,n,e){let t=p(o),a=e.map((l,m)=>{let r=l.validations.length>0?`.${l.validations.join(".")}`:"",g=`${l.name}: z.${l.type}()${r}`;return m===0?g:`    ${g}`}).join(`,
`),u=`
  import { z } from 'zod';
  
  export const ${t.toLowerCase()}Schema = z.object({
    ${a}
  });
  export type ${t}Schema = z.infer<typeof ${t.toLowerCase()}Schema>;
  
  export const create${t}InputSchema = ${t.toLowerCase()}Schema.omit({ id: true });
  export type Create${t}InputSchema = z.infer<typeof create${t}InputSchema>;
  
  export const update${t}InputSchema = ${t.toLowerCase()}Schema;
  export type Update${t}InputSchema = z.infer<typeof update${t}InputSchema>;
  
  export const delete${t}InputSchema = z.object({ id: z.string() });
  export type Delete${t}InputSchema = z.infer<typeof delete${t}InputSchema>;
  `;s.writeFileSync(c.join(n,"schemas.ts"),u)}generateActions(o,n){let e=p(o),t=`"use server";
  
  import {
    Create${e}InputSchema,
    Update${e}InputSchema,
    Delete${e}InputSchema,
    create${e}InputSchema,
    update${e}InputSchema,
    delete${e}InputSchema,
    ${e}Schema,
  } from "./schemas";
  
  export async function create${e}(
    data: Create${e}InputSchema
  ): Promise<${e}Schema> {
    // TODO: Implement authentication and authorization logic
    const validated = create${e}InputSchema.parse(data);
    // TODO: Implement create logic
    console.log("Creating ${e}:", validated);
  }
  
  export async function get${e}(id: string): Promise<${e}Schema> {
    // TODO: Implement authentication and authorization logic  
    // TODO: Implement get logic
    console.log("Getting ${e} with id:", id);
  }
  
  export async function update${e}(
    data: Update${e}InputSchema
  ): Promise<${e}Schema | null> {
    // TODO: Implement authentication and authorization logic
    const validated = update${e}InputSchema.parse(data);
    // TODO: Implement update logic
    console.log("Updating ${e}:", validated);
  }
  
  export async function delete${e}(data: Delete${e}InputSchema): Promise<void> {
    // TODO: Implement authentication and authorization logic  
    const validated = delete${e}InputSchema.parse(data);
    // TODO: Implement delete logic
    console.log("Deleting ${e} with id:", validated.id);
  }
  
  export async function list${e}s(): Promise<${e}Schema[]> {
    // TODO: Implement authentication and authorization logic  
    // TODO: Implement list logic
    console.log("Listing ${e}s");
    return []
  }
  `;s.writeFileSync(c.join(n,"actions.ts"),t)}generateModel(){let o=h(this.modelName),n=c.join(process.cwd(),"app",o.toLowerCase());s.mkdirSync(n,{recursive:!0}),this.generateActions(this.modelName,n),this.generateSchemas(this.modelName,n,this.fields),this.generateNewPage(this.modelName,n),this.generateViewPage(this.modelName,n),this.generateListPage(this.modelName,n),this.generateEditPage(this.modelName,n),this.generateFormComponent(this.modelName,n,this.fields),console.log(d.green(`\u2728 Model ${d.bold(p(this.modelName))} generated successfully at ${d.cyan(`/app/${h(this.modelName.toLowerCase())}`)} \u{1F389}`))}run(){let o=process.argv.slice(2);this.modelName=o[0],this.fields=this.parseArguments(),this.generateModel()}};try{console.log(d.blue("\u{1F680} Initializing generator..."));let i=new $;console.log(d.yellow("\u2699\uFE0F  Running generator...")),i.run(),console.log(d.green("\u2705 Generator finished running"))}catch(i){i instanceof Error?console.error(d.red(`\u274C Error: ${i.message}`)):console.error(d.red("\u274C An unknown error occurred"))}console.log(d.magenta("\u{1F44B} Script finished"));process.exit(0);
//# sourceMappingURL=index.js.map
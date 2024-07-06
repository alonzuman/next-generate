#!/usr/bin/env node
import c from"fs";import m from"path";import g from"chalk";function p(l){return l.charAt(0).toUpperCase()+l.slice(1)}function $(l){let a={person:"people",man:"men",woman:"women",child:"children",tooth:"teeth",foot:"feet",mouse:"mice",goose:"geese"};if(a[l.toLowerCase()])return a[l.toLowerCase()];let n=[{regex:/([^aeiou]ese)$/,replacement:"$1"},{regex:/(ax|test)is$/,replacement:"$1es"},{regex:/(alias|status)$/,replacement:"$1es"},{regex:/(bu)s$/,replacement:"$1ses"},{regex:/(buffal|tomat)o$/,replacement:"$1oes"},{regex:/([ti])um$/,replacement:"$1a"},{regex:/sis$/,replacement:"ses"},{regex:/(?:([^f])fe|([lr])f)$/,replacement:"$1$2ves"},{regex:/(hive)$/,replacement:"$1s"},{regex:/([^aeiouy]|qu)y$/,replacement:"$1ies"},{regex:/(x|ch|ss|sh)$/,replacement:"$1es"},{regex:/(matr|vert|ind)ix|ex$/,replacement:"$1ices"},{regex:/([m|l])ouse$/,replacement:"$1ice"},{regex:/^(ox)$/,replacement:"$1en"},{regex:/(quiz)$/,replacement:"$1zes"},{regex:/s$/,replacement:"s"},{regex:/$/,replacement:"s"}];for(let e=0;e<n.length;e++){let t=n[e];if(l.match(t.regex))return l.replace(t.regex,t.replacement)}return l+"s"}var f=class{constructor(){this.modelName="";this.fields=[]}parseArguments(){let a=process.argv.slice(2);if(a.length<2)throw new Error('Usage: npx next-generate <modelName> "<field1:type1() field2:type2() ...>"');this.modelName=a[0];let t=a[1].split(/(?<=\)) /).map(s=>{let[i,...d]=s.split(":"),r=d.join(":");if(!i||!r)throw new Error(`Invalid field format: ${s}`);let{type:u,validations:h,options:v}=this.parseSchema(r);return{name:i,type:u,validations:h,options:v}});if(!t.some(s=>s.name==="id"))throw new Error('The schema must include an "id" field.');return t}parseSchema(a){let n=this.tokenizeSchema(a),e,t=[],o;return n[0]==="enum"?(e="enum",o=n[n.length-1],t=n.slice(1,-1)):n[0].startsWith("z.")?(e=n[0].slice(2),t=n.slice(1)):(e=n[0],t=n.slice(1)),this.validateZodMethods(e,t,o),{type:e,validations:t,options:o}}tokenizeSchema(a){let n=/z?\.(string|number|boolean|date|enum)(?:\((\[.*?\])\))?(?:\.([a-zA-Z]+(?:\([^)]*\))?))*/g,e=a.matchAll(n),t=[];for(let o of e)if(t.push(o[1]),o[3]&&t.push(...o[3].split(".").filter(Boolean)),o[2]){let s=o[2].slice(1,-1).split(",").map(i=>i.trim().replace(/^'|'$/g,""));t.push(s)}if(t.length===0)throw new Error(`Invalid schema format: ${a}`);return t}validateZodMethods(a,n,e){let t={string:["min","max","length","email","url","uuid","cuid","regex","optional","nullable"],number:["min","max","int","positive","negative","nonpositive","nonnegative","optional","nullable"],boolean:["optional","nullable"],date:["min","max","optional","nullable"],enum:[]};for(let o of n){let s=o.split("(")[0];if(!t[a].includes(s))throw new Error(`Invalid Zod method "${s}" for type "${a}"`)}if(a==="enum"&&!e)throw new Error("Enum type must have options defined")}generateFormComponent(a,n,e){let t=p(a);function o(r){switch(r){case"string":return"text";case"number":return"number";case"boolean":return"checkbox";case"date":return"date";case"enum":return"select";default:return"text"}}let i=e.filter(r=>r.name!=="id"&&r.name!=="createdAt"&&r.name!=="updatedAt"&&r.name!=="deletedAt"&&!r.name.endsWith("Id")).map(r=>{if(r.type==="enum"){let u=r.options||[];return`
        <div>
          <label htmlFor="${r.name}">${p(r.name)}</label>
          <select
            id="${r.name}"
            name="${r.name}"
            value={formData.${r.name} || ''}
            onChange={handleInputChange}
            required
          >
            ${u.map(h=>`<option value="${h}">${h}</option>`).join(`
`)}
          </select>
        </div>
      `}return`
      <div>
        <label htmlFor="${r.name}">${p(r.name)}</label>
        <input
          type="${o(r.type)}"
          id="${r.name}"
          name="${r.name}"
          value={formData.${r.name} || ''}
          onChange={handleInputChange}
          required
        />
      </div>
    `}).join(`
`),d=`"use client";
  import React, { useState } from "react";
  import {
    Create${t}InputSchema,
    ${t}Schema,
    Update${t}InputSchema,
  } from "./schemas";
  
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
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        await action(formData as Update${t}InputSchema);
        // Handle successful submission (e.g., show a success message, redirect, etc.)
        // For example:
        // router.push(\`/${t.toLowerCase()}s\`);
      } catch (error) {
        // Handle error (e.g., show error message)
        console.error("Error submitting form:", error);
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        ${i}
        <button type="submit">Submit</button>
      </form>
    );
  }
  `;c.writeFileSync(m.join(n,`${t.toLowerCase()}-form.tsx`),d)}generateListPage(a,n){let e=p(a),t=$(e),o=`import { list${t} } from './actions';
  import Link from 'next/link';
  
  export default async function ${t}Page() {
    const ${t.toLowerCase()} = await list${t}();
  
    return (
      <div>
        <h1>${t}</h1>
        <Link href="/${t.toLowerCase()}/new">Create New ${e}</Link>
        <ul>
          {${t.toLowerCase()}.map((${a.toLowerCase()}) => (
            <li key={${a.toLowerCase()}.id}>
              <Link href={\`/${t.toLowerCase()}/\${${a.toLowerCase()}.id}\`}>
                <pre>
                  {JSON.stringify(${a.toLowerCase()}, null, 2)}
                </pre>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  `,s=m.join(m.dirname(n),t.toLowerCase());c.mkdirSync(s,{recursive:!0}),c.writeFileSync(m.join(s,"page.tsx"),o);let i=m.join(n,"actions.ts"),d=c.readFileSync(i,"utf8");d.includes(`list${t}`)||(d+=`
  export async function list${t}() {
    // TODO: Implement fetching all ${t.toLowerCase()}
    console.log('Fetching all ${t.toLowerCase()}');
    return []; // Return an empty array for now
  }
  `,c.writeFileSync(i,d))}generateNewPage(a,n){let e=p(a),t=`
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
  `,o=m.join(n,"new");c.mkdirSync(o,{recursive:!0}),c.writeFileSync(m.join(o,"page.tsx"),t)}generateEditPage(a,n){let e=p(a),t=`
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
  `,o=m.join(n,"[id]","edit");c.mkdirSync(o,{recursive:!0}),c.writeFileSync(m.join(o,"page.tsx"),t)}generateViewPage(a,n){let e=p(a),t=`
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
  `,o=m.join(n,"[id]");c.mkdirSync(o,{recursive:!0}),c.writeFileSync(m.join(o,"page.tsx"),t)}generateSchemas(a,n,e){let t=p(a),o=e.map((i,d)=>{let r=i.validations.length>0?`.${i.validations.join(".")}`:"",u=i.type==="enum"?`${i.name}: z.enum([${i.validations.join(", ").replace(/z\.enum\(\[|\]\)/g,"")}])`:`${i.name}: z.${i.type}()${r}`;return d===0?u:`    ${u}`}).join(`,
`),s=`
  import { z } from 'zod';
  
  export const ${t.toLowerCase()}Schema = z.object({
    ${o}
  });
  export type ${t}Schema = z.infer<typeof ${t.toLowerCase()}Schema>;
  
  export const create${t}InputSchema = ${t.toLowerCase()}Schema.omit({ id: true });
  export type Create${t}InputSchema = z.infer<typeof create${t}InputSchema>;
  
  export const update${t}InputSchema = ${t.toLowerCase()}Schema;
  export type Update${t}InputSchema = z.infer<typeof update${t}InputSchema>;
  
  export const delete${t}InputSchema = z.object({ id: z.string() });
  export type Delete${t}InputSchema = z.infer<typeof delete${t}InputSchema>;
  `;c.writeFileSync(m.join(n,"schemas.ts"),s)}generateActions(a,n){let e=p(a),t=`"use server";
  
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
  `;c.writeFileSync(m.join(n,"actions.ts"),t)}generateModel(){let a=$(this.modelName),n=m.join(process.cwd(),"app",a.toLowerCase());c.mkdirSync(n,{recursive:!0}),this.generateActions(this.modelName,n),this.generateSchemas(this.modelName,n,this.fields),this.generateNewPage(this.modelName,n),this.generateViewPage(this.modelName,n),this.generateListPage(this.modelName,n),this.generateEditPage(this.modelName,n),this.generateFormComponent(this.modelName,n,this.fields),console.log(g.green(`Model ${g.bold(p(this.modelName))} generated successfully at ${g.cyan(`/app/${$(this.modelName.toLowerCase())}`)} \u{1F389}`))}run(){let a=process.argv.slice(2);this.modelName=a[0],this.fields=this.parseArguments(),this.generateModel()}};try{console.log("Running next-generate..."),new f().run()}catch(l){l instanceof Error?console.error(g.red(l.message)):console.error(g.red("An unknown error occurred"))}process.exit(0);
//# sourceMappingURL=index.js.map
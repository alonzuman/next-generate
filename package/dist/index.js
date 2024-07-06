#!/usr/bin/env node
import m from"fs";import l from"path";function p(i){return i.charAt(0).toUpperCase()+i.slice(1)}function $(i){let n={person:"people",man:"men",woman:"women",child:"children",tooth:"teeth",foot:"feet",mouse:"mice",goose:"geese"};if(n[i.toLowerCase()])return n[i.toLowerCase()];let a=[{regex:/([^aeiou]ese)$/,replacement:"$1"},{regex:/(ax|test)is$/,replacement:"$1es"},{regex:/(alias|status)$/,replacement:"$1es"},{regex:/(bu)s$/,replacement:"$1ses"},{regex:/(buffal|tomat)o$/,replacement:"$1oes"},{regex:/([ti])um$/,replacement:"$1a"},{regex:/sis$/,replacement:"ses"},{regex:/(?:([^f])fe|([lr])f)$/,replacement:"$1$2ves"},{regex:/(hive)$/,replacement:"$1s"},{regex:/([^aeiouy]|qu)y$/,replacement:"$1ies"},{regex:/(x|ch|ss|sh)$/,replacement:"$1es"},{regex:/(matr|vert|ind)ix|ex$/,replacement:"$1ices"},{regex:/([m|l])ouse$/,replacement:"$1ice"},{regex:/^(ox)$/,replacement:"$1en"},{regex:/(quiz)$/,replacement:"$1zes"},{regex:/s$/,replacement:"s"},{regex:/$/,replacement:"s"}];for(let e=0;e<a.length;e++){let t=a[e];if(i.match(t.regex))return i.replace(t.regex,t.replacement)}return i+"s"}function v(i){let n={type:"string",validations:[]},a=i.match(/z\.(string|number|boolean|date|enum|array|object)/);if(a)n.type=a[1];else throw new Error("Invalid schema format");let e=i.match(/\.(min|max|email|url|length|regex|uuid|cuid|positive|negative|int)\(([^)]+)\)/g);e&&(n.validations=e.map(r=>{let s=r.match(/\.(min|max|email|url|length|regex|uuid|cuid|positive|negative|int)\(([^)]+)\)/);return s?`${s[1]}(${s[2]})`:""}));let t=i.match(/z\.enum\(\[(.*?)\]\)/);return t&&(n.options=t[1].split(",").map(r=>r.trim().replace(/^'|'$/g,""))),n}import h from"chalk";var f=class{constructor(){this.modelName="";this.fields=[];this.tokenizeSchema=v}parseArguments(){let n=process.argv.slice(2);if(n.length<2)throw new Error('Usage: npx next-generate <modelName> "<field1:type1() field2:type2() ...>"');this.modelName=n[0];let t=n[1].split(new RegExp("(?<=\\)) ")).map(s=>{let[c,...u]=s.split(":"),o=u.join(":");if(!c||!o)throw new Error(`Invalid field format: ${s}`);let{type:d,validations:g,options:w}=this.parseSchema(o);return{name:c,type:d,validations:g,options:w}});if(!t.some(s=>s.name==="id"))throw new Error('The schema must include an "id" field.');return t}parseSchema(n){let a=this.tokenizeSchema(n),e=a.type,t=a.validations,r=a.options;return this.validateZodMethods(e,t,r),{type:e,validations:t,options:r}}validateZodMethods(n,a,e){let t={string:["min","max","length","email","url","uuid","cuid","regex","optional","nullable"],number:["min","max","int","positive","negative","nonpositive","nonnegative","optional","nullable"],boolean:["optional","nullable"],date:["min","max","optional","nullable"],enum:["optional","nullable"]};for(let r of a){let s=r.split("(")[0];if(!t[n].includes(s))throw new Error(`Invalid Zod method "${s}" for type "${n}"`)}if(n==="enum"&&!e)throw new Error("Enum type must have options.")}generateFormComponent(n,a,e){let t=p(n);function r(o){switch(o){case"string":return"text";case"number":return"number";case"boolean":return"checkbox";case"date":return"date";case"enum":return"select";default:return"text"}}let c=e.filter(o=>o.name!=="id"&&o.name!=="createdAt"&&o.name!=="updatedAt"&&o.name!=="deletedAt"&&!o.name.endsWith("Id")).map(o=>{if(o.type==="enum"){let d=o.options||[];return`
        <div>
          <label htmlFor="${o.name}">${p(o.name)}</label>
          <select
            id="${o.name}"
            name="${o.name}"
            value={formData.${o.name} || ''}
            onChange={handleInputChange}
            required
          >
            ${d.map(g=>`<option value="${g}">${g}</option>`).join(`
`)}
          </select>
        </div>
      `}return`
      <div>
        <label htmlFor="${o.name}">${p(o.name)}</label>
        <input
          type="${r(o.type)}"
          id="${o.name}"
          name="${o.name}"
          value={formData.${o.name} || ''}
          onChange={handleInputChange}
          required
        />
      </div>
    `}).join(`
`),u=`"use client";
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
        ${c}
        <button type="submit">Submit</button>
      </form>
    );
  }
  `;m.writeFileSync(l.join(a,`${t.toLowerCase()}-form.tsx`),u)}generateListPage(n,a){let e=p(n),t=$(e),r=`import { list${t} } from './actions';
  import Link from 'next/link';
  
  export default async function ${t}Page() {
    const ${t.toLowerCase()} = await list${t}();
  
    return (
      <div>
        <h1>${t}</h1>
        <Link href="/${t.toLowerCase()}/new">Create New ${e}</Link>
        <ul>
          {${t.toLowerCase()}.map((${n.toLowerCase()}) => (
            <li key={${n.toLowerCase()}.id}>
              <Link href={\`/${t.toLowerCase()}/\${${n.toLowerCase()}.id}\`}>
                <pre>
                  {JSON.stringify(${n.toLowerCase()}, null, 2)}
                </pre>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  `,s=l.join(l.dirname(a),t.toLowerCase());m.mkdirSync(s,{recursive:!0}),m.writeFileSync(l.join(s,"page.tsx"),r);let c=l.join(a,"actions.ts"),u=m.readFileSync(c,"utf8");u.includes(`list${t}`)||(u+=`
  export async function list${t}() {
    // TODO: Implement fetching all ${t.toLowerCase()}
    console.log('Fetching all ${t.toLowerCase()}');
    return []; // Return an empty array for now
  }
  `,m.writeFileSync(c,u))}generateNewPage(n,a){let e=p(n),t=`
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
  `,r=l.join(a,"new");m.mkdirSync(r,{recursive:!0}),m.writeFileSync(l.join(r,"page.tsx"),t)}generateEditPage(n,a){let e=p(n),t=`
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
  `,r=l.join(a,"[id]","edit");m.mkdirSync(r,{recursive:!0}),m.writeFileSync(l.join(r,"page.tsx"),t)}generateViewPage(n,a){let e=p(n),t=`
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
  `,r=l.join(a,"[id]");m.mkdirSync(r,{recursive:!0}),m.writeFileSync(l.join(r,"page.tsx"),t)}generateSchemas(n,a,e){let t=p(n),r=e.map(c=>{var d;let u=c.validations.length>0?`.${c.validations.join(".")}`:"";return c.type==="enum"?`${c.name}: z.enum([${((d=c.options)!=null?d:[]).map(g=>`"${g}"`).join(", ")}])${u}`:`${c.name}: z.${c.type}()${u}`}).join(`,
`),s=`
import { z } from 'zod';

export const ${t.toLowerCase()}Schema = z.object({
  ${r}
});
export type ${t}Schema = z.infer<typeof ${t.toLowerCase()}Schema>;

export const create${t}InputSchema = ${t.toLowerCase()}Schema.omit({ id: true });
export type Create${t}InputSchema = z.infer<typeof create${t}InputSchema>;

export const update${t}InputSchema = ${t.toLowerCase()}Schema;
export type Update${t}InputSchema = z.infer<typeof update${t}InputSchema>;

export const delete${t}InputSchema = z.object({ id: z.string() });
export type Delete${t}InputSchema = z.infer<typeof delete${t}InputSchema>;
    `;m.writeFileSync(l.join(a,"schemas.ts"),s)}generateActions(n,a){let e=p(n),t=`
"use server";
  
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
  `;m.writeFileSync(l.join(a,"actions.ts"),t)}generateModel(){let n=$(this.modelName),a=l.join(process.cwd(),"app",n.toLowerCase());m.mkdirSync(a,{recursive:!0}),this.generateActions(this.modelName,a),this.generateSchemas(this.modelName,a,this.fields),this.generateNewPage(this.modelName,a),this.generateViewPage(this.modelName,a),this.generateListPage(this.modelName,a),this.generateEditPage(this.modelName,a),this.generateFormComponent(this.modelName,a,this.fields),console.log(h.green(`Model ${h.bold(p(this.modelName))} generated successfully at ${h.cyan(`/app/${$(this.modelName.toLowerCase())}`)} \u{1F389}`))}run(){let n=process.argv.slice(2);this.modelName=n[0],this.fields=this.parseArguments(),this.generateModel()}};try{console.log("Running next-generate..."),new f().run()}catch(i){i instanceof Error?console.error(h.red(i.message)):console.error(h.red("An unknown error occurred"))}process.exit(0);
//# sourceMappingURL=index.js.map
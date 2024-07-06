import { tokenizeSchema } from "../src/utils";

describe("tokenizeSchema", () => {
  it("should tokenize a simple schema correctly", () => {
    const schema = "field: z.string()";
    const tokens = tokenizeSchema(schema);
    expect(tokens).toEqual({
      type: "string",
      validations: [],
    });
    expect(true).toBe(true);
  });

  it("should tokenize a simple schema correctly", () => {
    const schema = "field: z.string()";
    const tokens = tokenizeSchema(schema);
    expect(tokens).toEqual({
      type: "string",
      validations: [],
    });
  });

  it("should tokenize a schema with validations correctly", () => {
    const schema = "field: z.string().min(1).max(120)";
    const tokens = tokenizeSchema(schema);
    expect(tokens).toEqual({
      type: "string",
      validations: ["min(1)", "max(120)"],
    });
  });

  it("should tokenize an enum schema correctly", () => {
    const schema = "field: z.enum(['option1', 'option2', 'option3'])";
    const tokens = tokenizeSchema(schema);
    expect(tokens).toEqual({
      type: "enum",
      validations: [],
      options: ["option1", "option2", "option3"],
    });
  });

  it("should throw an error for invalid schema format", () => {
    const schema = "field: z.invalidType()";
    expect(() => tokenizeSchema(schema)).toThrow();
  });
});

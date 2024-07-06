export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function pluralize(str: string) {
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

type Token = {
  type: "string" | "number" | "boolean" | "date" | "enum" | "array" | "object";
  validations: string[];
  options?: string[]; // enum options
};

export function tokenizeSchema(schema: string): Token {
  const token: Token = {
    type: "string",
    validations: [],
  };

  // Match the type
  const typeMatch = schema.match(
    /z\.(string|number|boolean|date|enum|array|object)/
  );
  if (typeMatch) {
    token.type = typeMatch[1] as Token["type"];
  } else {
    throw new Error("Invalid schema format");
  }

  // Match the validations
  const validationsMatch = schema.match(
    /\.(min|max|email|url|length|regex|uuid|cuid|positive|negative|int)\(([^)]+)\)/g
  );
  if (validationsMatch) {
    token.validations = validationsMatch.map((validation) => {
      const methodMatch = validation.match(
        /\.(min|max|email|url|length|regex|uuid|cuid|positive|negative|int)\(([^)]+)\)/
      );
      if (methodMatch) {
        return `${methodMatch[1]}(${methodMatch[2]})`;
      }
      return "";
    });
  }

  // Match the enum options
  const optionsMatch = schema.match(/z\.enum\(\[(.*?)\]\)/);
  if (optionsMatch) {
    token.options = optionsMatch[1]
      .split(",")
      .map((opt) => opt.trim().replace(/^'|'$/g, ""));
  }

  return token;
}

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

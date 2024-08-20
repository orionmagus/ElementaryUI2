const hasSpace = /\s/,
  hasSeparator = /(_|-|\.|:)/,
  hasCamel = /([a-z][A-Z]|[A-Z][a-z])/,
  separatorSplitter = /[\W_]+(.|$)/g,
  camelSplitter = /(.)([A-Z]+)/g,
  toNoCase = string => {
    if (hasSpace.test(string)) return string.toLowerCase();
    if (hasSeparator.test(string))
      return (unseparate(string) || string).toLowerCase();
    if (hasCamel.test(string)) return uncamelize(string).toLowerCase();
    return string.toLowerCase();
  },
  unseparate = string =>
    string.replace(separatorSplitter, (m, next) => (next ? " " + next : "")),
  uncamelize = string =>
    string.replace(
      camelSplitter,
      (m, previous, uppers) =>
        previous +
        " " +
        uppers
          .toLowerCase()
          .split("")
          .join(" ")
    ),
  toSpaceCase = string =>
    toNoCase(string)
      .replace(/[\W_]+(.|$)/g, (matches, match) => (match ? " " + match : ""))
      .trim(),
  toCamelCase = string =>
    toSpaceCase(string).replace(/\s(\w)/g, (matches, letter) =>
      letter.toUpperCase()
    ),
  toCharCase = (string, sep = "-") =>
    toNoCase(string)
      .replace(/[\W_]+(.|$)/g, (matches, match) => (match ? sep + match : ""))
      .trim(),
  toTitleCase = string =>
    toSpaceCase(string)
      .replace(/[\W\s]*([a-z]+)/gi, (matches, match) =>
        match ? ` ${match.charAt(0).toUpperCase()}${match.substring(1)}` : ""
      )
      .trim();

export default {
  kebabCase: toCharCase,
  snakeCase: string => toCharCase(string, "_"),
  camelCase: toCamelCase,
  spaceCase: toSpaceCase,
  title: toTitleCase
};

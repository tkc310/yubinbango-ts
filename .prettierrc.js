// @refs:
// - https://zenn.dev/rescuenow/articles/c07dd571dfe10f
// - https://github.com/trivago/prettier-plugin-sort-imports?tab=readme-ov-file#apis

/** @type {import('@trivago/prettier-plugin-sort-imports/types').PrettierConfig} */
module.exports = {
  semi: true,
  trailingComma: "es5",
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  arrowParens: "avoid",
  endOfLine: "lf"
}

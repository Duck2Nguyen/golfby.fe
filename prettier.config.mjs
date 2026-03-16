/**
 * @type {import("prettier").Config}
 * Need to restart IDE when changing configuration
 * Open the command palette (Ctrl + Shift + P) and execute the command > Reload Window.
 */
const config = {
  useTabs: false,
  tabWidth: 2,
  endOfLine: 'lf',
  semi: true, // dấu ; cuối dòng
  trailingComma: 'all', // điền dấu , ở item cuối cùng của object
  bracketSpacing: true, // khoảng trắng { a } thay vì {a}
  singleQuote: true, // dấu nháy '' thay vì ""
  printWidth: 110,
  arrowParens: 'avoid', // arrowfunction dạng: a => {} thay vì (a)=>{}
  quoteProps: 'as-needed', // Bỏ dấu ngoặc đơn ở key của Object
  htmlWhitespaceSensitivity: 'ignore', // <a></a> không cho xuống dòng ngu ngu dạng <a></a  \n >
};

export default config;

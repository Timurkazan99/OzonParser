import fs from 'fs';
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const raw = fs.readFileSync(path.resolve(__dirname, "../data/categories.json"));
const categories = JSON.parse(raw);

const getUrl = (category, item) => {
  const url = category && categories.find(({title}) => title.toLowerCase() === category.toLowerCase())?.url || '/search/'
  return `${url}?from_global=true&sorting=ozon_card_price&text=${item}`;
}

export default getUrl;

import getItems from "./getItems.js";
import writeItems from "./writeItems.js";
import start from "./parser.js";

async function ozonParse(filename, readCol, writeCol, categoryCol, debug) {
  console.log(categoryCol)
  const items = await getItems(filename, readCol, categoryCol);
  const price = await start(items, debug);
  await writeItems(filename, writeCol, price, items);
}

export default ozonParse;
import Excel from 'exceljs';
import getUrl from './getUrl.js';

async function getItems(filename, nameCol, categoryCol) {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(filename);
  const sheet = workbook.worksheets[0];
  const names = sheet.getColumn(nameCol).values.filter((col) => typeof col === 'string');
  const categories = categoryCol && sheet.getColumn(categoryCol).values.filter((col) => typeof col === 'string') || [];
  const items = names.map((name, i) => {
    const category = categories[i] || null;
    const url = getUrl(category, name);
    return {name, category, url}
  })
  console.log(`Товары: ${names}`);
  return items;
}

export default getItems;
import Excel from 'exceljs';

async function writeItems(filename, col, prices, items) {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(filename);
  const sheet = workbook.worksheets[0];
  const columnNumber = sheet.getColumn(col).number;
  const result = prices.reduce((acc, price) => {
    acc.forEach((res, i) => {
      const temp = price[i] || 0;
      console.log(temp)
      res.push(temp);
    })
    return acc;
  }, [[], [], [], [], []]);
  sheet.spliceColumns(columnNumber, 1, ...result);
  console.log(`Запись результатов в файл`)
  items.map((item, i) => {
    console.log(`${item.name} за ${prices[i].join(', ')}`);
  })
  await workbook.xlsx.writeFile(filename);
}

export default writeItems;
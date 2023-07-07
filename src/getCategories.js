// 'https://www.ozon.ru/api/composer-api.bx/page/json/v2?url=/search/?from_global=true&text=star+wars+jedi+fallen+order+ps5'
import puppeteer from 'puppeteer';
import fs from 'fs';

const ids = [15500, 7500, 17777, 14500, 7000, 6500, 10500, 11000, 9700, 9200, 16500, 12300, 6000, 33332, 8500, 15000, 13500, 50001, 18000, 13300, 7697, 32056, 8000, 9000, 13100, 25000, 34458, 35659];

const getText = (res) => {
  const strs = res.innerText.match(/"title":".*?".*?url":".*?"/g);
  return strs.map((str) =>  JSON.parse(`{${str}}`));
};

async function search(page, id) {
  await page.goto(`https://www.ozon.ru/api/composer-api.bx/_action/v2/categoryChildV3?menuId=1&categoryId=${id}`);
  await page.waitForTimeout(8000);

  const categories = await page.$eval('pre', getText)

  console.log(categories);
  return categories;
}

async function start() {

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-canvas-aa', // Disable antialiasing on 2d canvas
      '--disable-2d-canvas-clip-aa', // Disable antialiasing on 2d canvas clips
      '--disable-gl-drawing-for-tests', // BEST OPTION EVER! Disables GL drawing operations which produce pixel output. With this the GL output will not be correct but tests will run faster.
      '--no-first-run',
      '--no-zygote', // wtf does that mean ?
      '--disable-dev-shm-usage', // ???
      '--use-gl=swiftshader', // better cpu usage with —use-gl=desktop rather than —use-gl=swiftshader, still needs more testing.
//'--single-process', // <- this one doesn't works in Windows
      '--disable-gpu',
      '--enable-webgl',
      '--hide-scrollbars',
      '--mute-audio',
      '--disable-infobars',
      '--disable-breakpad',
//'--ignore-gpu-blacklist',
      '--disable-web-security'
    ],
  });
  const page = await browser.newPage();
  await page.on('dialog', async dialog => {
    console.log('Dialog:', dialog.message())
    await dialog.accept();
  });
  await page.setDefaultTimeout(500000);
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
  await page.setViewport({
    width: 1800,
    height: 1500,
    deviceScaleFactor: 1,
  });

  let result = [];
  for (const id of ids) {
    const categories = await search(page, id).catch((e) => {
      console.log(e)
      return [];
    });
    result = result.concat(categories);
  }

  await fs.writeFile('./data/categories.json', JSON.stringify(result), err => {
    if (err) {
      console.error(err);
    }
  });

  await browser.close();
  return result
}

start();
// https://www.ozon.ru/api/composer-api.bx/page/json/v2?url=/category/igry-dlya-pristavok-13301/?from_global=true&sorting=ozon_card_price&text=Tomb Raider Definitive Edition PS4

import puppeteer from 'puppeteer';

const getPrice = (res) => {
  const response = JSON.parse(res.innerText).widgetStates;
  const raw = response['searchResultsV2-311201-default-1'] || response['searchResultsV2-311178-default-1']

  return JSON.parse(raw).items.slice(0, 5).map(({mainState}) => {
      const atom = mainState.find(({atom}) => atom.type === 'price').atom.price;
      const price = atom?.price;
      return Number(price.slice(0, -1).replace(/\s/g, ''));
    })
}

async function search(page, item) {
  console.log(`Начинаем поиск ${item.name}`);
  console.log(`Сылка для поиска: https://www.ozon.ru${item.url}`)
  await page.goto(`https://www.ozon.ru/api/composer-api.bx/page/json/v2?url=${item.url}`);
  await page.waitForTimeout(8000);

  const prices = await page.$eval('pre', getPrice);
  console.log(prices);
  console.log(`Найдены цены ${prices.join(', ')}`);

  return prices;
}

async function start(items, debug) {

  const browser = await puppeteer.launch({
    headless: !debug,
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

  const result = [];
  for (const item of items) {
    const price = await search(page, item).catch((e) => {
      console.log('произошла ошибка, цена не найдена')
      return [0, 0, 0, 0];
    });
    result.push(price);
  }

  await browser.close();
  return result
}

export default start;
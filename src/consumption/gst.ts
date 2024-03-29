import { ElementHandle, Page } from "puppeteer";
import { RQScraper } from "..";
import { readText, sleep } from "../utils";
import { navigateToFile, Entry, extractDates, cleanDate } from "./consumption";

export async function fetchGstSOA(this: RQScraper, file: string) : Promise<Entry[]> {

  const results = [];
  const page = await navigateToFile(this, file);
  await sleep(1000); // defensive sleep: We have hit an error a few times here

  // fetch page entries, then click "Next Page" button
  do {
    const pageResults = await iterateEntries(page);
    results.push(...pageResults);
  }
  while (await clickNextPage(page));

  await page.close();
  return results;
}


async function iterateEntries(page: Page): Promise<Entry[]> {
  const entries = await page.$$("#rechercheParPeriodeTableau table > tbody > tr > :first-child > a");
  const r = [] as Entry[];
  for (let i = 0; i < entries.length; i++) {
    await sleep(50); // flush console log
    await page.click(`#rechercheParPeriodeTableau table > tbody > :nth-child(${i + 1}) > :first-child > a`);
    await page.waitForResponse(() => true);
    await sleep(125); // Wait for the DOM update
    await page.click("#consulter-declaration-selectionnee");
    await page.waitForResponse(() => true);
    // Wait for the DOM update.  We cannot wait the element here
    // because on the second pass the selector already exists.
    // TODO: Replace this with a mutation listener, a la
    // https://github.com/puppeteer/puppeteer/issues/2945
    if (i == 0) 
      await page.waitForSelector("#detail-releve-compte > div > h3")
    else await sleep(125); 

    const period = await scrapeEntry(page);
    r.push(period);
  }
  return r;
}

export async function clickNextPage(page: Page) {

  const el = await page.$("li.next-action > a");
  if (el) {
    await el.click();
    await page.waitForResponse(() => true);
    // the response alone is insufficient to wait for the DOM update
    // we add a manual wait here to allow the update to complete.
    // there is probably a deterministic way to do this, but it works for me now
    await sleep(250);
    return true;
  }
  return false;
}

export async function scrapeEntry(page: Page): Promise<Entry> {
  const header = await readText(page, "#detail-releve-compte > div > h3");
  const rows = await page.$$("#detail-releve-compte table > tbody > tr");

  const p = rows.map(row => scrapeRow(page, row))
  return {
    period: {
      end: extractDates(header)[0]
    },
    items: await Promise.all(p),
  }
}

async function scrapeRow(page: Page, row: ElementHandle) {
  const tds = await row.$$('td');
  return {
    date: cleanDate(await readText(page, tds[0])),
    description: await readText(page, tds[1]),
    posted: cleanDate(await readText(page, tds[2])),
    amount: await readText(page, tds[3]),
  };
}


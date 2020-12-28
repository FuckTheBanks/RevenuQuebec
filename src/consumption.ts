import { Browser, ElementHandle, Page } from "puppeteer";
import { clickLink, readText, sleep } from "./utils";

type Entry = {
  periodEnding: string;
  items: {
    date: string;
    amount: string;
    description: string;
    posted: string;
  }[];
}

export async function fetchSOA(page: Page, file: string) {

  const results = [];

  // click the link
  if (await navigateToPage(page, file)) {
    do {
      const pageResults = await iterateEntries(page);
      results.push(...pageResults);
    }
    while (await clickNextPage(page));
  }

  return results;
}

export async function navigateToPage(page: Page, file: string) {
    // Navigate to page
    await page.click("#button-nav-mobile-main");
    await page.click("#nav-mobile-main > ul > li:nth-child(2) > button");
    await page.click("#nav-mobile-main > ul > li.nav-mobile-lien.selected > div > div:nth-child(2) > ul > li:nth-child(5) > a");
  
    await page.waitForSelector("#tableauxLoiModel");

    return await clickLink(page, file);
}

async function iterateEntries(page: Page): Promise<Entry[]> {
  const entries = await page.$$("#rechercheParPeriodeTableau table > tbody > tr > :first-child > a");
  const r = [] as Entry[];
  for (let i = 0; i < entries.length; i++) {
    await page.click(`#rechercheParPeriodeTableau table > tbody > :nth-child(${i + 1}) > :first-child > a`);
    console.log("waiting to update");
    await sleep(500);
    await page.click("#consulter-declaration-selectionnee");
    await sleep(500);
    console.log("clicked the button");
    await page.waitForSelector("#detail-releve-compte");
    const period = await scrapeEntry(page);
    r.push(period);
  }
  return r;
}

async function scrapeEntry(page: Page) : Promise<Entry> {
  console.log('scraping');
  const header = await readText(page, "#detail-releve-compte > div > h3");
  const rows = await page.$$("#detail-releve-compte table > tbody > tr");
  
  const p = rows.map(row => scrapeRow(page, row))
  return { 
    periodEnding: header,
    items: await Promise.all(p),
  } 
}

async function scrapeRow(page: Page, row: ElementHandle) {
  const tds = await row.$$('td');
  return { 
    date: await readText(page, tds[0]), 
    description: await readText(page, tds[1]),
    amount: await readText(page, tds[2]),
    posted: await readText(page, tds[3])
  };
}

export async function clickNextPage(page: Page) {

  const el = await page.$("li.next-action > a");
  if (el) {
    await el.click();
    await page.waitForResponse(() => true);
    return true;
  }
  return false;
}


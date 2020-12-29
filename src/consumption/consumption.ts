import { ElementHandle, Page } from "puppeteer";
import { clickLink, readText, sleep } from "../utils";

export type Entry = {
  periodEnding: string;
  items: {
    date: string;
    amount: string;
    description: string;
    posted?: string;
  }[];
}


export async function navigateToPage(page: Page, file: string) {
  // Navigate to page
  await page.goto("https://entreprises.revenuquebec.ca/EntPres/SX/SX00/SX00.RensFin.PIU/KX00A00/Portail/NaviguerVersService?codeService=SX00N01A&route=taxes");
  // await page.click("#button-nav-mobile-main");
  // await sleep(100);
  // await page.click("#nav-mobile-main > ul > li:nth-child(2) > button");
  // await sleep(100);
  // await page.click("#nav-mobile-main > ul > li.nav-mobile-lien.selected > div > div:nth-child(2) > ul > li:nth-child(5) > a");

  // await page.waitForSelector("#tableauxLoiModel > div.kx-table-responsive > table td");

  // DONT CLICK:
  // instead, pull the href and go to the page
  await sleep(250);
  console.log('Clicking the link');
  return await clickLink(page, file);
}


export async function scrapeEntry(page: Page): Promise<Entry> {
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



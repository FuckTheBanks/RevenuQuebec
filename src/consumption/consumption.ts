import { ElementHandle, Page } from "puppeteer";
import { RQScraper } from "..";
import { readText } from "../utils";

export type Entry = {
  periodEnding: string;
  items: {
    date: string;
    amount: string;
    description: string;
    posted?: string;
  }[];
}


export async function navigateToFile(scraper: RQScraper, file: string) {
  // Navigate to page
  // await page.click("#button-nav-mobile-main");
  // await sleep(100);
  // await page.click("#nav-mobile-main > ul > li:nth-child(2) > button");
  // await sleep(100);
  // await page.click("#nav-mobile-main > ul > li.nav-mobile-lien.selected > div > div:nth-child(2) > ul > li:nth-child(5) > a");

  // Navigating the menu is unreliable (we can end up on the wrong page - again, sporadically)
  const page = await scraper.newPage("https://entreprises.revenuquebec.ca/EntPres/SX/SX00/SX00.RensFin.PIU/KX00A00/Portail/NaviguerVersService?codeService=SX00N01A&route=taxes")

  // Clicking the link sporadically fails, so we extract the href and explicitly go there.
  const links = await page.$x(`//a[contains(., '${file}')]`);
  if (!links || links.length != 1)
    throw new Error("Assumption failed: unexpected number of account links found");
  
  const hrefPropery = await links[0].getProperty('href');
  const href = await hrefPropery.jsonValue() as string;
  await page.goto(href);
  return page;
}


export async function scrapeEntry(page: Page): Promise<Entry> {
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



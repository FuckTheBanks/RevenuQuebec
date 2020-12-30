import { ElementHandle, Page } from "puppeteer";
import { RQScraper } from "..";
import { readText } from "../utils";

export type Entry = {
  period: {
    start?: string,
    end: string,
  }
  items: {
    date: string;
    amount: string;
    description: string;
    posted?: string;
  }[];
}

  // Remove/standardize whatever character is being used on the website to delineate dates
  export function cleanDate(str: string) : string;
  export function cleanDate(str: string|undefined) : string|undefined;
  export function cleanDate(str?: string) { 
    return str?.trim().replace(/\D/g, '-'); 
  }

  export function extractDates(str?: string|null) {
    const m = str?.match(/\d+\D\d+\D\d+/g) ?? [];
    return m.map(d => cleanDate(d))
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


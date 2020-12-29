import { Page } from "puppeteer";
import { sleep } from "../utils";
import { navigateToPage, scrapeEntry, Entry } from "./consumption";

export async function fetchGstSOA(page: Page, file: string) : Promise<Entry[]> {

  const results = [];

  // click the link
  if (await navigateToPage(page, file)) {
    // fetch page entries, then click "Next Page" button
    do {
      const pageResults = await iterateEntries(page);
      results.push(...pageResults);
    }
    while (await clickNextPage(page));
  }

  return results;
}


async function iterateEntries(page: Page): Promise<Entry[]> {
  const entries = await page.$$("#rechercheParPeriodeTableau table > tbody > tr > :first-child > a");
  const r = [] as Entry[];
  for (let i = 0; i < entries.length; i++) {
    console.log("scraping row");
    await sleep(50); // flush console log
    await page.click(`#rechercheParPeriodeTableau table > tbody > :nth-child(${i + 1}) > :first-child > a`);
    console.log("clicked entry selection");
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

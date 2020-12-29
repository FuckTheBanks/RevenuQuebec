import { Page } from "puppeteer";
import { Entry, navigateToPage } from "./consumption";
import { getWaitableWatcher } from "../watcher";
import { sleep } from "../utils";

export async function fetchQstSOA(page: Page, file: string) : Promise<Entry[]> {

  const results = [];

  // click the link
  if (await navigateToPage(page, file)) {
    // Get all years, then iterate through them scraping data
    const years = await getAvailableYears(page);
    for (let year of years) {
      console.log(`Scraping year: ${year}`);
      const data = await scrapeYear(page, year);
      results.push(...data);
      console.log(data);
    }

  }
  return results;
}


async function getAvailableYears(page: Page) {
  const alloptions = await page.$$eval("#DossierSelectionner_AnneeSelectionneeTexte option", options => 
    options.map(opt => (opt as HTMLOptionElement).value)
  );

  // filter out invalid Options
  return alloptions
    .map(opt => parseInt(opt))
    .filter(year => !Number.isNaN(year));
}

async function scrapeYear(page: Page, year: number): Promise<any> {
  await setYear(page, year);
  await selectAllPeriods(page);
  const watcher = await getWaitableWatcher(page, "#detailsperiodes");
  await page.click("#btnconsulter");
  console.log("clicking 'view'");
  await watcher.changed;
  console.log("ya gotta see this right!");
  return await scrapeData(page);
}

async function setYear(page: Page, year: number) {
  // let's make sure this change is actually a change - if not we indefinitely hang
  const current = await page.$eval("#DossierSelectionner_AnneeSelectionneeTexte", sel => (sel as HTMLSelectElement).value)
  if (current != `${year}`) {
    const watcher = await getWaitableWatcher(page, "#tableauperiodes", 250);
    await page.select("#DossierSelectionner_AnneeSelectionneeTexte", `${year}`);
    await watcher.changed;
    console.log("year selected and updated");
  } else {
    await sleep(250);
  }
}

async function selectAllPeriods(page: Page) {
  await page.waitForSelector("a.selectallperiodes");
  while (!page.$("tr.active-selectall")) {
    await page.click("a.selectallperiodes");
    await sleep(50);
  }
}

async function scrapeData(page: Page) : Promise<Entry[]> {
  // Get all titles
  const titles = await page.$$eval("#detailsperiodes > h3", h3s => h3s.map(h3 => h3.textContent));
  const tables = await page.$$eval("#detailsperiodes table > tbody", tables => 
    tables.map(table => 
      // each row maps to an entry
      [...table.querySelectorAll("tr")].map(row => 
        // @ts-ignore
        Object.fromEntries(
          [...row.querySelectorAll("td")].map(td => 
            [
              td.getAttribute("data-th"), 
              td.innerText
            ]
          )
        )
      )
    )
  )

  return titles.map((t, index) => ({
    periodEnding: t!,
    items: tables[index]
  }))
}
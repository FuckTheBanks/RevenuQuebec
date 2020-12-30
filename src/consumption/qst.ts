import { Page } from "puppeteer";
import { Entry, navigateToFile as navigateToFile } from "./consumption";
import { getWaitableWatcher } from "../watcher";
import { sleep } from "../utils";
import { RQScraper } from "..";

export async function fetchQstSOA(this: RQScraper, file: string) : Promise<Entry[]> {

  const page = await navigateToFile(this, file);

  // Get all years, then iterate through them scraping data
  const results = [];
  const years = await getAvailableYears(page);
  for (const year of years) {
    const data = await scrapeYear(page, year);
    results.push(...data);
  }
  await page.close();
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

async function scrapeYear(page: Page, year: number) {
  console.log(`Scraping year: ${year}`);
  await setYear(page, year);
  await selectAllPeriods(page);
  const watcher = await getWaitableWatcher(page, "#detailsperiodes");
  await page.click("#btnconsulter");
  await watcher.changed;
  return await scrapeData(page);
}

async function setYear(page: Page, year: number) {
  // let's make sure this change is actually a change - if not we indefinitely hang
  const current = await page.$eval("#DossierSelectionner_AnneeSelectionneeTexte", sel => (sel as HTMLSelectElement).value)
  if (current != `${year}`) {
    const watcher = await getWaitableWatcher(page, "#tableauperiodes", 250);
    await page.select("#DossierSelectionner_AnneeSelectionneeTexte", `${year}`);
    await watcher.changed;
    // We must wait for the select-all to be deselected
    while (await page.$("tr.active-selectall"))
      await sleep(50);
  } else {
    await sleep(250);
  }
  
}

async function selectAllPeriods(page: Page) {
  await page.waitForSelector("a.selectallperiodes");
  while (!await page.$("tr.active-selectall")) {
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
        Object.fromEntries(
          [...row.querySelectorAll("td")].map(td => 
            [
              td.getAttribute("data-th"), 
              td.innerText.trim()
            ]
          )
        )
      )
    )
  )

  // Remove/standardize whatever character is being used on the website to delineate dates
  const cleanDate = (str?: string) => str?.replace(/\D/g, '-') ?? "ERROR: Missing Date";

  const periodDates = titles
    .map(title => title?.match(/\d+\D\d+\D\d+/g) ?? [])
    .map(dateArray => ({
      start: cleanDate(dateArray[0]),
      end: cleanDate(dateArray[1]),
    }))
  return periodDates.map((period, index) => ({
    period,
    items: tables[index].map(item => ({
      amount: item.Amount,
      description: item.Description,
      date: cleanDate(item.Date)
    }))
  }))
}
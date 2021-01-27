import { trimEnd } from "lodash";
import { Page } from "puppeteer";
import { readText, sleep } from "./utils";
import { getWaitableWatcher } from "./watcher";

export async function getAvailableYears(page: Page) {
  const alloptions = await page.$$eval("#DossierSelectionner_AnneeSelectionneeTexte option", options => 
    options.map(opt => (opt as HTMLOptionElement).value)
  );

  // filter out invalid Options
  return alloptions
    .map(opt => parseInt(opt))
    .filter(year => !Number.isNaN(year));
}

export async function selectAndViewYear(page: Page, year: number) {
  console.log(`Scraping year: ${year}`);
  if (!await setYear(page, year))
    return false;
  await selectAllPeriods(page);
  const watcher = await getWaitableWatcher(page, "#detailsperiodes");
  await page.click("#btnconsulter");
  await watcher.changed;
  return true;
}

async function selectAllPeriods(page: Page) {
  await page.waitForSelector("a.selectallperiodes");
  while (!await page.$("tr.active-selectall")) {
    await page.click("a.selectallperiodes");
    await sleep(50);
  }
}

export async function setYear(page: Page, year: number) {
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

  // If the page shows an alert, there are no entries
  const alert = await page.$("#tableauperiodes > div > div.kx-alert-text");
  if (alert) {
    const text = await readText(page, alert);
    console.warn(`Fetch ${year} failed - ${text}`);
    return false;
  }
  return true
}
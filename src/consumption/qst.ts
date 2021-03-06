import { Page } from "puppeteer";
import { cleanDate, Entry, extractDates, navigateToFile } from "./consumption";
import { RQScraper } from "..";
import { getAvailableYears, selectAndViewYear } from "../selectYear";

export async function fetchQstSOA(this: RQScraper, file="TQ0001") : Promise<Entry[]> {

  const page = await navigateToFile(this, file);

  // Get all years, then iterate through them scraping data
  const results = [];
  const years = await getAvailableYears(page);
  for (const year of years) {
    const ready = await selectAndViewYear(page, year);
    if (ready) {
      const data = await scrapeData(page);
      results.push(...data);
    }
  }
  await page.close();
  return results;
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

  const periodDates = titles
    .map(str => extractDates(str))
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
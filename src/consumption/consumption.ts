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
  return scraper.navigateToFile(
    ["CONSUMPTION TAXES", "Statement of account"],
    file
  )
}

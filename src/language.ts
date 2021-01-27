import { Page } from "puppeteer";
import { clickLink, sleep } from "./utils";

export type LanguageType = "EN" | "FR";
export async function selectLanguage(page: Page, language: LanguageType) {
  try {
    await sleep(100);
    await clickLink(page, language);
    console.log(`Switched language to: ${language}`);
    await sleep(100);
    //await closePopup(page);
  }
  catch (e) {
    // do nothing
    console.log(`Couldnt switch lang: ${e.message}`);
  }
} 
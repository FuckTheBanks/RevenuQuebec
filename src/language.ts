import { Page } from "puppeteer";
import { closePopup } from "./login";
import { clickLink } from "./utils";

export type LanguageType = "EN" | "FR";
export async function selectLanguage(page: Page, language: LanguageType) {
  try {
    await clickLink(page, language);
    console.log(`Switched language to: ${language}`);
    await closePopup(page);
  }
  catch (e) {
    // do nothing
    console.log(`Couldnt switch lang: ${e.message}`);
  }
} 
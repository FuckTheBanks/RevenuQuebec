import { Page } from "puppeteer";
import { closePopup } from "./login";
import { clickLink } from "./utils";

export type LanguageType = "EN" | "FR";
export async function selectLanguage(page: Page, language: LanguageType) {
  try {
    await clickLink(page, language);
    await closePopup(page);
  }
  catch (_e) {
    // do nothing
  }
} 
import { Page } from "puppeteer";
export declare type LanguageType = "EN" | "FR";
export declare function selectLanguage(page: Page, language: LanguageType): Promise<void>;

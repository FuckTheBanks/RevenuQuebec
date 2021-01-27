import { Page } from "puppeteer";
export declare function getAvailableYears(page: Page): Promise<number[]>;
export declare function selectAndViewYear(page: Page, year: number): Promise<boolean>;
export declare function setYear(page: Page, year: number): Promise<boolean>;

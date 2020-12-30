import { Page } from "puppeteer";
import { RQScraper } from "..";
import { Entry } from "./consumption";
export declare function fetchGstSOA(this: RQScraper, file: string): Promise<Entry[]>;
export declare function clickNextPage(page: Page): Promise<boolean>;
export declare function scrapeEntry(page: Page): Promise<Entry>;

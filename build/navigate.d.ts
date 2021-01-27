import { Page } from "puppeteer";
import { RQScraper } from ".";
export declare function navigateToFile(this: RQScraper, menuEntries: string[], file: string): Promise<Page>;

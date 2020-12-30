import { Page } from "puppeteer";
import { RQScraper } from "..";
export declare type Entry = {
    period: {
        start?: string;
        end: string;
    };
    items: {
        date: string;
        amount: string;
        description: string;
        posted?: string;
    }[];
};
export declare function navigateToFile(scraper: RQScraper, file: string): Promise<Page>;
export declare function scrapeEntry(page: Page): Promise<Entry>;

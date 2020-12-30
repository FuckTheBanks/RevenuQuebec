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
export declare function cleanDate(str: string): string;
export declare function cleanDate(str: string | undefined): string | undefined;
export declare function extractDates(str?: string | null): string[];
export declare function navigateToFile(scraper: RQScraper, file: string): Promise<Page>;

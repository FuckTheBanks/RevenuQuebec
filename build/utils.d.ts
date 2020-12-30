import { ElementHandle, Page } from "puppeteer";
export declare function readText(page: Page, selector: string | ElementHandle): Promise<string>;
export declare function clickXPath(page: Page, xpath: string, index?: number): Promise<boolean>;
export declare function clickLink(page: Page, text: string, index?: number): Promise<boolean>;
export declare function sleep(ms: number): Promise<unknown>;

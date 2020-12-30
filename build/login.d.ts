import { Browser, Page } from "puppeteer";
export declare function login(browser: Browser, username: string, password: string): Promise<Page>;
export declare function closePopup(page: Page): Promise<void>;

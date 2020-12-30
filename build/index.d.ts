import puppeteer from 'puppeteer';
import { fetchGstSOA } from './consumption/gst';
import { fetchQstSOA } from './consumption/qst';
import { LanguageType } from './language';
export declare class RQScraper {
    browser: puppeteer.Browser;
    username: string;
    password: string;
    private constructor();
    static init(lang?: LanguageType, username?: string, password?: string, options?: puppeteer.LaunchOptions): Promise<RQScraper>;
    fetchGstSOA: typeof fetchGstSOA;
    fetchQstSOA: typeof fetchQstSOA;
    login: () => Promise<puppeteer.Page>;
    newPage: (url?: string | undefined) => Promise<puppeteer.Page>;
}

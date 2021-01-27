import puppeteer from 'puppeteer';
import { fetchGstSOA } from './consumption/gst';
import { fetchQstSOA } from './consumption/qst';
import { fetchIncomeSOA } from './income';
import { LanguageType } from './language';
import { navigateToFile } from './navigate';
export declare class RQScraper {
    browser: puppeteer.Browser;
    username: string;
    password: string;
    private constructor();
    static init(lang?: LanguageType, username?: string, password?: string, options?: puppeteer.LaunchOptions): Promise<RQScraper>;
    release(): Promise<void>;
    fetchGstSOA: typeof fetchGstSOA;
    fetchQstSOA: typeof fetchQstSOA;
    fetchIncomeSOA: typeof fetchIncomeSOA;
    navigateToFile: typeof navigateToFile;
    login: () => Promise<puppeteer.Page>;
    newPage: (url?: string | undefined) => Promise<puppeteer.Page>;
}


import puppeteer from 'puppeteer';
import { fetchGstSOA } from './consumption/gst';
import { fetchQstSOA } from './consumption/qst';
import { fetchIncomeSOA } from './income';
import { fetchSourceDeductionsSOA } from './sourceDeductions';
import { LanguageType, selectLanguage } from './language';
import { login } from './login';
import { navigateToFile } from './navigate';


export class RQScraper {

  browser: puppeteer.Browser;

  username: string;
  password: string;


  ///////////////////////////////////////////////////////////////////////
  // Construction functions
  private constructor(browser: puppeteer.Browser, username: string, password: string) {
    this.browser = browser;
    this.username = username;
    this.password = password;
  }
 
  public static async init(lang?: LanguageType, username?: string, password?: string, options?: puppeteer.LaunchOptions) {

    const user = username || process.env.RQ_USERNAME;
    const pwd = password || process.env.RQ_PASSWORD;
    if (!user || !pwd)
      throw new Error("Cannot initialize RQ scraper, no username or password")

    const browser = await puppeteer.launch(options);
    const rq = new RQScraper(browser, user, pwd);
    const page = await rq.login();

    if (lang)
      await selectLanguage(page, lang);

    await page.close();
    return rq;
  }

  public async release() {
    await this.browser.close();
  }

  ///////////////////////////////////////////////////////////////////////
  // Data scraping
  
  public fetchGstSOA = fetchGstSOA;
  public fetchQstSOA = fetchQstSOA;

  public fetchIncomeSOA = fetchIncomeSOA;
  public fetchSourceDeductionsSOA = fetchSourceDeductionsSOA;
  
  ///////////////////////////////////////////////////////////////////////
  // Helper functions

  public navigateToFile = navigateToFile;
  
  public login = () => login(this.browser, this.username, this.password);
  public newPage = async (url?: string) => {
    const page = await this.browser.newPage();
    await page.goto(url ?? "https://entreprises.revenuquebec.ca/EntPres/SX/SX00/sx00.Portail.PIU/SX00A01/");
    return page;
  }
}
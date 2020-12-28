
import puppeteer from 'puppeteer';
import { fetchSOA } from './consumption';
import { LanguageType, selectLanguage } from './language';
import { login } from './login';
import { clickLink } from './utils';


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
      selectLanguage(page, lang);

    await page.close();
    return rq;
  }

  ///////////////////////////////////////////////////////////////////////
  // Data scraping
  
  fetchSOA = async (file: string) => await fetchSOA(await this.newPage(), file);

  ///////////////////////////////////////////////////////////////////////
  // Helper functions
  public login = () => login(this.browser, this.username, this.password);
  public newPage = async () => {
    const page = await this.browser.newPage();
    await page.goto("https://entreprises.revenuquebec.ca/EntPres/SX/SX00/sx00.Portail.PIU/SX00A01/");
    return page;
  }
}
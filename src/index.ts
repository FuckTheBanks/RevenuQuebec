
import puppeteer from 'puppeteer';


class RQScraper {

  browser: puppeteer.Browser;

  username: string;
  password: string;

  async init(username?: string, password?: string, options?: puppeteer.LaunchOptions) {
    this.browser = await puppeteer.launch(options);
    this.username = username || process.env.RQ_USERNAME;
    this.password = password || process.env.RQ_PASSWORD;

    await this.login();
  }

  async login() {
    const page = await this.browser.newPage();
    await page.goto('https://entreprises.revenuquebec.ca/EntPres/SX/SX00/sx00.Portail.PIU/SX00A01/?CLNG=A');

    await page.type("#AuthUtilisateur1_Authentificationidpwd1_txtCodeUtils", this.username);
    await page.type("#AuthUtilisateur1_Authentificationidpwd1_txtMotPasse", this.password);
    await page.click("#AuthUtilisateur1_rubBouton_btnContinuer");
    await page.waitForNavigation();

    try {
      await page.click("#kx-modal-pedagogique-fermer");
    } 
    catch {}
  }

  async startAction() {
    await page.screenshot({path: 'example.png'});
 
  }


}
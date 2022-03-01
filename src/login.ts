import { Browser, Page } from "puppeteer";

export async function login(browser: Browser, username: string, password: string) {

  const page = await browser.newPage();

  await page.goto('https://entreprises.revenuquebec.ca/EntPres/SX/SX00/sx00.Portail.PIU/SX00A01/?CLNG=A');

  await page.type("#AuthUtilisateur1_Authentificationidpwd1_txtCodeUtils", username);
  const waiter = page.waitForNavigation();
  await page.click('#AuthUtilisateur1_ContinuerRecaptcha');
  await waiter;

  await page.type("#AuthUtilisateur1_Authentificationidpwd1_txtMotPasse", password);
  await page.click("#AuthUtilisateur1_rubBouton_btnContinuer");
  await page.waitForNavigation();

  await closePopup(page);

  return page;
}

export async function closePopup(page: Page) {
  try {
    await page.click("#kx-modal-pedagogique .kx-checkbox");
    await page.click("#kx-modal-pedagogique-fermer");
  }
  catch { 
    // no problem
  }
}
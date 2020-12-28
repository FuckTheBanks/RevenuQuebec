import { ElementHandle, Page } from "puppeteer";

export async function readText(page: Page, selector: string|ElementHandle) {
  const element = typeof selector == 'string' ? await page.$(selector) : selector;
  const s: string = await page.evaluate(element => element.innerText, element);
  return s.trim();
}

export async function clickXPath(page: Page, selector: string, index?: number) {
  const elements = await page.$x(selector);
  if ((
    elements.length == 1 && index === undefined) || 
    (index != undefined && elements.length > index)
  ){
    await elements[0].click();
    return true;
  }
  return false;
}
export async function clickLink(page: Page, text: string, index?: number) {

  const r = await clickXPath(page, `//a[contains(., '${text}')]`, index);
  if (r) {
    await page.waitForNavigation({waitUntil: "networkidle2"});
  }
  return r;
} 

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}   
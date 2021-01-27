import { ElementHandle, Page } from "puppeteer";
import { RQScraper } from ".";
import { sleep } from "./utils";

export async function navigateToFile(this: RQScraper, menuEntries: string[], file: string) {
  // Navigate to page
  const page = await this.newPage()

  // Now we go somewhere
  await navigateMenu(page, menuEntries);
  await page.waitForNavigation();

  // Clicking the link sporadically fails, so we extract the href and explicitly go there.
  const links = await page.$x(`//a[contains(., '${file}')]`);
  if (!links || links.length != 1)
    throw new Error("Assumption failed: unexpected number of account links found");
  
  const hrefPropery = await links[0].getProperty('href');
  const href = await hrefPropery.jsonValue() as string;
  await page.goto(href);
  return page;
}

// Navigate the menu system, clicking each item in turn
async function navigateMenu(page: Page, menuEntries: string[]) {

  // Open menu
  await page.click("#button-nav-mobile-main");
  let search = '//*[@id="nav-mobile-main"]';
  // Navigate through the options, click by case insenstive text
  for (const entry of menuEntries) {
    await sleep(250);
    const toLower = "translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')";
    const path = `${search}/descendant::node()/child::*[contains(${toLower}, '${entry.toLowerCase()}')]`;
    const elements = await page.$x(path);
    const toClick = await lastVisibleElement(elements);
    if (!toClick) {
      throw new Error(`Cannot find visible menu element with selector: ${path}`);
    }
    await toClick.click();
    search = path;
  }
}

const lastVisibleElement = async (els: ElementHandle[]) => {
  for (const el of els.reverse()) {
    if (await isVisible(el))
      return el;
  }
}

const isVisible = async (el: ElementHandle) => 
  (await el.boundingBox()) != null; 
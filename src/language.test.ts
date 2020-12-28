import puppeteer from 'puppeteer';
import { login } from './login';
import { clickLink } from './utils';
import {selectLanguage} from './language';

test('switch language completes', async () => {

  jest.setTimeout(5 * 60 * 1000)
  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await login(browser, process.env.RQ_USERNAME!, process.env.RQ_PASSWORD!);

  await selectLanguage(page, "EN")
  await selectLanguage(page, "EN")
  await selectLanguage(page, "FR")
})
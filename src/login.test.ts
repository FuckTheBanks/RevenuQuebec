import puppeteer from 'puppeteer';
import { login } from './login';
require("dotenv").config();

test('login completes', async () => {

  jest.setTimeout(5 * 60 * 1000)
  const browser = await puppeteer.launch({
    headless: false
  });

  await login(browser, process.env.RQ_USERNAME!, process.env.RQ_PASSWORD!);
})
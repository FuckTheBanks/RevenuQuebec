import puppeteer from 'puppeteer';
import { RQScraper } from '.';
import { fetchSOA , navigateToPage, clickNextPage } from './consumption';



test('can fetch consumptions taxes completes', async () => {

  jest.setTimeout(5 * 60 * 1000)

  const rq = await RQScraper.init("EN", undefined,  undefined, {
    headless: false
  })

  // try and fetch consumption
  const r = await rq.fetchSOA("RT0001");

  // ensure no duplicates (happened when update was too quick)
  const entryCounts = r.reduce((dict, e) => dict.set(e.periodEnding, (dict.get(e.periodEnding) ?? 0) + 1), {} as Map<string, number>);
  expect(Math.max(...Object.values(entryCounts))).toBe(1);

  console.log("Test Complete");
})

test('can navigate pages', async () => {

  jest.setTimeout(5 * 60 * 1000)

  const rq = await RQScraper.init("EN", undefined,  undefined, {
    headless: false
  })

  const page = await rq.newPage();
  await navigateToPage(page, "RT0001");

  let r = await clickNextPage(page);
  expect(r).toBeTruthy();
  r = await clickNextPage(page);
  expect(r).toBeFalsy();
  console.log("Test Complete");
})
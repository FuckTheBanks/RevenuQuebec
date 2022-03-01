import { RQScraper } from '..';
import { navigateToFile } from './consumption';
import { clickNextPage } from './gst';
require("dotenv").config();

beforeEach(() => {
  jest.setTimeout(5 * 60 * 1000)
})

async function fetchAndTestAccount(file: string) {
  const rq = await RQScraper.init("EN", undefined, undefined, {
    headless: false
  })

  const r = await rq.fetchGstSOA(file);
  // ensure no duplicates (happened when update was too quick)
  const entryCounts = r.reduce((dict, e) => dict.set(e.period.end, (dict.get(e.period.end) ?? 0) + 1), new Map<string, number>());
  expect(Math.max(...entryCounts.values())).toBe(1);
  
  await rq.release();
  console.log("Test Complete");
}

test('can fetch GST taxes', async () => fetchAndTestAccount("RT0001"))
test('can navigate pages', async () => {

  const rq = await RQScraper.init("EN", undefined, undefined, {
    headless: false
  })
  const page = await navigateToFile(rq, "RT0001");
  
  // I have 2 pages of results
  let r = await clickNextPage(page);
  expect(r).toBeTruthy();
  r = await clickNextPage(page);
  expect(r).toBeFalsy();

  await rq.release();
  console.log("Test Complete");
})
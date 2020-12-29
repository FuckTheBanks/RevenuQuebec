import { RQScraper } from '..';
import { navigateToPage } from './consumption';
import { clickNextPage } from './gst';


beforeEach(() => {
  jest.setTimeout(5 * 60 * 1000)
})

async function fetchAndTestAccount(file: string) {
  const rq = await RQScraper.init("EN", undefined,  undefined, {
  headless: false
})

const r = await rq.fetchGstSOA(file);
// ensure no duplicates (happened when update was too quick)
const entryCounts = r.reduce((dict, e) => dict.set(e.periodEnding, (dict.get(e.periodEnding) ?? 0) + 1), new Map<string, number>());
expect(Math.max(...entryCounts.values())).toBe(1);

console.log("Test Complete");
}

test('can fetch GST taxes', async () => fetchAndTestAccount("RT0001"))
test('can navigate pages', async () => {

  const rq = await RQScraper.init("EN", undefined,  undefined, {
    headless: false
  })

  const page = await rq.newPage();
  await navigateToPage(page, "RT0001");

  // I have 2 pages of results
  let r = await clickNextPage(page);
  expect(r).toBeTruthy();
  r = await clickNextPage(page);
  expect(r).toBeFalsy();
  console.log("Test Complete");
})
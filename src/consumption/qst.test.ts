import { RQScraper } from '..';
import { navigateToPage } from './consumption';
import { fetchQstSOA } from './qst';


beforeEach(() => {
  jest.setTimeout(5 * 60 * 1000)
})

test('can fetch QST taxes', async () => fetchAndTestAccount("TQ0001"))

async function fetchAndTestAccount(file: string) {
  const rq = await RQScraper.init("EN", undefined,  undefined, {
  headless: false
})

const r = await rq.fetchQstSOA(file);
// ensure no duplicates (happened when update was too quick)
const entryCounts = r.reduce((dict, e) => dict.set(e.periodEnding, (dict.get(e.periodEnding) ?? 0) + 1), new Map<string, number>());
expect(Math.max(...entryCounts.values())).toBe(1);

console.log("Test Complete");
}

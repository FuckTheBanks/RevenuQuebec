import { RQScraper } from '..';
import { sleep } from '../utils';

beforeEach(() => {
  jest.setTimeout(5 * 60 * 1000)
})

it('can fetch QST taxes', async () => {
  // eslint-disable-next-line prefer-const
  let headless = undefined;
  headless = false;
  const rq = await RQScraper.init("EN", undefined, undefined, {
    headless
  })

  const r = await rq.fetchQstSOA();
  await sleep(500);
  // ensure no duplicates (happened when update was too quick)
  const entryCounts = r.reduce((dict, e) => dict.set(e.period.end, (dict.get(e.period.end) ?? 0) + 1), new Map<string, number>());
  expect(Math.max(...entryCounts.values())).toBe(1);

  await rq.release();
  console.log("Test Complete");
})

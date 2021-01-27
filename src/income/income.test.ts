import { RQScraper } from "..";

beforeEach(() => {
  jest.setTimeout(5 * 60 * 1000)
})

it('can fetch Income tax SOA', async () => {
  
  const rq = await RQScraper.init("EN", undefined, undefined, {
    headless: false
  })

  const r = await rq.fetchIncomeSOA();

  expect(r.length).toBeGreaterThan(0);

  await rq.release();
  console.log("Test Complete");
})

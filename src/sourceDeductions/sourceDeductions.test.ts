import { RQScraper } from "..";

beforeEach(() => {
  jest.setTimeout(5 * 60 * 1000)
})

it('can fetch Source Deductions SOA', async () => {
  
  const rq = await RQScraper.init("EN")

  const r = await rq.fetchSourceDeductionsSOA();

  expect(r.length).toBeGreaterThan(0);

  await rq.release();
  console.log("Test Complete");
})

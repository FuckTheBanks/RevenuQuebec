import { RQScraper } from "..";

beforeEach(() => {
  jest.setTimeout(5 * 60 * 1000)
})

it('can complete multiple actions', async () => {
  
  const rq = await RQScraper.init("EN", undefined, undefined, {
    headless: true
  });
  console.log("scraper initialized");
  
  await rq.fetchQstSOA("TQ0001");
  console.log("Fetched QST data");

  await rq.fetchGstSOA("RT0001");
  console.log("Fetched GST data");

  await rq.fetchIncomeSOA();
  console.log("Fetched Income Tax data");
  
  await rq.fetchSourceDeductionsSOA();
  console.log("Fetched Source Deductions Tax data");

  console.log("Test Complete");
})

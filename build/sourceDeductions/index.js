"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSourceDeductionsSOA = void 0;
const consumption_1 = require("../consumption/consumption");
const selectYear_1 = require("../selectYear");
function fetchSourceDeductionsSOA(file = "RS0001") {
    return __awaiter(this, void 0, void 0, function* () {
        const page = yield this.navigateToFile(["Source Deductions and Contributions", "Statement of account"], file);
        // Get all years, then iterate through them scraping data
        const results = [];
        const years = yield (0, selectYear_1.getAvailableYears)(page);
        for (const year of years) {
            const ready = yield (0, selectYear_1.selectAndViewYear)(page, year);
            if (ready) {
                const data = yield scrapeData(page);
                results.push(...data);
            }
        }
        yield page.close();
        return results;
    });
}
exports.fetchSourceDeductionsSOA = fetchSourceDeductionsSOA;
function scrapeData(page) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get all titles
        const titles = yield page.$$eval("#detailsperiodes > h3", h3s => h3s.map(h3 => h3.textContent));
        const tables = yield page.$$eval("#detailsperiodes table > tbody", tables => tables.map(table => 
        // each row maps to an entry
        [...table.querySelectorAll("tr")].map(row => Object.fromEntries([...row.querySelectorAll("td")].map((td, idx) => {
            var _a;
            return [
                (_a = td.getAttribute("data-th")) !== null && _a !== void 0 ? _a : idx,
                td.innerText.trim()
            ];
        })))));
        const periodDates = titles
            .map(str => (0, consumption_1.extractDates)(str))
            .map((dateArray) => ({
            start: dateArray[0],
            end: dateArray[1],
        }));
        return periodDates.map((period, index) => ({
            period,
            items: tables[index].map(item => {
                var _a, _b;
                return ({
                    amount: (_a = item.Amount) !== null && _a !== void 0 ? _a : item[0],
                    description: (_b = item.Description) !== null && _b !== void 0 ? _b : item[1],
                    date: (0, consumption_1.cleanDate)(item.Date)
                });
            })
        }));
    });
}
//# sourceMappingURL=index.js.map
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
exports.scrapeEntry = exports.clickNextPage = exports.fetchGstSOA = void 0;
const utils_1 = require("../utils");
const consumption_1 = require("./consumption");
function fetchGstSOA(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const results = [];
        const page = yield (0, consumption_1.navigateToFile)(this, file);
        yield (0, utils_1.sleep)(1000); // defensive sleep: We have hit an error a few times here
        // fetch page entries, then click "Next Page" button
        do {
            const pageResults = yield iterateEntries(page);
            results.push(...pageResults);
        } while (yield clickNextPage(page));
        yield page.close();
        return results;
    });
}
exports.fetchGstSOA = fetchGstSOA;
function iterateEntries(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const entries = yield page.$$("#rechercheParPeriodeTableau table > tbody > tr > :first-child > a");
        const r = [];
        for (let i = 0; i < entries.length; i++) {
            yield (0, utils_1.sleep)(50); // flush console log
            yield page.click(`#rechercheParPeriodeTableau table > tbody > :nth-child(${i + 1}) > :first-child > a`);
            yield page.waitForResponse(() => true);
            yield (0, utils_1.sleep)(125); // Wait for the DOM update
            yield page.click("#consulter-declaration-selectionnee");
            yield page.waitForResponse(() => true);
            // Wait for the DOM update.  We cannot wait the element here
            // because on the second pass the selector already exists.
            // TODO: Replace this with a mutation listener, a la
            // https://github.com/puppeteer/puppeteer/issues/2945
            if (i == 0)
                yield page.waitForSelector("#detail-releve-compte > div > h3");
            else
                yield (0, utils_1.sleep)(125);
            const period = yield scrapeEntry(page);
            r.push(period);
        }
        return r;
    });
}
function clickNextPage(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const el = yield page.$("li.next-action > a");
        if (el) {
            yield el.click();
            yield page.waitForResponse(() => true);
            // the response alone is insufficient to wait for the DOM update
            // we add a manual wait here to allow the update to complete.
            // there is probably a deterministic way to do this, but it works for me now
            yield (0, utils_1.sleep)(250);
            return true;
        }
        return false;
    });
}
exports.clickNextPage = clickNextPage;
function scrapeEntry(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const header = yield (0, utils_1.readText)(page, "#detail-releve-compte > div > h3");
        const rows = yield page.$$("#detail-releve-compte table > tbody > tr");
        const p = rows.map(row => scrapeRow(page, row));
        return {
            period: {
                end: (0, consumption_1.extractDates)(header)[0]
            },
            items: yield Promise.all(p),
        };
    });
}
exports.scrapeEntry = scrapeEntry;
function scrapeRow(page, row) {
    return __awaiter(this, void 0, void 0, function* () {
        const tds = yield row.$$('td');
        return {
            date: (0, consumption_1.cleanDate)(yield (0, utils_1.readText)(page, tds[0])),
            description: yield (0, utils_1.readText)(page, tds[1]),
            posted: (0, consumption_1.cleanDate)(yield (0, utils_1.readText)(page, tds[2])),
            amount: yield (0, utils_1.readText)(page, tds[3]),
        };
    });
}
//# sourceMappingURL=gst.js.map
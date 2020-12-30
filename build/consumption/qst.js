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
exports.fetchQstSOA = void 0;
const consumption_1 = require("./consumption");
const watcher_1 = require("../watcher");
const utils_1 = require("../utils");
function fetchQstSOA(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = yield consumption_1.navigateToFile(this, file);
        // Get all years, then iterate through them scraping data
        const results = [];
        const years = yield getAvailableYears(page);
        for (const year of years) {
            const data = yield scrapeYear(page, year);
            results.push(...data);
        }
        yield page.close();
        return results;
    });
}
exports.fetchQstSOA = fetchQstSOA;
function getAvailableYears(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const alloptions = yield page.$$eval("#DossierSelectionner_AnneeSelectionneeTexte option", options => options.map(opt => opt.value));
        // filter out invalid Options
        return alloptions
            .map(opt => parseInt(opt))
            .filter(year => !Number.isNaN(year));
    });
}
function scrapeYear(page, year) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Scraping year: ${year}`);
        yield setYear(page, year);
        yield selectAllPeriods(page);
        const watcher = yield watcher_1.getWaitableWatcher(page, "#detailsperiodes");
        yield page.click("#btnconsulter");
        yield watcher.changed;
        return yield scrapeData(page);
    });
}
function setYear(page, year) {
    return __awaiter(this, void 0, void 0, function* () {
        // let's make sure this change is actually a change - if not we indefinitely hang
        const current = yield page.$eval("#DossierSelectionner_AnneeSelectionneeTexte", sel => sel.value);
        if (current != `${year}`) {
            const watcher = yield watcher_1.getWaitableWatcher(page, "#tableauperiodes", 250);
            yield page.select("#DossierSelectionner_AnneeSelectionneeTexte", `${year}`);
            yield watcher.changed;
            // We must wait for the select-all to be deselected
            while (yield page.$("tr.active-selectall"))
                yield utils_1.sleep(50);
        }
        else {
            yield utils_1.sleep(250);
        }
    });
}
function selectAllPeriods(page) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.waitForSelector("a.selectallperiodes");
        while (!(yield page.$("tr.active-selectall"))) {
            yield page.click("a.selectallperiodes");
            yield utils_1.sleep(50);
        }
    });
}
function scrapeData(page) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get all titles
        const titles = yield page.$$eval("#detailsperiodes > h3", h3s => h3s.map(h3 => h3.textContent));
        const tables = yield page.$$eval("#detailsperiodes table > tbody", tables => tables.map(table => 
        // each row maps to an entry
        [...table.querySelectorAll("tr")].map(row => Object.fromEntries([...row.querySelectorAll("td")].map(td => [
            td.getAttribute("data-th"),
            td.innerText.trim()
        ])))));
        return titles.map((t, index) => ({
            periodEnding: t !== null && t !== void 0 ? t : "ERROR: Missing Title",
            items: tables[index]
        }));
    });
}
//# sourceMappingURL=qst.js.map
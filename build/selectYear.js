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
exports.setYear = exports.selectAndViewYear = exports.getAvailableYears = void 0;
const utils_1 = require("./utils");
const watcher_1 = require("./watcher");
function getAvailableYears(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const alloptions = yield page.$$eval("#DossierSelectionner_AnneeSelectionneeTexte option", options => options.map(opt => opt.value));
        // filter out invalid Options
        return alloptions
            .map(opt => parseInt(opt))
            .filter(year => !Number.isNaN(year));
    });
}
exports.getAvailableYears = getAvailableYears;
function selectAndViewYear(page, year) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Scraping year: ${year}`);
        if (!(yield setYear(page, year)))
            return false;
        if (!(yield selectAllPeriods(page)))
            return false;
        const watcher = yield (0, watcher_1.getWaitableWatcher)(page, "#detailsperiodes");
        yield page.click("#btnconsulter");
        yield watcher.changed;
        return true;
    });
}
exports.selectAndViewYear = selectAndViewYear;
function selectAllPeriods(page) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield page.waitForSelector("a.selectallperiodes");
            while (!(yield page.$("tr.active-selectall"))) {
                yield page.click("a.selectallperiodes");
                yield (0, utils_1.sleep)(50);
            }
            return true;
        }
        catch (_a) {
            return false;
        }
    });
}
function setYear(page, year) {
    return __awaiter(this, void 0, void 0, function* () {
        // let's make sure this change is actually a change - if not we indefinitely hang
        const current = yield page.$eval("#DossierSelectionner_AnneeSelectionneeTexte", sel => sel.value);
        if (current != `${year}`) {
            const watcher = yield (0, watcher_1.getWaitableWatcher)(page, "#tableauperiodes", 250);
            yield page.select("#DossierSelectionner_AnneeSelectionneeTexte", `${year}`);
            yield watcher.changed;
            // We must wait for the select-all to be deselected
            while (yield page.$("tr.active-selectall"))
                yield (0, utils_1.sleep)(50);
        }
        else {
            yield (0, utils_1.sleep)(250);
        }
        // If the page shows an alert, there are no entries
        const alert = yield page.$("#tableauperiodes > div > div.kx-alert-text");
        if (alert) {
            const text = yield (0, utils_1.readText)(page, alert);
            console.warn(`Fetch ${year} failed - ${text}`);
            return false;
        }
        return true;
    });
}
exports.setYear = setYear;
//# sourceMappingURL=selectYear.js.map
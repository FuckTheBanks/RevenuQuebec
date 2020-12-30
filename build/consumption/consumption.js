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
exports.scrapeEntry = exports.navigateToFile = void 0;
const utils_1 = require("../utils");
function navigateToFile(scraper, file) {
    return __awaiter(this, void 0, void 0, function* () {
        // Navigate to page
        // await page.click("#button-nav-mobile-main");
        // await sleep(100);
        // await page.click("#nav-mobile-main > ul > li:nth-child(2) > button");
        // await sleep(100);
        // await page.click("#nav-mobile-main > ul > li.nav-mobile-lien.selected > div > div:nth-child(2) > ul > li:nth-child(5) > a");
        // Navigating the menu is unreliable (we can end up on the wrong page - again, sporadically)
        const page = yield scraper.newPage("https://entreprises.revenuquebec.ca/EntPres/SX/SX00/SX00.RensFin.PIU/KX00A00/Portail/NaviguerVersService?codeService=SX00N01A&route=taxes");
        // Clicking the link sporadically fails, so we extract the href and explicitly go there.
        const links = yield page.$x(`//a[contains(., '${file}')]`);
        if (!links || links.length != 1)
            throw new Error("Assumption failed: unexpected number of account links found");
        const hrefPropery = yield links[0].getProperty('href');
        const href = yield hrefPropery.jsonValue();
        yield page.goto(href);
        return page;
    });
}
exports.navigateToFile = navigateToFile;
function scrapeEntry(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const header = yield utils_1.readText(page, "#detail-releve-compte > div > h3");
        const rows = yield page.$$("#detail-releve-compte table > tbody > tr");
        const p = rows.map(row => scrapeRow(page, row));
        return {
            periodEnding: header,
            items: yield Promise.all(p),
        };
    });
}
exports.scrapeEntry = scrapeEntry;
function scrapeRow(page, row) {
    return __awaiter(this, void 0, void 0, function* () {
        const tds = yield row.$$('td');
        return {
            date: yield utils_1.readText(page, tds[0]),
            description: yield utils_1.readText(page, tds[1]),
            amount: yield utils_1.readText(page, tds[2]),
            posted: yield utils_1.readText(page, tds[3])
        };
    });
}
//# sourceMappingURL=consumption.js.map
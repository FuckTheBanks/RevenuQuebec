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
exports.navigateToFile = void 0;
const utils_1 = require("./utils");
function navigateToFile(menuEntries, file) {
    return __awaiter(this, void 0, void 0, function* () {
        // Navigate to page
        const page = yield this.newPage();
        // Now we go somewhere
        yield navigateMenu(page, menuEntries);
        yield page.waitForNavigation();
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
// Navigate the menu system, clicking each item in turn
function navigateMenu(page, menuEntries) {
    return __awaiter(this, void 0, void 0, function* () {
        // Open menu
        yield page.click("#button-nav-mobile-main");
        let search = '//*[@id="nav-mobile-main"]';
        // Navigate through the options, click by case insenstive text
        for (const entry of menuEntries) {
            yield (0, utils_1.sleep)(250);
            const toLower = "translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')";
            const path = `${search}/descendant::node()/child::*[contains(${toLower}, '${entry.toLowerCase()}')]`;
            const elements = yield page.$x(path);
            const toClick = yield lastVisibleElement(elements);
            if (!toClick) {
                throw new Error(`Cannot find visible menu element with selector: ${path}`);
            }
            yield toClick.click();
            search = path;
        }
    });
}
const lastVisibleElement = (els) => __awaiter(void 0, void 0, void 0, function* () {
    for (const el of els.reverse()) {
        if (yield isVisible(el))
            return el;
    }
});
const isVisible = (el) => __awaiter(void 0, void 0, void 0, function* () { return (yield el.boundingBox()) != null; });
//# sourceMappingURL=navigate.js.map
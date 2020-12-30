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
exports.sleep = exports.clickLink = exports.clickXPath = exports.readText = void 0;
function readText(page, selector) {
    return __awaiter(this, void 0, void 0, function* () {
        const element = typeof selector == 'string' ? yield page.$(selector) : selector;
        const s = yield page.evaluate(element => element.innerText, element);
        return s.trim();
    });
}
exports.readText = readText;
function clickXPath(page, xpath, index) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.waitForXPath(xpath);
        const elements = yield page.$x(xpath);
        if ((elements.length == 1 && index === undefined) ||
            (index != undefined && elements.length > index)) {
            // clicking the elink
            yield elements[index !== null && index !== void 0 ? index : 0].click();
            return true;
        }
        return false;
    });
}
exports.clickXPath = clickXPath;
function clickLink(page, text, index) {
    return __awaiter(this, void 0, void 0, function* () {
        const r = yield clickXPath(page, `//a[contains(., '${text}')]`, index);
        if (r) {
            yield page.waitForNavigation({ waitUntil: "networkidle2" });
        }
        return r;
    });
}
exports.clickLink = clickLink;
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
exports.sleep = sleep;
//# sourceMappingURL=utils.js.map
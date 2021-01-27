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
exports.navigateToFile = exports.extractDates = exports.cleanDate = void 0;
function cleanDate(str) {
    return str === null || str === void 0 ? void 0 : str.trim().replace(/\D/g, '-');
}
exports.cleanDate = cleanDate;
function extractDates(str) {
    var _a;
    const m = (_a = str === null || str === void 0 ? void 0 : str.match(/\d+\D\d+\D\d+/g)) !== null && _a !== void 0 ? _a : [];
    return m.map(d => cleanDate(d));
}
exports.extractDates = extractDates;
function navigateToFile(scraper, file) {
    return __awaiter(this, void 0, void 0, function* () {
        return scraper.navigateToFile(["CONSUMPTION TAXES", "Statement of account"], file);
    });
}
exports.navigateToFile = navigateToFile;
//# sourceMappingURL=consumption.js.map
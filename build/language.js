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
exports.selectLanguage = void 0;
const login_1 = require("./login");
const utils_1 = require("./utils");
function selectLanguage(page, language) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield utils_1.clickLink(page, language);
            console.log(`Switched language to: ${language}`);
            yield login_1.closePopup(page);
        }
        catch (e) {
            // do nothing
            console.log(`Couldnt switch lang: ${e.message}`);
        }
    });
}
exports.selectLanguage = selectLanguage;
//# sourceMappingURL=language.js.map
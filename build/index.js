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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RQScraper = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const gst_1 = require("./consumption/gst");
const qst_1 = require("./consumption/qst");
const income_1 = require("./income");
const sourceDeductions_1 = require("./sourceDeductions");
const language_1 = require("./language");
const login_1 = require("./login");
const navigate_1 = require("./navigate");
class RQScraper {
    ///////////////////////////////////////////////////////////////////////
    // Construction functions
    constructor(browser, username, password) {
        ///////////////////////////////////////////////////////////////////////
        // Data scraping
        this.fetchGstSOA = gst_1.fetchGstSOA;
        this.fetchQstSOA = qst_1.fetchQstSOA;
        this.fetchIncomeSOA = income_1.fetchIncomeSOA;
        this.fetchSourceDeductionsSOA = sourceDeductions_1.fetchSourceDeductionsSOA;
        ///////////////////////////////////////////////////////////////////////
        // Helper functions
        this.navigateToFile = navigate_1.navigateToFile;
        this.login = () => (0, login_1.login)(this.browser, this.username, this.password);
        this.newPage = (url) => __awaiter(this, void 0, void 0, function* () {
            const page = yield this.browser.newPage();
            yield page.goto(url !== null && url !== void 0 ? url : "https://entreprises.revenuquebec.ca/EntPres/SX/SX00/sx00.Portail.PIU/SX00A01/");
            yield (0, login_1.closePopup)(page);
            return page;
        });
        this.browser = browser;
        this.username = username;
        this.password = password;
    }
    static init(lang, username, password, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = username || process.env.RQ_USERNAME;
            const pwd = password || process.env.RQ_PASSWORD;
            if (!user || !pwd)
                throw new Error("Cannot initialize RQ scraper, no username or password");
            const browser = yield puppeteer_1.default.launch(options);
            const rq = new RQScraper(browser, user, pwd);
            const page = yield rq.login();
            if (lang)
                yield (0, language_1.selectLanguage)(page, lang);
            yield page.close();
            return rq;
        });
    }
    release() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.browser.close();
        });
    }
}
exports.RQScraper = RQScraper;
//# sourceMappingURL=index.js.map
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
exports.closePopup = exports.login = void 0;
function login(browser, username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = yield browser.newPage();
        yield page.goto('https://entreprises.revenuquebec.ca/EntPres/SX/SX00/sx00.Portail.PIU/SX00A01/?CLNG=A');
        yield page.type("#AuthUtilisateur1_Authentificationidpwd1_txtCodeUtils", username);
        yield page.type("#AuthUtilisateur1_Authentificationidpwd1_txtMotPasse", password);
        yield page.click("#AuthUtilisateur1_rubBouton_btnContinuer");
        yield page.waitForNavigation();
        yield closePopup(page);
        return page;
    });
}
exports.login = login;
function closePopup(page) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield page.click("#kx-modal-pedagogique .kx-checkbox");
            yield page.click("#kx-modal-pedagogique-fermer");
        }
        catch (_a) {
            // no problem
        }
    });
}
exports.closePopup = closePopup;
//# sourceMappingURL=login.js.map
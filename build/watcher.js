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
exports.getWaitableWatcher = exports.stopWatchingElement = exports.watchElement = void 0;
const defer_1 = require("./defer");
const lodash_1 = require("lodash");
const currentObservers = new Map();
function puppeteerMutationListener(selector, nodes) {
    const cb = currentObservers.get(selector);
    if (!cb)
        console.warn('no cb for selctor: ' + selector);
    else
        cb(nodes);
}
function watchElement(page, selector, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        if (currentObservers.has(selector))
            throw new Error("Cannot watch selector twice");
        currentObservers.set(selector, callback);
        // because this exposed function survives navigations, we must only expose it once
        if (!page.__FTBhasExposedListener) {
            yield page.exposeFunction('puppeteerMutationListener', puppeteerMutationListener);
            page.__FTBhasExposedListener = true;
        }
        yield page.evaluate(selector => {
            const jswindow = window;
            const target = document.querySelector(selector);
            const observer = new MutationObserver(mutationsList => {
                const nodes = mutationsList.flatMap(m => m.addedNodes);
                window.puppeteerMutationListener(selector, nodes);
            });
            observer.observe(target, {
                subtree: true,
                childList: true,
            });
            jswindow[`puppeteerMutationObserver${selector}`] = observer;
        }, selector);
    });
}
exports.watchElement = watchElement;
function stopWatchingElement(page, selector) {
    return __awaiter(this, void 0, void 0, function* () {
        if (currentObservers.has(selector)) {
            currentObservers.delete(selector);
            yield page.evaluate(selector => {
                var _a;
                const jswindow = window;
                (_a = jswindow[`puppeteerMutationObserver${selector}`]) === null || _a === void 0 ? void 0 : _a.disconnect();
            }, selector);
        }
    });
}
exports.stopWatchingElement = stopWatchingElement;
function getWaitableWatcher(page, selector, idletime = 250) {
    return __awaiter(this, void 0, void 0, function* () {
        // We cannot return our promise until we have setup the observers
        const r = (0, defer_1.defer)();
        const rdelayed = (0, lodash_1.debounce)(() => __awaiter(this, void 0, void 0, function* () {
            yield stopWatchingElement(page, selector);
            r.resolve();
        }), idletime);
        yield watchElement(page, selector, () => {
            void rdelayed();
        });
        return {
            changed: r
        };
    });
}
exports.getWaitableWatcher = getWaitableWatcher;
//# sourceMappingURL=watcher.js.map
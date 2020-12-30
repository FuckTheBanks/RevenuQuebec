"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defer = void 0;
function defer() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let rej;
    let res;
    const promise = new Promise((resolve, reject) => {
        res = resolve;
        rej = reject;
    });
    promise.resolve = res;
    promise.reject = rej;
    return promise;
}
exports.defer = defer;
//# sourceMappingURL=defer.js.map
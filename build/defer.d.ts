declare type DeferredPromise<T> = Promise<T> & {
    resolve: (v: T) => void;
    reject: () => void;
};
export declare function defer<T = void>(): DeferredPromise<T>;
export {};

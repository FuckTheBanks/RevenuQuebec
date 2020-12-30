import { Page } from "puppeteer";
declare type WatchCallback = (nodes: NodeList[]) => void;
export declare function watchElement(page: Page, selector: string, callback: WatchCallback): Promise<void>;
export declare function stopWatchingElement(page: Page, selector: string): Promise<void>;
export declare function getWaitableWatcher(page: Page, selector: string, idletime?: number): Promise<{
    changed: Promise<void> & {
        resolve: (v: void) => void;
        reject: () => void;
    };
}>;
export {};

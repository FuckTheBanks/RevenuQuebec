/* eslint-disable @typescript-eslint/no-non-null-assertion */
type DeferredPromise<T> = Promise<T> & {
  resolve: (v: T) => void;
  reject: () => void;
}

export function defer<T = void>() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rej: (reason?: any) => void;
  let res:  (value: T | PromiseLike<T>) => void;

	const promise = new Promise<T>((resolve, reject) => {
		res = resolve;
		rej = reject;
	}) as DeferredPromise<T>;

	promise.resolve = res!;
	promise.reject = rej!;

	return promise;
}
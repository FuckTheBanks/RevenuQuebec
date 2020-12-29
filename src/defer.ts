type DeferredPromise<T> = Promise<T> & {
  resolve: (v: T) => void;
  reject: () => void;
}

export function defer<T = void>() {
  let res:  (value: T | PromiseLike<T>) => void;
  let rej: (reason?: any) => void;

	let promise = new Promise<T>((resolve, reject) => {
		res = resolve;
		rej = reject;
	}) as DeferredPromise<T>;

	promise.resolve = res!;
	promise.reject = rej!;

	return promise;
}
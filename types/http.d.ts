import { AxiosInstance, AxiosPromise } from 'axios';

type Fulfilled<T> = (value: T) => T | Promise<T>;
type Rejected = (error: any) => any | void;

export type HttpPromise = AxiosPromise;

interface HttpProvider {
  instance(): AxiosInstance;
  destroy(): void;
  setBaseURL(url: string): void;
  setAuthorization(token: string): void;
  removeAuthorization(): void;
  setRequestInterceptor(onFulfilled?: Fulfilled<AxiosPromise>, onRejected?: Rejected): void;
  setResponseInterceptor(onFulfilled?: Fulfilled<AxiosPromise>, onRejected?: Rejected): void;
}

export const http: HttpProvider;

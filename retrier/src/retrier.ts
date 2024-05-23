export interface IRetryOptions {
  /** Number of attempts */
  limit?: number;
  /** Delay between attempts in milliseconds */
  delay?: number;
  /** Delay before first attempt*/
  firstAttemptDelay?: number;
  /** Treat resolved value as invalid and retry - if provided callback returns true */
  keepRetryingIf?: (value: any, attempt: number) => boolean;
  /** Stop retrying (reject) if specific error - (provided callback returns true) */
  stopRetryingIf?: (reason: any, attempt: number) => boolean;
}

export class Retrier {
  fn: (attempt?: number) => Promise<any>;
  opts: IRetryOptions = {};
  attempt = 0;

  private _resolve: (value?: any) => void;
  private _reject: (reason?: any) => void;

  constructor(opts: IRetryOptions = {}) {
    this.opts.limit = opts.limit || 1;
    this.opts.delay = opts.delay || 0;
    this.opts.firstAttemptDelay = opts.firstAttemptDelay || 0;
    this.opts.keepRetryingIf = opts.keepRetryingIf;
    this.opts.stopRetryingIf = opts.stopRetryingIf;
  }

  resolve(fn: (attempt?: number) => Promise<any>): Promise<any> {
    this.fn = fn;

    return new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;

      this.attempt = 0;
      this._doRetry();
    });
  }

  private _doRetry(recentError?: any): void {
    if (this.attempt >= this.opts.limit) {
      return this._reject(recentError || new Error('Retry limit reached!'));
    }

    setTimeout(
      () => {
        const promise = this.fn(this.attempt);
        if (!(promise instanceof Promise)) {
          // TODO: throw error in contructor if params aren't valid
          return this._reject(new Error('Expecting function which returns promise!'));
        }

        promise.then(
          response => {
            if (this.opts.keepRetryingIf && this.opts.keepRetryingIf(response, this.attempt)) {
              this.attempt++;
              this._doRetry();
            } else {
              this._resolve(response);
            }
          },
          error => {
            if (this.opts.stopRetryingIf && this.opts.stopRetryingIf(error, this.attempt)) {
              this._reject(error);
            } else {
              this.attempt++;
              this._doRetry(error);
            }
          }
        );
      },
      this.attempt === 0 ? this.opts.firstAttemptDelay : this.opts.delay
    );
  }
}

export interface IRertyOptions {
  /** Number of attempts */
  limit?: number;
  /** Delay between attempts in milliseconds */
  delay?: number;
  /** Delay before first attempt*/
  firstAttemptDelay?: number;
  /** Treat resolved response as invalid and retry - if provided callback returns true */
  keepRetryingIf?: Function;
  /** Stop retrying and resolve if specific error - (provided callback returns true) */
  stopRetryingIf?: Function;
}

export class Retrier {
  private _fn: Function;
  private _opts: IRertyOptions;

  constructor(fn: Function, opts: IRertyOptions = {}) {
    opts.limit = opts.limit || 1;
    opts.delay = opts.delay || 0;
    opts.firstAttemptDelay = opts.firstAttemptDelay || 0;

    this._fn = fn;
    this._opts = opts;
  }

  resolve(): Promise<any> {
    return this._doRetry(0); // start
  }

  stopRetrying(): any {

  } 

  continueRetrying(): any {

  }

  private _doRetry(attempt = 0, recentError?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (attempt === this._opts.limit) {
        return reject(recentError || new Error('Retry limit reached!'));
      }

      setTimeout(
        () => {
          const promise = this._fn(attempt);
          if (!(promise instanceof Promise)) {
            throw new Error('Expecting function which returns promise!');
          }

          promise.then(
            response => {
              if (this._opts.keepRetryingIf && this._opts.keepRetryingIf(response)) {
                attempt++;
                this._doRetry(attempt).then(resolve, reject);
              } else {
                resolve(response);
              }
            },
            error => {
              attempt++;
              this._doRetry(attempt, error).then(resolve, reject);
            }
          );
        },
        attempt === 0 ? this._opts.firstAttemptDelay : this._opts.delay
      );
    });
  }
}

// export const resolveWithRetrying = (fn: Function, opts: IRertyOptions = {}): Promise<any> => {
//   opts.limit = opts.limit || 1;
//   opts.delay = opts.delay || 0;

//   const doRetry = (attempt = 0, recentError?: any): Promise<any> => {
//     return new Promise((resolve, reject) => {
//       if (attempt === opts.limit) {
//         return reject(recentError || new Error('Retry limit reached!'));
//       }

//       setTimeout(
//         () => {
//           const promise = fn(attempt);
//           if (!(promise instanceof Promise)) {
//             throw new Error('Expecting function which returns promise!');
//           }

//           promise.then(
//             response => {
//               if (opts.keepRetryingIf && opts.keepRetryingIf(response)) {
//                 attempt++;
//                 doRetry(attempt).then(resolve, reject);
//               } else {
//                 resolve(response);
//               }
//             },
//             error => {
//               attempt++;
//               doRetry(attempt, error).then(resolve, reject);
//             }
//           );
//         },
//         !opts.delayFirstAttempt && attempt === 0 ? 0 : opts.delay
//       );
//     });
//   };

//   return doRetry();
// };

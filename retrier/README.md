# @jsier/retrier
**Promise based retry logic**

A simple, efficient and lightweight package without external dependencies which helps quickly implement JavaScript promise based retry logic. **Retrier** class is built with [TypeScript](http://www.typescriptlang.org/) (preserves full compatibility with pure JavaScript) and exposes intuitive and easy-to-use API. 

**Supports:**
- First attempt delay
- Delay between attempts
- Limiting number of attempts
- Callback to stop retrying if some condition is met (e.g. specific error is encountered)
- Callback to keep retrying if some condition is met (e.g. resolved value is unsatisfactory)


## Getting Started
```bash
$ npm install @jsier/retrier --save
```

## Usage
Retrier constructor expects optional [retry options](#retry-options) object.
Resolve method expects function which returns a promise.

```javascript
import { Retrier } from '@jsier/retrier';

const options = { limit: 5, delay: 2000 };
const retrier = new Retrier(options);
retrier
  .resolve(attempt => new Promise((resolve, reject) => reject('Rejected!')))
  .then(
    result => console.log(result),
    error => console.error(error) // After 5 attempts logs: "Rejected!"
  );
```

## Retry Options
By default, the retrier will retry until provided promise resolves successfully or until retry limit is reached. To override the defaults please see retry options below:

Property | Description | Type | Default
--- | --- | --- | ---
`limit` | Number of attempts. | number | `1`
`delay` | Delay between attempts in milliseconds. | number | `0`
`firstAttemptDelay` | Delay first attempt. | number | `0`
`keepRetryingIf` | Treat resolved value as invalid and keep retrying - if provided function returns truthy value. Example: `keepRetryingIf: (response, attempt) => response.status === 202;` | Function | `undefined`
`stopRetryingIf` | Stop retrying (reject) if specific error - (provided function returns truthy value). Example: `stopRetryingIf: (error, attempt) => error.status === 500;` | Function | `undefined`


## Support
All suggestions and improvements are welcome and appreciated.


## License
The [MIT License](https://github.com/seidme/jsier/blob/master/LICENSE).

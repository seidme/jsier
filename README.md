# jsier
JS uitilities


Retrier

# build and run
npm start 

# test
npm test

# usage
const callback = (attempt: number) => new Promise((resolve, reject) => resolve('Immediate resolve!'));
const options = { limit: 5, delay: 2000, firstAttemptDelay: 5000 };

const retrier = new Retrier(callback, options);

retrier.resolve().then((result) => {
  console.log('result:', result); // -> Immediate resolve!
}, error => {
  console.error(error);
});
function isNullOrUndefined(value: any): boolean {
  return value === undefined || value === null;
}

export function deepValue(src: any, path: string): any {
  if (typeof path !== 'string') {
    throw new Error('Expecting path to the value to be string.');
  }

  path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  path = path.replace(/^\./, ''); // strip a leading dot

  const keys = path.split('.');
  let value = src;

  for (var i = 0, n = keys.length; i < n; ++i) {
    value = value[keys[i]];

    if (isNullOrUndefined(value)) {
      return i === n - 1 ? value : undefined;
    }
  }

  return value;
}

# @jsier/deep-value
A simple, efficient and lightweight package without external dependencies intended for safely resolving deep value of an object or array by providing path to the targeted property. `deepValue` is built with [TypeScript](http://www.typescriptlang.org/) (preserves full compatibility with pure JavaScript) and is easy to use. 


## Getting Started
```bash
$ npm install @jsier/deep-value --save
```


## Usage
`deepValue` as first argument expects object or array as a source. Second argument should be string representing the path to the targeted property.
Non-existing properties or invalid paths provided will return undefined as the result.

```javascript
import { deepValue } from '@jsier/deep-value';

const employee = {
  name: 'Gia',
  age: 44,
  gender: null,
  skills: [['ts', 'js'], ['en', 'fr']],
  children: [{name: 'Mia'}]
};

deepValue(employee, 'name'); // -> 'Gia'
deepValue(employee, 'gender'); // -> null
deepValue(employee, 'skill[0]'); // -> ['ts', 'js']
deepValue(employee, 'skill[0][1]'); // -> 'js'
deepValue(employee, 'children[0].name'); // -> 'Mia'
deepValue(employee.children, '[0].name'); // -> 'Mia'
deepValue(employee.children, '[0].gender'); // -> undefined
```


## Support
All suggestions and improvements are welcomed and appreciated.


## License
The [MIT License](https://github.com/seidme/jsier/blob/master/LICENSE).

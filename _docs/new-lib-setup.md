## New lib setup
Create new lib directory.

### Steps
- Copy and adjust `package.json`, `tsconfig.json` and `README.md` files from one of the existing packages.
- Update main `README.md` file.
- `npm install`
- Create `src` folder and add main file (should be named as the lib itself and should export all from other files if any)
- Copy `spec` folder from one of the existing packages and delete/adjust specs
- Test:
```bash
$ npm test
```

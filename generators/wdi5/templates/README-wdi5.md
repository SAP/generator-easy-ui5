## wdi5 tests

Create and run tests with [wdi5](https://github.com/js-soft/wdi5)

## How to run

1. start the ui5 app via `npm run start`
1. run `wdi5` via `npm run wdi5`  
  this will start Chrome,  
  call the ui5 app at `http://localhost:8080`  
  and validate that the `sap.m.App` control is visible   

Additional options can be triggered via `env` variables `HEADLESS` and `DEBUG`:

```bash
# starts Chrome in headles mode (think: ci/cd)
HEADLESS=true npm run wdi5
```

```bash
# increases timeouts and 
# per default opens up the dev tools when Chrome is launched
DEBUG=true npm run wdi5
```

## Credits

This project has been generated with 💙 and [easy-ui5](https://github.com/SAP/generator-easy-ui5)

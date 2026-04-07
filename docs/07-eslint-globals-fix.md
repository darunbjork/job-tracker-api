Updated ESLint config to recognize Node.js globals.
<br>
Modified eslint.config.mjs to declare 'process' as a readonly global, resolving 'no-undef' errors in jest.setup.mjs.
<br>
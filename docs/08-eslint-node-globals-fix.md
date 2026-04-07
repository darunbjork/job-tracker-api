Fixed ESLint errors for Node.js globals.
<br>
Updated eslint.config.mjs to include 'process: "readonly"' global for Node.js environments, resolving 'no-undef' errors in setup files like jest.setup.mjs.
<br>
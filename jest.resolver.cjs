// jest.resolver.cjs
// eslint-disable-next-line no-undef
module.exports = (request, options) => {
  try {
    return options.defaultResolver(request, options);
  } catch (err) {
    if (request.endsWith('.js')) {
      const tsRequest = request.slice(0, -3) + '.ts';
      try {
        return options.defaultResolver(tsRequest, options);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        // fall through
      }
    }
    throw err;
  }
};
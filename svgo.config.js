module.exports = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // customize default plugin options
          inlineStyles: {
            onlyMatchedOnce: false,
          },

          // or disable plugins
          removeTitle: false,
          removeDoctype: false,
          removeViewBox: false,
          cleanupIds: false,
        },
      },
    },
  ],
};

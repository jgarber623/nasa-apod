module.exports = (async () => {
  const { default: config } = await import("@jgarber/eslint-config");

  return [
    { ignores: ["coverage"] },
    ...config,
    {
      files: ["lib/**/*.js"],
      languageOptions: {
        globals: {
          fetch: "readonly",
        },
      },
    },
  ];
})();

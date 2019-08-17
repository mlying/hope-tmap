module.exports = {
  extends: ['stylelint-config-pipenet'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tmap-prefix'],
      },
    ],
  },
};

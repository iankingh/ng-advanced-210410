module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [require('karma-jasmine'), require('karma-chrome-launcher'), require('karma-jasmine-html-reporter')],
    client: { clearContext: true },
    reporters: ['progress', 'kjhtml'],
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true,
  });
};

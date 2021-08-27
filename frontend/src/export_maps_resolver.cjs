// Temporary workaround while we wait for https://github.com/facebook/jest/issues/9771
// Requires weird jest configuration (jest.config.js)

const resolver = require('enhanced-resolve').create.sync({
    conditionNames: ['require', 'node', 'default'],
    extensions: ['.js', '.json', '.node', '.ts', '.tsx'],
})

 
module.exports = function (request, options) {
// list global module that must be resolved by defaultResolver here
    if (request.includes("tslib.js")) {
        request = request.replace("tslib.js", "tslib.es6.js")
    }
    return options.defaultResolver(request, options)
}

/** @type {import('vls').VeturConfig} */
module.exports = {
    // **optional** default: `[{ root: './' }]`
    // support monorepos
    projects: [
      {
        root: './frontend',
        tsconfig: "./tsconfig.json"
      }],
  }

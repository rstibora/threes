/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  testMatch: ["*/**/test*.ts"],
  moduleFileExtensions : ["ts", "js", "jsx", "tsx", "json", "node", "vue"],
  transform: {
    "^.+\\.vue$": "@vue/vue3-jest"
  },
  // Settings below are mabye incorrect, but otherwise export_maps_resolver.cjs did not work.
  globals: {
    'ts-jest': {
      useESM: true,
      tsconfig: "./tests-tsconfig.json"
    }
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  resolver: "./src/export_maps_resolver.cjs"
}

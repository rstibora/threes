# Current Setup
- base-tsconfig.json
    - only settings, no files, servers as a base for other tsconfigs
- tsconfig.json (aka ide tsconfig)
    - vscode uses tsconfig.json for ts features (.ts files)
    - vetur can be configured, currently uses tsconfig.json
- build-tsconfig.json
    - used by webpack and its plugins, excludes test files (they have not that great typing)
- test-tsconfig.sjon
    - used in test scenarios

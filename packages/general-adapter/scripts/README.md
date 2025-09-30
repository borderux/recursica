# General Adapter Scripts

## publish.mjs

Copies the built webworker file from `dist/webworker.js` to the repository root as `general-adapter-worker.js`.

### Usage

```bash
npm run publish
```

### What it does

1. Checks if `dist/webworker.js` exists (builds first if needed)
2. Copies the file to `../../general-adapter-worker.js` (repo root)
3. Provides feedback on success/failure

### Requirements

- Must be run from the `packages/general-adapter` directory
- Requires `dist/webworker.js` to exist (run `npm run build` first if needed)

### Output

The script will create `general-adapter-worker.js` in the repository root, which can be used by other parts of the system that need access to the general adapter webworker.

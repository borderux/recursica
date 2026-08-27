// Separate subpath (`@recursica/adapter-tester/testing`) so importing the
// reusable visual-regression suite factory doesn't pull `@playwright/test`
// into non-test contexts (e.g. playwright.config.ts) that only need
// `defineAdapterTesterConfig`/the harness helpers from the package root.
export { runVisualRegression } from "./testing/runVisualRegression.js";

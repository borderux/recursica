/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable turbo/no-undeclared-env-vars */
// Skip Husky install in production and CI
if (process.env.NODE_ENV === "production" || process.env.CI === "true") {
  process.exit(0);
}
const husky = (await import("husky")).default;
console.log(husky());

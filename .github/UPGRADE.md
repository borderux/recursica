# GitHub Actions Upgrade Guide

This document tracks major upgrades made to GitHub Actions workflows in this repository, so they can be easily referenced and applied to other projects.

## Node.js 24 Actions Upgrade (April 2026)

**Context**: GitHub announced the deprecation of Node.js 20 for their internal action runners, with Node 20 being removed entirely from the runners on September 16th, 2026.

To resolve the deprecation warnings and natively support the Node.js 24 runtime, the following core GitHub Actions were bumped to their newest major versions:

### 1. Update Core Action Versions

Replace the `@v4` workflow runner actions with their latest major versions across all `.github/workflows/*.yml` files:

- `actions/checkout@v4` ➡️ `actions/checkout@v6`
- `actions/setup-node@v4` ➡️ `actions/setup-node@v6`
- `actions/cache@v4` ➡️ `actions/cache@v5`

**Example Change:**

```yaml
- name: Checkout
-  uses: actions/checkout@v4
+  uses: actions/checkout@v6
```

### 2. Update Project Build Runtime to Node 24

Along with updating the internal action scripts, we unified the project's target build runtime (`node-version`) to `24`, which serves as the active standard node version and replaces the previous Node `20` and Node `22` LTS versions.

**Example Change:**

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v6
  with:
-   node-version: "20"
+   node-version: "24"
    cache: "npm"
```

> [!NOTE]
> If you have external, third-party actions that have not yet published a major version compatible with Node 24 and are outputting the deprecation warning, you can temporarily force them to use Node 24 by adding the following block globally within your workflow file:
>
> ```yaml
> env:
>   FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: "true"
> ```

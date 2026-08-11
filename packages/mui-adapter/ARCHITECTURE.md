# Architecture

## Overview

This document describes the high-level architecture and philosophy of the `@recursica/mui-adapter` package.

## Dependencies

- **`@mui/material`**: The underlying UI framework.
- **`@recursica/adapter-common`**: Shared primitives and hooks across all framework adapters.

## Key Design Decisions

- Components map closely to Material UI's structure but enforce Recursica design tokens.
- We avoid over-styling; components only diverge from MUI defaults when dictated by the Recursica design system.
- Each component adheres to the underlying UI-kit prop signature so that they can easily replace components in the existing code-base
- Recursica defines a set of common props that are shared across all framework adapters. These sometimes serve the same purpose as existing UI-kit props. In that case, the Recursica prop takes precedence and are the preferred way to achieve the desired effect.
- Adapter props are removed from the underlying UI-kit when it leads to behavior that Recursica does not support. Recursica is opinionated about the behavior of its components and does not support all of the behavior of the underlying UI-kit.

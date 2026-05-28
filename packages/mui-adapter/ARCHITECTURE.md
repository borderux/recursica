# Architecture

## Overview

This document describes the high-level architecture and philosophy of the `@recursica/mui-adapter` package.

## Dependencies

- **`@mui/material`**: The underlying UI framework.
- **`@recursica/adapter-common`**: Shared primitives and hooks across all framework adapters.

## Key Design Decisions

- Components map closely to Material UI's structure but enforce Recursica design tokens.
- We avoid over-styling; components only diverge from MUI defaults when dictated by the Recursica design system.

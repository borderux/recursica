# Architecture

## Overview

This document describes the high-level architecture of the `@recursica/schemas` package.

## Dependencies

- **AJV**: Used for JSON Schema validation.

## Key Design Decisions

- Central source of truth for Recursica JSON configuration shapes.
- TypeScript types are auto-generated from these schemas during the build process to ensure sync.

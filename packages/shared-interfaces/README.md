# @repo/shared-interfaces

Shared TypeScript interfaces and types for Recursica projects.

## Overview

This package provides a centralized collection of TypeScript interfaces and types that can be shared across different packages and applications in the Recursica monorepo. This ensures consistency and reduces code duplication.

## Installation

```bash
npm install @repo/shared-interfaces
```

## Usage

### Importing All Types

```typescript
import * from '@repo/shared-interfaces';
```

### Importing Specific Categories

```typescript
// Common types
import {
  BaseEntity,
  ApiResponse,
  PaginationParams,
} from "@repo/shared-interfaces/common";

// Design token types
import {
  DesignToken,
  ColorToken,
  TypographyToken,
} from "@repo/shared-interfaces/design-tokens";

// Configuration types
import {
  BaseConfig,
  ApiConfig,
  DatabaseConfig,
} from "@repo/shared-interfaces/config";

// Utility types
import {
  DeepPartial,
  AsyncFunction,
  ErrorWithContext,
} from "@repo/shared-interfaces/utils";
```

## Available Interfaces

### Common Types (`common.ts`)

- `BaseEntity` - Base interface for entities with ID and timestamps
- `ApiResponse<T>` - Generic API response structure
- `PaginationParams` - Pagination parameters
- `PaginatedResponse<T>` - Paginated response structure
- `Status` - Common status types
- `Environment` - Environment types
- `Dictionary<T>` - Generic dictionary/map type

### Design Token Types (`design-tokens.ts`)

- `DesignToken` - Basic design token interface
- `TokenType` - Supported token types
- `ColorToken` - Color-specific token interface
- `TypographyToken` - Typography-specific token interface
- `SpacingToken` - Spacing-specific token interface
- `TokenCollection` - Token collection interface
- `Theme` - Theme interface
- `DesignSystem` - Design system interface

### Configuration Types (`config.ts`)

- `BaseConfig` - Base configuration interface
- `ApiConfig` - API configuration
- `DatabaseConfig` - Database configuration
- `CacheConfig` - Cache configuration
- `LoggingConfig` - Logging configuration
- `BuildConfig` - Build configuration

### Utility Types (`utils.ts`)

- Type utilities: `Partial<T>`, `Required<T>`, `Pick<T, K>`, `Omit<T, K>`
- Advanced utilities: `DeepPartial<T>`, `DeepReadonly<T>`, `KeysOfType<T, U>`
- Function types: `AsyncFunction<T>`, `EventHandler<T>`, `Callback<T>`
- Constructor types: `Constructor<T>`, `AbstractConstructor<T>`
- Other utilities: `ValueOrFactory<T>`, `Serializable`, `ErrorWithContext`

## Examples

### Using API Response Types

```typescript
import { ApiResponse, PaginatedResponse } from "@repo/shared-interfaces";

// Simple API response
const response: ApiResponse<User> = {
  success: true,
  data: user,
  message: "User retrieved successfully",
};

// Paginated response
const users: PaginatedResponse<User> = {
  data: userArray,
  pagination: {
    page: 1,
    limit: 10,
    total: 100,
    totalPages: 10,
  },
};
```

### Using Design Token Types

```typescript
import { ColorToken, TypographyToken, Theme } from "@repo/shared-interfaces";

const primaryColor: ColorToken = {
  id: "color-primary",
  name: "Primary Color",
  type: "color",
  value: "#007bff",
  collection: "colors",
};

const headingFont: TypographyToken = {
  id: "typography-heading",
  name: "Heading Font",
  type: "typography",
  value: {
    fontFamily: "Inter",
    fontSize: 24,
    fontWeight: 600,
    lineHeight: 1.2,
  },
};
```

### Using Configuration Types

```typescript
import { ApiConfig, DatabaseConfig } from "@repo/shared-interfaces";

const apiConfig: ApiConfig = {
  baseUrl: "https://api.example.com",
  timeout: 5000,
  headers: { Authorization: "Bearer token" },
};

const dbConfig: DatabaseConfig = {
  host: "localhost",
  port: 5432,
  database: "recursica",
  username: "user",
  password: "password",
};
```

## Development

### Building

```bash
npm run build
```

### Type Checking

```bash
npm run check-types
```

### Linting

```bash
npm run lint
```

## Contributing

When adding new shared interfaces:

1. Place them in the appropriate category file (`common.ts`, `design-tokens.ts`, `config.ts`, or `utils.ts`)
2. If none of the existing categories fit, create a new file and export it from `index.ts`
3. Add comprehensive JSDoc documentation
4. Include examples in this README
5. Ensure the interfaces are generic enough to be useful across multiple projects

## License

MIT

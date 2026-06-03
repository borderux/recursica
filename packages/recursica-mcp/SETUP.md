# Setting Up Recursica MCP Server

Follow these instructions to configure and run the MCP server in your local development environment.

## 1. Installation

Install project dependencies:

```bash
npm install
```

## 2. Compile Server

Compile TypeScript source files into executable JavaScript:

```bash
npm run build
```

## 3. Run Visual MCP Inspector (with Hot-Reloading)

Launch the interactive, web-based playground interface in your browser to visually test all MCP tools:

```bash
npm run dev
```

_(This runs your TypeScript files directly on-the-fly using `tsx --watch`, automatically compiling and hot-reloading the server inside the inspector UI whenever you modify any `.ts` source files.)_

## 4. Run Unit Tests

Execute the Vitest mock-supported unit testing suite:

```bash
npm run test
```

# AGENT.md — eslint-plugin-recursica

This package is an ESLint plugin that enforces Recursica design-system conventions in applications consuming the Recursica adapters (`@recursica/mantine-adapter`, `@recursica/mui-adapter`).

## Purpose

Recursica components expose an `overStyled` escape hatch (see each adapter's `OVERSTYLING.md`) that lets a developer bypass the design-token sandbox. Because that's meant to be rare, auditable technical debt, this plugin's `no-over-styled` rule flags any use of the `overStyled` JSX attribute so it stays easy to grep for and review.

## Guidelines

- Each rule lives in its own file under `src/rules/`, with a co-located `<rule-name>.test.ts` using ESLint's `RuleTester`.
- Register new rules in both `rules` and (if they should be on by default) `configs.recommended` in `src/index.ts`.
- Rule severity ("warn" vs "error") is controlled by the consuming app's own ESLint config, not by rule options — don't add a custom option for this.
- This plugin only statically analyzes JSX; it can't catch `overStyled` passed through a spread (`{...props}`) or a dynamically-constructed prop object.

<critical_agent_directive>
STOP AND READ THIS FIRST.
If you are an AI agent writing stories:

1. You MUST use Component Story Format 3 (CSF3). Do not use the older `storiesOf` API or CSF2 syntax.
2. You must NEVER import `@mantine/core` raw components into Storybook. Everything rendered must be Recursica components.
3. Do NOT manually wrap stories in `<Layer>`. The global Storybook decorator already wraps every story in a `<Layer layer={0}>` with `layer`/`withLayer` Story Controls. Only add an explicit `<Layer layer={N}>` inside a story when demonstrating the component on a specific non-default/nested layer — never as the default pattern.
   </critical_agent_directive>

# Component Storybook Guide — Mantine Adapter

This document covers what's specific to writing stories in `mantine-adapter`. The full shared guide (CSF3 rules, the global Layer decorator, static-vs-default story conventions, composable-component patterns, ReadOnly and FormControlWrapper `argTypes`) lives in the canonical [`packages/adapter-common/docs/COMPONENT_STORYBOOK_GUIDE.md`](../../adapter-common/docs/COMPONENT_STORYBOOK_GUIDE.md), built on top of the component implementation described in [`docs/COMPONENT_DEV_GUIDE.md`](./COMPONENT_DEV_GUIDE.md) — read that first.

## Mantine-specific notes

There are currently no Mantine-specific overrides to the canonical Storybook guide — Mantine doesn't leak internal system props into Controls the way some other libraries do, so no extra filtering step is needed. This file exists so a future Mantine-only Storybook convention has a home without touching the shared guide.

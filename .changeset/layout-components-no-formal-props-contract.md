---
"@recursica/adapter-common": patch
"@recursica/mantine-adapter": patch
"@recursica/mui-adapter": patch
---

Layout components (Flex, Stack, Group, Grid) no longer share a formal Recursica prop contract from `adapter-common` — removed `RecursicaFlexProps`/`RecursicaStackProps`/`RecursicaGroupProps`/`RecursicaGridProps`/`RecursicaGridColProps`. Each adapter's layout components now simply pass through the underlying kit's own props, plus `rec-*` spacing token support.

- mantine-adapter: Flex/Stack/Group unchanged at the API level (Mantine's own props already matched). **Grid's `gap` prop reverts to Mantine's native `gutter`**; `Grid.Col`'s responsive breakpoint objects use Mantine's own `xs` (not the invented `base`) as the smallest key.
- mui-adapter: Flex/Group keep their Mantine-shaped props (MUI has no native equivalent). **Stack now passes through MUI's own `spacing`/`alignItems`/`justifyContent` directly** (fixes a bug where passing native `alignItems`/`justifyContent` was silently clobbered). **Grid is rebuilt on MUI's own vocabulary** (`spacing`, `size`, `offset`, `order`, `xs`/`sm`/`md`/`lg`/`xl`) instead of mirroring Mantine's `gap`/`span`/`base`; container-level `grow` is dropped in favor of MUI's native per-column `size="grow"`.

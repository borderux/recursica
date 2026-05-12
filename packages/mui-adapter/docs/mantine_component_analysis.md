# Mantine Component Analysis & Strategy

This document provides a comprehensive component mapping between **Mantine** (v8) and **Recursica**. It identifies 1-to-1 mappings, highlights areas where Mantine lacks native support, and establishes a strategy for closing the gap on missing primitives.

## 1. Recursica to Mantine Mapping

The Recursica UI-Kit components map to Mantine components as detailed below.

| Recursica Component   | Mantine Component to Wrap | Mantine Package     | Details                                                             |
| :-------------------- | :------------------------ | :------------------ | :------------------------------------------------------------------ |
| **Badge**             | `Badge`                   | `@mantine/core`     | Direct 1-to-1 wrap.                                                 |
| **Breadcrumb**        | `Breadcrumbs`             | `@mantine/core`     | Direct 1-to-1 wrap.                                                 |
| **Card**              | `Card`                    | `@mantine/core`     | Direct 1-to-1 wrap.                                                 |
| **Checkbox**          | `Checkbox`                | `@mantine/core`     | Direct 1-to-1 wrap.                                                 |
| **Chip**              | `Chip`                    | `@mantine/core`     | Direct 1-to-1 wrap.                                                 |
| **Date Picker**       | `DatePickerInput`         | `@mantine/dates`    | Direct 1-to-1 wrap.                                                 |
| **Dropdown**          | `Select`                  | `@mantine/core`     | Standard select/dropdown field.                                     |
| **File Input**        | `FileInput`               | `@mantine/core`     | Direct 1-to-1 wrap.                                                 |
| **File Upload**       | `Dropzone`                | `@mantine/dropzone` | Covers standard file dragging and dropping.                         |
| **Hover card**        | `HoverCard`               | `@mantine/core`     | Direct 1-to-1 wrap.                                                 |
| **Link**              | `Anchor`                  | `@mantine/core`     | Direct 1-to-1 wrap.                                                 |
| **Loader**            | `Loader`                  | `@mantine/core`     | Direct 1-to-1 wrap.                                                 |
| **Menu**              | `Menu`                    | `@mantine/core`     | Direct 1-to-1 wrap.                                                 |
| **Modal**             | `Modal`                   | `@mantine/core`     | Direct 1-to-1 wrap.                                                 |
| **Number input**      | `NumberInput`             | `@mantine/core`     | Direct 1-to-1 wrap.                                                 |
| **Pagination**        | `Pagination`              | `@mantine/core`     | Direct 1-to-1 wrap.                                                 |
| **Panel**             | `Drawer`                  | `@mantine/core`     | Maps to the sliding side-panel interaction in Recursica.            |
| **Popover**           | `Popover`                 | `@mantine/core`     | Direct 1-to-1 wrap.                                                 |
| **Radio**             | `Radio`                   | `@mantine/core`     | Direct 1-to-1 wrap.                                                 |
| **Read-only field**   | `Input.Wrapper` + `Text`  | `@mantine/core`     | Custom layout to match form design but prevent text editing.        |
| **Search**            | `TextInput`               | `@mantine/core`     | Pre-configured with a magnifying glass search icon (`leftSection`). |
| **Segmented control** | `SegmentedControl`        | `@mantine/core`     | Direct 1-to-1 wrap.                                                 |
| **Slider**            | `Slider`                  | `@mantine/core`     | Direct 1-to-1 wrap.                                                 |
| **Stepper**           | `Stepper`                 | `@mantine/core`     | Direct 1-to-1 wrap.                                                 |
| **Switch**            | `Switch`                  | `@mantine/core`     | Direct 1-to-1 wrap.                                                 |
| **Table**             | `Table`                   | `@mantine/core`     | Direct 1-to-1 wrap.                                                 |
| **Tabs**              | `Tabs`                    | `@mantine/core`     | Direct 1-to-1 wrap.                                                 |
| **Text area**         | `Textarea`                | `@mantine/core`     | Direct 1-to-1 wrap.                                                 |
| **Text field**        | `TextInput`               | `@mantine/core`     | Direct 1-to-1 wrap.                                                 |
| **Time picker**       | `TimeInput`               | `@mantine/dates`    | Direct 1-to-1 wrap.                                                 |
| **Timeline**          | `Timeline`                | `@mantine/core`     | Direct 1-to-1 wrap.                                                 |
| **Tooltip**           | `Tooltip`                 | `@mantine/core`     | Direct 1-to-1 wrap.                                                 |

---

## 2. Closing The Gap: Layout & Composition Strategy

Recursica aims to be an opinionated, paired-down UI library focusing on essentials, but it risks feeling incomplete—especially regarding fundamental layout composition. Mantine excels at providing unopinionated, highly robust layout primitives.

To strike a balance between remaining opinionated while avoiding re-inventing the wheel, we should adopt a **"Semantic Passthrough"** approach.

### The Semantic Gap Principle

Recursica acts as the ultimate source of truth for design tokens (color, spacing, etc.), matching Figma terminology 1:1. We explicitly **do not** convert Recursica tokens into a standard Mantine Theme because doing so causes a divergence in terminology between developers and designers.

Therefore, when bringing Mantine's core layout mechanics into Recursica, we cannot just export them directly. We must wrap them in a clean Recursica API that intercepts and translates our semantic tokens to CSS variables so that they bypass Mantine's theme system.

> [!TIP] > **Recommendation:** Expand Recursica with a new "Layout/Primitives" pillar that wraps Mantine's unopinionated structural tools. These wrappers will expose Recursica-specific props (e.g. `gap="spacing-200"`) and inject the exact `var(--recursica-spacing-200)` layout tokens into Mantine's styles.

### Essential Wrappers Needed for Completeness

To solve the deficiency without introducing bloat, we must add wrappers for these critical components. Each of these will intercept and pass through Recursica design tokens rather than Mantine's theme integers (e.g. `p="spacing-400"` resolving to `var(--recursica-spacing-400)`).

#### 1. Core Application Shell & Scrolling

| Mantine Component | Why Recursica Needs It                                                                                                                                                                      |
| :---------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`AppShell`**    | _Critical missing piece._ Provides the high-level scaffolding mechanism (Headers, Navbars, Asides, Footers) required to assemble an actual web application layout out of atomic components. |
| **`ScrollArea`**  | Essential for unified, cross-browser scrollbars. Crucial for custom dropdowns, side-panels (`Drawer`), and tabular data.                                                                    |

#### 2. Layout Positioning Primitives

| Mantine Component         | Why Recursica Needs It                                                                                                                                                     |
| :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`Stack` & `Group`**     | Standardizes one-dimensional spacing. `Stack` manages vertical rhythm (column lists, form spacing), while `Group` manages horizontal flow. Eliminates 90% of marginal CSS. |
| **`Flex`**                | The raw CSS flexbox wrapper for custom UI assemblies.                                                                                                                      |
| **`Grid` & `SimpleGrid`** | Standardizes responsive, breakpoint-driven row and column systems.                                                                                                         |
| **`Container`**           | Standardized max-width constraints for centralizing page content across different viewport sizes.                                                                          |
| **`Center`**              | A critical convenience wrapper for perfect X/Y centering.                                                                                                                  |

#### 3. Fundamental Utilities & Feedback

| Mantine Component    | Why Recursica Needs It                                                                                                                                                                         |
| :------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`ActionIcon`**     | Recursica has standard Buttons, but rendering isolated icon-only interaction targets requires `ActionIcon` bindings for proper dimensions and accessibility.                                   |
| **`Alert`**          | Inline status messages and banners for page-level or section-level feedback (distinct from floating Toasts).                                                                                   |
| **`Skeleton`**       | Crucial for rendering modern perceived-performance loading states.                                                                                                                             |
| **`Divider`**        | The standard thematic horizontal/vertical separator.                                                                                                                                           |
| **`Text` & `Title`** | Wrapping text primitives guarantees that the application adheres strictly to the `adapter-common` font tracking, line heights, and typography weights without relying on un-scoped `<p>` tags. |

---

## 3. Architectural Exceptions

The following components require non-standard mappings or custom hook wrappers.

### Transfer list

**The Problem**: Mantine completely removed the `TransferList` component in Mantine **v7/v8** due to accessibility and architectural complexity.  
**How to Handle**: We'll need to build a custom `TransferList` wrapper using atomic Mantine components. We can create two `ScrollArea` containers filled with `Checkbox` objects inside `List` elements, and place `Button` actions in the center.

### Toast

**The Problem**: Mantine implements Toasts (Notifications) through an imperative function API (`notifications.show()`) instead of a declarative `<Toast />` JSX element.  
**How to Handle**: Instead of exposing a `<Toast />` component directly, we should expose a Recursica Context/Hook (e.g., `useToast()`) that internally wraps Mantine's `@mantine/notifications`.

---

## 4. Completeness Summary

Based on Recursica's 34 explicitly defined components plus the 14 essential architectural additions recommended above, the target scope for the opinionated library is **48 unified components/wrappers**.

Here is the completeness breakdown of what Recursica currently has documented/shelled versus the target goal:

| Category                    | Defined in Recursica                                               | Required Additions                                              | % Complete |
| :-------------------------- | :----------------------------------------------------------------- | :-------------------------------------------------------------- | :--------- |
| **Inputs & Forms**          | **14** (Checkbox, Text field, Dropdown, Date Picker, Switch, etc.) | **0**                                                           | **100%**   |
| **Navigation & Action**     | **8** (Breadcrumb, Link, Menu, Tabs, Pagination, Button, etc.)     | **1** (`ActionIcon`)                                            | **88%**    |
| **Data Display & Feedback** | **10** (Badge, Card, Table, Loader, Timeline, Toast, etc.)         | **4** (`Text`, `Alert`, `Divider`, `Skeleton`)                  | **71%**    |
| **Overlays & Scaffolding**  | **2** (Modal, Panel)                                               | **2** (`AppShell`, `ScrollArea`)                                | **50%**    |
| **Layout Positioning**      | **0**                                                              | **6** (`Stack`, `Group`, `Flex`, `Grid`, `Container`, `Center`) | **0%**     |
| **Total Target System**     | **34**                                                             | **13**                                                          | **~72%**   |

### Takeaways

- Recursica is incredibly robust when it comes to **Inputs & Forms** (100%), covering almost everything a modern SaaS product requires.
- The system is critically deficient in **Layout Positioning** (0%), representing the biggest immediate gap to cross for developers trying to assemble views.
- Once the 13 recommended wrappers are introduced alongside the existing 34 shells, Recursica will operate as a fully comprehensive UI architecture matching the utility level of Mantine, while remaining significantly leaner and natively semantic.

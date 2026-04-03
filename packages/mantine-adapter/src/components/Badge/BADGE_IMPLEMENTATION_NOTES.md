# Badge Implementation Notes

This document captures specific decisions, regressions, and structural compromises made when integrating Mantine's `Badge` component into the Recursica styling system.

## 1. Stripped Size Properties

As logged in `COMPONENT_ISSUES.md`, there are currently no Figma variables mapped for different `size` variants (`small`, `default`, etc.). The component explicitly `Omit`s the Mantine `size` property from its signature to prevent integrators from attempting to drive sizes that do not exist in the tokens.

## 2. Intent-Based Variants

Mantine supports multiple visual variants (`outline`, `filled`, `light`). However, the existing variable schema for `Badge` only defines "Styles" which act as intents (`alert`, `primary-color`, `success`, `warning`).

- Default is arbitrarily mapped to `primary-color` as we lack a pure `neutral` schema right now.
- `variant` mapped to underlying Mantine prop has been hardcoded to `filled`, since the Recursica coloring fully replaces the Mantine DOM.

## 3. The `overStyled` Prop

This component implements the newly added `overStyled` architectural standard. By default, passing inline `{style}` React properties to `Badge` will be ignored. This prevents accidental cascading regressions of our strict CSS-variables layouts unless a developer explicitly forces `overStyled={true}`.

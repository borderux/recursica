# Stepper Implementation Notes

- **Compositional API Dropped:** Mantine manages stepper state and content via `<Stepper.Step>` and `<Stepper.Completed>`. MUI delegates content rendering to the developer and focuses purely on the stepper visual layout using `<Step>`, `<StepLabel>`, etc.
- **Monolithic API Adopted:** Following architectural review, we have abandoned the fabricated context wrappers for `mui-adapter`. We now natively export `Stepper`, `Step`, `StepLabel`, `StepButton`, and `StepConnector` wrapping their `@mui/material` counterparts. Developers are expected to manage the active step logic and content rendering outside the `Stepper` component, consistent with MUI patterns. Storybook tests have been updated to reflect this divergence while retaining core visual compatibility.

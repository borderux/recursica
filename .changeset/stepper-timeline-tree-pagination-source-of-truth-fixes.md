---
"@recursica/mui-adapter": patch
"@recursica/mantine-adapter": patch
---

mui-adapter: Stepper's connector gap, description content, and button spacing now match mantine; Stepper vertical spacing now matches mantine; Timeline's connector now reaches the next bullet; Tree's chevron-to-label gap now uses the right token; Pagination is now fully wired up (circle size/colors/outline, chevron colors/hover, ripple removed, ellipsis centering, text labels).
mantine-adapter: Stepper's completed/current label and description colors now apply (were silently falling back to Mantine's own default gray/black).
